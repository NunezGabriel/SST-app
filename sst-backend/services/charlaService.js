const prisma = require("../prisma");
const charlaRepository = require("../repositories/charlaRepository");
const progresoCharlaRepository = require("../repositories/progresoCharlaRepository");
const notificacionService = require("./notificacionService");
const logroService = require("./logroService");

function listarCharlasAdmin() {
  return charlaRepository.findAll();
}

async function listarCharlasDeUsuario(usuarioId) {
  // Obtener todas las charlas con LEFT JOIN a ProgresoCharla
  // Si no existe progreso, se muestra como PENDIENTE
  const charlas = await prisma.charla.findMany({
    orderBy: { fechaCharla: "asc" },
  });

  const progresos = await prisma.progresoCharla.findMany({
    where: { idUsuario: usuarioId },
    select: {
      idCharla: true,
      estado: true,
      fechaCompletada: true,
    },
  });

  // Crear un mapa de progresos por charlaId para acceso rápido
  const progresoMap = new Map();
  progresos.forEach((p) => {
    progresoMap.set(p.idCharla, p);
  });

  // Combinar charlas con sus progresos (si existen)
  return charlas.map((charla) => {
    const progreso = progresoMap.get(charla.id);
    return {
      id: charla.id,
      nombre: charla.nombre,
      enlace: charla.enlace,
      etiqueta: charla.etiqueta,
      fechaCharla: charla.fechaCharla,
      estado: progreso ? progreso.estado : "PENDIENTE",
      fechaCompletada: progreso ? progreso.fechaCompletada : null,
    };
  });
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

    // NOTA: No se crean ProgresoCharla automáticamente para evitar muchos registros
    // Se crearán solo cuando el usuario interactúe con la charla desde el frontend
    // Solo se envía notificación
    const workers = await tx.usuario.findMany({
      where: { tipo: "WORKER", activo: true },
    });

    if (workers.length > 0) {
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
  // Verificar si existe la charla
  const charla = await charlaRepository.findById(charlaId);
  if (!charla) {
    throw new Error("Charla no encontrada");
  }

  // Buscar o crear el progreso
  let progreso = await progresoCharlaRepository.findByUsuarioYCharla(
    usuarioId,
    charlaId
  );

  // Si no existe progreso, crearlo
  if (!progreso) {
    progreso = await prisma.progresoCharla.create({
      data: {
        idUsuario: usuarioId,
        idCharla: charlaId,
        estado: "COMPLETADA",
        fechaCompletada: new Date(),
      },
    });
  } else {
    // Si ya está completada, retornar sin cambios
    if (progreso.estado === "COMPLETADA") {
      return progreso;
    }

    // Actualizar a completada
    progreso = await progresoCharlaRepository.update(progreso.id, {
      estado: "COMPLETADA",
      fechaCompletada: new Date(),
    });
  }

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

  return progreso;
}

module.exports = {
  listarCharlasAdmin,
  listarCharlasDeUsuario,
  crearCharla,
  actualizarCharla,
  eliminarCharla,
  marcarCharlaCompletada,
};

