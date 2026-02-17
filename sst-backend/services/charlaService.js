const prisma = require("../prisma");
const charlaRepository = require("../repositories/charlaRepository");
const progresoCharlaRepository = require("../repositories/progresoCharlaRepository");
const notificacionService = require("./notificacionService");
const logroService = require("./logroService");

function listarCharlasAdmin() {
  return charlaRepository.findAll();
}

async function listarCharlasDeUsuario(usuarioId) {
  const progresos = await progresoCharlaRepository.findByUsuario(usuarioId);
  return progresos.map((p) => ({
    id: p.charla.id,
    nombre: p.charla.nombre,
    enlace: p.charla.enlace,
    etiqueta: p.charla.etiqueta,
    fechaCharla: p.charla.fechaCharla,
    estado: p.estado,
    fechaCompletada: p.fechaCompletada,
  }));
}

async function crearCharla(data) {
  return prisma.$transaction(async (tx) => {
    const nuevaCharla = await tx.charla.create({
      data: {
        nombre: data.nombre,
        enlace: data.enlace,
        etiqueta: data.etiqueta,
        fechaCharla: data.fechaCharla,
      },
    });

    const workers = await tx.usuario.findMany({
      where: { tipo: "WORKER", activo: true },
    });

    if (workers.length > 0) {
      await tx.progresoCharla.createMany({
        data: workers.map((u) => ({
          idUsuario: u.id,
          idCharla: nuevaCharla.id,
          estado: "PENDIENTE",
        })),
      });

      await notificacionService.crearNotificacionesParaUsuarios(
        workers.map((u) => ({
          idUsuario: u.id,
          nombre: "Nueva charla disponible",
          descripcion: `Se ha creado la charla: ${nuevaCharla.nombre}`,
          tipo: "NUEVO",
        }))
      );
    }

    return nuevaCharla;
  });
}

function actualizarCharla(id, data) {
  return charlaRepository.update(id, data);
}

function eliminarCharla(id) {
  return charlaRepository.remove(id);
}

async function marcarCharlaCompletada(usuarioId, charlaId) {
  const progreso = await progresoCharlaRepository.findByUsuarioYCharla(
    usuarioId,
    charlaId
  );

  if (!progreso) {
    throw new Error("Charla no asignada al usuario");
  }

  if (progreso.estado === "COMPLETADA") {
    return progreso;
  }

  const actualizado = await progresoCharlaRepository.update(progreso.id, {
    estado: "COMPLETADA",
    fechaCompletada: new Date(),
  });

  // Logro: "Primera Charla"
  const completadas = await prisma.progresoCharla.count({
    where: { idUsuario: usuarioId, estado: "COMPLETADA" },
  });
  if (completadas === 1) {
    await logroService.desbloquearLogroPorNombre(usuarioId, "Primera Charla");
  }

  // Logro: "Experto en SST" (todas las charlas)
  const totalCharlas = await prisma.charla.count();
  if (totalCharlas > 0 && completadas === totalCharlas) {
    await logroService.desbloquearLogroPorNombre(usuarioId, "Experto en SST");
  }

  return actualizado;
}

module.exports = {
  listarCharlasAdmin,
  listarCharlasDeUsuario,
  crearCharla,
  actualizarCharla,
  eliminarCharla,
  marcarCharlaCompletada,
};

