const express = require("express");
const multer = require("multer");
const driveController = require("../controllers/driveController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// multer en memoria — el buffer se pasa directo a Drive sin guardar en disco
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB máximo
});

router.get("/estado-mes", authMiddleware, driveController.getEstadoMes);

// GET  /api/drive?folderId=xxx
router.get("/", authMiddleware, driveController.listarArchivos);

// POST /api/drive/upload  (multipart/form-data)
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  driveController.subirArchivo,
);

// POST /api/drive/carpeta
router.post("/carpeta", authMiddleware, driveController.crearCarpeta);

// DELETE /api/drive/:fileId
router.delete("/:fileId", authMiddleware, driveController.eliminar);

module.exports = router;
