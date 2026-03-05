const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const usuarioRepository = require("../repositories/usuarioRepository");

// Helper: include sede en queries
const INCLUDE_SEDE = { sede: { select: { id: true, nombre: true } } };

async function crearUsuarioConAsignaciones(data) {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  return prisma.$transaction(async (tx) => {
    const nuevoUsuario = await tx.usuario.create({
      data: {
        nombre:    data.nombre,
        apellido:  data.apellido,
        dni:       data.dni,
        correo:    data.correo,
        contrasena: hashedPassword,
        tipo:      data.tipo || "WORKER",
        telefono:  data.telefono || null,
        idSede:    Number(data.idSede),   // ← FK numérica
      },
      include: INCLUDE_SEDE,
    });

    if (nuevoUsuario.tipo === "WORKER") {
      const documentos = await tx.documentoSeguridad.findMany();
      const logros     = await tx.logro.findMany();

      if (documentos.length > 0) {
        await tx.visualizacionDocumento.createMany({
          data: documentos.map((doc) => ({
            idUsuario:  nuevoUsuario.id,
            idDocumento: doc.id,
            estado:     "SIN_VER",
          })),
        });
      }

      if (logros.length > 0) {
        await tx.usuarioLogro.createMany({
          data: logros.map((logro) => ({
            idUsuario: nuevoUsuario.id,
            idLogro:   logro.id,
            estado:    "PENDIENTE",
          })),
        });
      }

      await tx.bloqueoExamen.create({
        data: { idUsuario: nuevoUsuario.id, intentosUsados: 0 },
      });
    }

    return nuevoUsuario;
  });
}

async function listarUsuarios() {
  return prisma.usuario.findMany({
    include: INCLUDE_SEDE,
    orderBy: { fechaCreacion: "desc" },
  });
}

async function listarUsuariosConStats() {
  const usuarios     = await listarUsuarios();
  const totalCharlas = await prisma.charla.count();

  const usuariosConStats = await Promise.all(
    usuarios.map(async (u) => {
      if (u.tipo !== "WORKER") {
        return { ...u, charlasCompletadas: null, totalCharlas: null, examenStatus: "—", cumpl: null };
      }

      const charlasCompletadas = await prisma.progresoCharla.count({
        where: { idUsuario: u.id, estado: "COMPLETADA" },
      });

      const ahora = new Date();
      let examenStatus = "No aprobado";

      const bloqueo = await prisma.bloqueoExamen.findUnique({ where: { idUsuario: u.id } });

      if (bloqueo?.bloqueadoHasta && bloqueo.bloqueadoHasta > ahora) {
        examenStatus = "Bloqueada";
      } else {
        const intentoAprobado = await prisma.intentoExamen.findFirst({
          where: { idUsuario: u.id, aprobado: true },
        });
        examenStatus = intentoAprobado ? "Aprobado" : "No aprobado";
      }

      const cumpl = totalCharlas > 0 ? Math.round((charlasCompletadas / totalCharlas) * 100) : 0;

      return { ...u, charlasCompletadas, totalCharlas, examenStatus, cumpl };
    })
  );

  return usuariosConStats;
}

async function obtenerUsuarioPorId(id) {
  return prisma.usuario.findUnique({
    where: { id },
    include: INCLUDE_SEDE,
  });
}

async function actualizarUsuario(id, data) {
  const updateData = {
    nombre:   data.nombre,
    apellido: data.apellido,
    dni:      data.dni,
    correo:   data.correo,
    tipo:     data.tipo,
    telefono: data.telefono || null,
    idSede:   Number(data.idSede),
  };

  if (data.contrasena) {
    updateData.contrasena = await bcrypt.hash(data.contrasena, 10);
  }

  return prisma.usuario.update({
    where: { id },
    data: updateData,
    include: INCLUDE_SEDE,
  });
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
  listarUsuariosConStats,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
};