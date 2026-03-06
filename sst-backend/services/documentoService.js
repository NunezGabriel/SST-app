const prisma = require("../prisma");
const documentoRepository = require("../repositories/documentoRepository");
const visualizacionDocumentoRepository = require("../repositories/visualizacionDocumentoRepository");
const notificacionService = require("./notificacionService");
const logroService = require("./logroService");

function listarDocumentosAdmin() {
  return documentoRepository.findAll();
}

async function listarDocumentosDeUsuario(usuarioId) {
  const visualizaciones =
    await visualizacionDocumentoRepository.findByUsuario(usuarioId);
  return visualizaciones.map((v) => ({
    id: v.documento.id,
    nombre: v.documento.nombre,
    tipo: v.documento.tipo,
    enlace: v.documento.enlace,
    fechaActualizacion: v.documento.fechaActualizacion,
    estado: v.estado,
    fechaVisualizacion: v.fechaVisualizacion,
  }));
}

async function crearDocumento(data) {
  return prisma.$transaction(async (tx) => {
    const nuevoDocumento = await tx.documentoSeguridad.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo,
        enlace: data.enlace,
      },
    });

    const workers = await tx.usuario.findMany({
      where: { tipo: "WORKER", activo: true },
    });

    if (workers.length > 0) {
      await tx.visualizacionDocumento.createMany({
        data: workers.map((u) => ({
          idUsuario: u.id,
          idDocumento: nuevoDocumento.id,
          estado: "SIN_VER",
        })),
      });

      await notificacionService.crearNotificacionesParaUsuarios(
        workers.map((u) => ({
          idUsuario: u.id,
          nombre: "Nuevo documento de seguridad",
          descripcion: `Se ha publicado el documento: ${nuevoDocumento.nombre}`,
          tipo: "NUEVO",
        }))
      );
    }

    return nuevoDocumento;
  });
}

function actualizarDocumento(id, data) {
  return documentoRepository.update(id, data);
}

function eliminarDocumento(id) {
  return documentoRepository.remove(id);
}

async function marcarDocumentoVisto(usuarioId, documentoId) {
  const visualizacion =
    await visualizacionDocumentoRepository.findByUsuarioYDocumento(
      usuarioId,
      documentoId
    );

  if (!visualizacion) {
    throw new Error("Documento no asignado al usuario");
  }

  if (visualizacion.estado === "VISTO") {
    return visualizacion;
  }

  const resultado = await visualizacionDocumentoRepository.update(visualizacion.id, {
    estado: "VISTO",
    fechaVisualizacion: new Date(),
  });

  // Logro: "Documentos Completos" — cuando el worker ha visto todos sus documentos
  const totalDocs  = await prisma.visualizacionDocumento.count({ where: { idUsuario: usuarioId } });
  const vistosDocs = await prisma.visualizacionDocumento.count({ where: { idUsuario: usuarioId, estado: "VISTO" } });

  if (totalDocs > 0 && vistosDocs === totalDocs) {
    await logroService.desbloquearLogroPorNombre(usuarioId, "Documentos Completos");
  }

  return resultado;
}

module.exports = {
  listarDocumentosAdmin,
  listarDocumentosDeUsuario,
  crearDocumento,
  actualizarDocumento,
  eliminarDocumento,
  marcarDocumentoVisto,
};

