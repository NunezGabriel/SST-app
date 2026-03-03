const driveService = require("../services/driveService");

// GET /api/drive?folderId=xxx
async function listarArchivos(req, res) {
  try {
    const { folderId } = req.query;
    const archivos = await driveService.listarArchivos(folderId);
    res.json({ files: archivos });
  } catch (error) {
    console.error("Error al listar archivos de Drive:", error);
    res.status(500).json({ error: "Error al listar archivos de Drive" });
  }
}

// POST /api/drive/upload
// Body (multipart/form-data):
//   file     → archivo binario
//   rol      → "WORKER" | "ADMIN"
//   brigada  → "Chiclayo"
//   mes      → "Octubre"
//   semana   → "01 al 07 de Octubre"
//   tipoDoc  → "ATS - Charla 5 min"
async function subirArchivo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    const { rol, brigada, mes, semana, tipoDoc } = req.body;

    if (!rol || !brigada || !mes || !semana || !tipoDoc) {
      return res.status(400).json({ error: "Faltan datos: rol, brigada, mes, semana, tipoDoc" });
    }

    const resultado = await driveService.subirArchivo({
      file: req.file,
      rol,
      brigada,
      mes,
      semana,
      tipoDoc,
    });

    res.json({
      message: "Archivo subido correctamente",
      archivo: resultado,
    });
  } catch (error) {
    console.error("Error al subir archivo a Drive:", error);
    res.status(500).json({ error: "Error al subir archivo a Drive" });
  }
}

module.exports = { listarArchivos, subirArchivo };