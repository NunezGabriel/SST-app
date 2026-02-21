const induccionService = require("../services/induccionService");

async function obtenerInduccion(req, res) {
  try {
    const induccion = await induccionService.obtenerInduccion();
    // Si no hay registros, devolver valores por defecto en lugar de 404
    if (!induccion) {
      return res.json({
        id: 0,
        linkDiapo: "",
        linkPdf: "",
        linkVideo: "",
        duracion: 10,
        fechaActualizacion: new Date().toISOString(),
      });
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
