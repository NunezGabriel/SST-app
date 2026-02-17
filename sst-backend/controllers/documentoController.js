const documentoService = require("../services/documentoService");

async function listarDocumentosAdmin(req, res) {
  try {
    const documentos = await documentoService.listarDocumentosAdmin();
    res.json(documentos);
  } catch (error) {
    console.error("Error al listar documentos (admin):", error);
    res.status(500).json({ error: "Error al listar documentos" });
  }
}

async function listarDocumentosUsuario(req, res) {
  try {
    const usuarioId = req.user.id;
    const documentos = await documentoService.listarDocumentosDeUsuario(
      usuarioId
    );
    res.json(documentos);
  } catch (error) {
    console.error("Error al listar documentos del usuario:", error);
    res.status(500).json({ error: "Error al listar documentos del usuario" });
  }
}

async function crearDocumento(req, res) {
  try {
    const { nombre, tipo, enlace } = req.body;

    if (!nombre || !tipo || !enlace) {
      return res
        .status(400)
        .json({ error: "nombre, tipo y enlace son obligatorios" });
    }

    const documento = await documentoService.crearDocumento({
      nombre,
      tipo,
      enlace,
    });

    res.status(201).json(documento);
  } catch (error) {
    console.error("Error al crear documento:", error);
    res.status(500).json({ error: "Error al crear documento" });
  }
}

async function actualizarDocumento(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const documento = await documentoService.actualizarDocumento(id, data);
    res.json(documento);
  } catch (error) {
    console.error("Error al actualizar documento:", error);
    res.status(500).json({ error: "Error al actualizar documento" });
  }
}

async function eliminarDocumento(req, res) {
  try {
    const id = Number(req.params.id);
    await documentoService.eliminarDocumento(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar documento:", error);
    res.status(500).json({ error: "Error al eliminar documento" });
  }
}

async function marcarDocumentoVisto(req, res) {
  try {
    const usuarioId = req.user.id;
    const documentoId = Number(req.params.id);

    const resultado = await documentoService.marcarDocumentoVisto(
      usuarioId,
      documentoId
    );

    res.json(resultado);
  } catch (error) {
    console.error("Error al marcar documento como visto:", error);
    res
      .status(400)
      .json({ error: error.message || "Error al marcar documento como visto" });
  }
}

module.exports = {
  listarDocumentosAdmin,
  listarDocumentosUsuario,
  crearDocumento,
  actualizarDocumento,
  eliminarDocumento,
  marcarDocumentoVisto,
};

