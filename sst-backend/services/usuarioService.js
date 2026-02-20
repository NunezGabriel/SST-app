const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const usuarioRepository = require("../repositories/usuarioRepository");

async function crearUsuarioConAsignaciones(data) {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  return prisma.$transaction(async (tx) => {
    const nuevoUsuario = await tx.usuario.create({
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        dni: data.dni,
        correo: data.correo,
        contrasena: hashedPassword,
        tipo: data.tipo || "WORKER",
      },
    });

    // Solo hacer asignaciones automáticas para workers
    if (nuevoUsuario.tipo === "WORKER") {
      const charlas = await tx.charla.findMany();
      const documentos = await tx.documentoSeguridad.findMany();
      const logros = await tx.logro.findMany();

      if (charlas.length > 0) {
        await tx.progresoCharla.createMany({
          data: charlas.map((charla) => ({
            idUsuario: nuevoUsuario.id,
            idCharla: charla.id,
            estado: "PENDIENTE",
          })),
        });
      }

      if (documentos.length > 0) {
        await tx.visualizacionDocumento.createMany({
          data: documentos.map((doc) => ({
            idUsuario: nuevoUsuario.id,
            idDocumento: doc.id,
            estado: "SIN_VER",
          })),
        });
      }

      if (logros.length > 0) {
        await tx.usuarioLogro.createMany({
          data: logros.map((logro) => ({
            idUsuario: nuevoUsuario.id,
            idLogro: logro.id,
            estado: "PENDIENTE",
          })),
        });
      }

      // Crear registro de control de examen (BloqueoExamen)
      await tx.bloqueoExamen.create({
        data: {
          idUsuario: nuevoUsuario.id,
          intentosUsados: 0,
          bloqueadoHasta: null,
          fechaUltimoIntento: null,
        },
      });
    }

    return nuevoUsuario;
  });
}

async function listarUsuarios() {
  return usuarioRepository.findAll();
}

async function obtenerUsuarioPorId(id) {
  return usuarioRepository.findById(id);
}

async function actualizarUsuario(id, data) {
  const updateData = { ...data };

  if (data.contrasena) {
    updateData.contrasena = await bcrypt.hash(data.contrasena, 10);
  }

  return usuarioRepository.update(id, updateData);
}

async function desactivarUsuario(id) {
  return usuarioRepository.deactivate(id);
}

async function activarUsuario(id) {
  return usuarioRepository.activate(id);
}

async function eliminarUsuario(id) {
  return usuarioRepository.destroy(id);
}

module.exports = {
  crearUsuarioConAsignaciones,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
};

