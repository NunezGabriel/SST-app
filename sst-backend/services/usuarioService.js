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
        telefono: data.telefono || null,
        sede: data.sede || "TRUJILLO",
      },
    });

    // Solo hacer asignaciones automáticas para workers
    if (nuevoUsuario.tipo === "WORKER") {
      // NOTA: No se crean ProgresoCharla automáticamente para evitar 365 registros por usuario
      // Se crearán solo cuando el usuario interactúe con una charla desde el frontend
      
      const documentos = await tx.documentoSeguridad.findMany();
      const logros = await tx.logro.findMany();

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

async function listarUsuariosConStats() {
  // 1. Traer todos los usuarios
  const usuarios = await usuarioRepository.findAll();

  // 2. Total de charlas en el sistema
  const totalCharlas = await prisma.charla.count();

  // 3. Para cada usuario, calcular sus stats en paralelo
  const usuariosConStats = await Promise.all(
    usuarios.map(async (u) => {
      if (u.tipo !== "WORKER") {
        return { ...u, charlasCompletadas: null, totalCharlas: null, examenStatus: "—", cumpl: null };
      }

      // Charlas completadas
      const charlasCompletadas = await prisma.progresoCharla.count({
        where: { idUsuario: u.id, estado: "COMPLETADA" },
      });

      // Examen: chequear directamente en intentoExamen si hay algún aprobado
      const ahora = new Date();
      let examenStatus = "No aprobado";

      // Si está bloqueado actualmente → Bloqueada
      const bloqueo = await prisma.bloqueoExamen.findUnique({
        where: { idUsuario: u.id },
      });

      if (bloqueo && bloqueo.bloqueadoHasta && bloqueo.bloqueadoHasta > ahora) {
        examenStatus = "Bloqueada";
      } else {
        // Verificar directamente si algún intento fue aprobado
        const intentoAprobado = await prisma.intentoExamen.findFirst({
          where: { idUsuario: u.id, aprobado: true },
        });
        examenStatus = intentoAprobado ? "Aprobado" : "No aprobado";
      }

      // Cumplimiento: % de charlas completadas del total
      const cumpl = totalCharlas > 0
        ? Math.round((charlasCompletadas / totalCharlas) * 100)
        : 0;

      return {
        ...u,
        charlasCompletadas,
        totalCharlas,
        examenStatus,
        cumpl,
      };
    })
  );

  return usuariosConStats;
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
  listarUsuariosConStats,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
};