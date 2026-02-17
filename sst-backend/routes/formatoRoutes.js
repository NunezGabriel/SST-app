const express = require("express");
const formatoController = require("../controllers/formatoController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Público autenticado (workers y admins) - ver/descargar
router.get("/", authMiddleware, formatoController.listarFormatos);
router.get("/:id", authMiddleware, formatoController.obtenerFormato);

// Solo admin - gestión
router.post("/", authMiddleware, adminOnly, formatoController.crearFormato);
router.put("/:id", authMiddleware, adminOnly, formatoController.actualizarFormato);
router.delete("/:id", authMiddleware, adminOnly, formatoController.eliminarFormato);

module.exports = router;

