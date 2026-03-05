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
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No se recibió ningún archivo" });
    }

    const { rol, brigada, mes, semana, tipoDoc } = req.body;

    if (!rol || !brigada || !mes || !tipoDoc) {
      return res
        .status(400)
        .json({ error: "Faltan datos: rol, brigada, mes, tipoDoc" });
    }

    const resultados = await Promise.all(
      req.files.map((file) =>
        driveService.subirArchivo({ file, rol, brigada, mes, semana, tipoDoc })
      )
    );

    res.json({
      message: "Archivos subidos correctamente",
      archivos: resultados,
    });
  } catch (error) {
    console.error("Error al subir archivo a Drive:", error);
    res.status(500).json({ error: "Error al subir archivo a Drive" });
  }
}

// POST /api/drive/carpeta
async function crearCarpeta(req, res) {
  try {
    const { nombre, parentId } = req.body;
    if (!nombre)
      return res
        .status(400)
        .json({ error: "El nombre de la carpeta es requerido" });
    const carpeta = await driveService.crearCarpeta(nombre, parentId);
    res.json({ message: "Carpeta creada correctamente", carpeta });
  } catch (error) {
    console.error("Error al crear carpeta en Drive:", error);
    res.status(500).json({ error: "Error al crear carpeta en Drive" });
  }
}

// DELETE /api/drive/:fileId
async function eliminar(req, res) {
  try {
    const { fileId } = req.params;
    await driveService.eliminar(fileId);
    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar de Drive:", error);
    res.status(500).json({ error: "Error al eliminar de Drive" });
  }
}

// ─── AGREGAR al driveController.js ───────────────────────────────────────────

// GET /api/drive/estado-mes?mes=Marzo&rol=WORKER
async function getEstadoMes(req, res) {
  try {
    const { mes, rol } = req.query;
    if (!mes || !rol)
      return res.status(400).json({ error: "Faltan parámetros: mes, rol" });
    const estado = await driveService.getEstadoMes(mes, rol);
    res.json({ estado });
  } catch (error) {
    console.error("Error al obtener estado del mes:", error.message);
    res.status(500).json({ error: "Error al obtener estado del mes" });
  }
}

// GET /api/drive/carpeta-ruta?rol=WORKER&brigada=CHICLAYO&mes=Marzo&semana=01 al 07 de Marzo&tipoDoc=ATS - Charla 5 min
async function listarPorRuta(req, res) {
  try {
    const { rol, brigada, mes, semana, tipoDoc } = req.query;
    const archivos = await driveService.listarPorRuta({ rol, brigada, mes, semana, tipoDoc });
    res.json({ files: archivos });
  } catch (error) {
    console.error("Error al listar carpeta por ruta:", error.message);
    res.status(500).json({ error: "Error al listar carpeta por ruta" });
  }
}

// module.exports = { listarArchivos, subirArchivo, crearCarpeta, eliminar, getEstadoMes };

// ─── AGREGAR a driveRoutes.js ─────────────────────────────────────────────────
// IMPORTANTE: esta ruta debe ir ANTES de router.get("/") para evitar conflictos

// GET /api/drive/estado-mes?mes=Marzo&rol=WORKER
// router.get("/estado-mes", authMiddleware, driveController.getEstadoMes);

module.exports = {
  listarArchivos,
  subirArchivo,
  crearCarpeta,
  eliminar,
  getEstadoMes,
  listarPorRuta,
};
