const induccionService = require("../services/induccionService");

async function obtenerInduccion(req, res) {
  try {
    const induccion = await induccionService.obtenerInduccion();
    if (!induccion) {
      return res.status(404).json({ error: "Material de inducción no encontrado" });
    }
    res.json(induccion);
  } catch (error) {
    console.error("Error al obtener inducción:", error);
    res.status(500).json({ error: "Error al obtener material de inducción" });
  }
}

async function actualizarInduccion(req, res) {
  try {
    const { linkDiapo, linkPdf, linkVideo, duracion } = req.body;
    if (!linkDiapo || !linkPdf || !linkVideo || !duracion) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios (linkDiapo, linkPdf, linkVideo, duracion)",
      });
    }
    const induccion = await induccionService.actualizarInduccion({
      linkDiapo,
      linkPdf,
      linkVideo,
      duracion: Number(duracion),
    });
    res.json(induccion);
  } catch (error) {
    console.error("Error al actualizar inducción:", error);
    res.status(500).json({ error: "Error al actualizar material de inducción" });
  }
}

module.exports = {
  obtenerInduccion,
  actualizarInduccion,
};
