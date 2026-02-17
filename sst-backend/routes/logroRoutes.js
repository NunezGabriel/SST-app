const express = require("express");
const logroController = require("../controllers/logroController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin - gestión de logros
router.get("/admin", authMiddleware, adminOnly, logroController.listarLogrosSistema);
router.post("/", authMiddleware, adminOnly, logroController.crearLogro);
router.put("/:id", authMiddleware, adminOnly, logroController.actualizarLogro);
router.delete("/:id", authMiddleware, adminOnly, logroController.eliminarLogro);

// Worker - ver sus logros
router.get("/", authMiddleware, logroController.listarLogrosUsuario);

module.exports = router;
