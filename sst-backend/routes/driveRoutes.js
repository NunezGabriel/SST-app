const express = require("express");
const multer  = require("multer");
const driveController = require("../controllers/driveController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// IMPORTANTE: rutas específicas ANTES de las genéricas con parámetros
router.get("/estado-mes",   authMiddleware, driveController.getEstadoMes);
router.get("/carpeta-ruta", authMiddleware, driveController.listarPorRuta);
router.get("/link-mes",     authMiddleware, driveController.getLinkMes);

router.get("/",             authMiddleware, driveController.listarArchivos);
router.post("/upload",      authMiddleware, upload.array("files", 10), driveController.subirArchivo);
router.post("/carpeta",     authMiddleware, driveController.crearCarpeta);
router.delete("/:fileId",   authMiddleware, driveController.eliminar);

module.exports = router;