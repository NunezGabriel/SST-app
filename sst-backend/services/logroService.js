const prisma = require("../prisma");
const logroRepository = require("../repositories/logroRepository");
const usuarioLogroRepository = require("../repositories/usuarioLogroRepository");
const notificacionService = require("./notificacionService");

function listarLogrosSistema() {
  return logroRepository.findAll();
}

function crearLogro(data) {
  return prisma.$transaction(async (tx) => {
    const nuevoLogro = await tx.logro.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        icono: data.icono,
      },
    });

    // Asignar a todos los workers existentes como pendiente
    const workers = await tx.usuario.findMany({
      where: { tipo: "WORKER", activo: true },
    });

    if (workers.length > 0) {
      await tx.usuarioLogro.createMany({
        data: workers.map((u) => ({
          idUsuario: u.id,
          idLogro: nuevoLogro.id,
          estado: "PENDIENTE",
        })),
      });
    }

    return nuevoLogro;
  });
}

function actualizarLogro(id, data) {
  return logroRepository.update(id, data);
}

function eliminarLogro(id) {
  return logroRepository.remove(id);
}

function listarLogrosDeUsuario(usuarioId) {
  return usuarioLogroRepository.findByUsuario(usuarioId);
}

async function desbloquearLogroPorNombre(usuarioId, nombreLogro) {
  const logro = await logroRepository.findByNombre(nombreLogro);
  if (!logro) return null;

  const usuarioLogro = await usuarioLogroRepository.findByUsuarioYLogro(
    usuarioId,
    logro.id
  );

  if (!usuarioLogro || usuarioLogro.estado === "CONSEGUIDO") {
    return null;
  }

  const actualizado = await usuarioLogroRepository.update(usuarioLogro.id, {
    estado: "CONSEGUIDO",
    fechaConseguido: new Date(),
  });

  await notificacionService.crearNotificacionParaUsuario({
    idUsuario: usuarioId,
    nombre: `Logro desbloqueado: ${logro.nombre}`,
    descripcion: logro.descripcion || "",
    tipo: "LOGRO",
  });

  return actualizado;
}

module.exports = {
  listarLogrosSistema,
  crearLogro,
  actualizarLogro,
  eliminarLogro,
  listarLogrosDeUsuario,
  desbloquearLogroPorNombre,
};

