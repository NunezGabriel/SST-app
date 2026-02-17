const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Solo ADMIN puede gestionar usuarios
router.get("/", authMiddleware, adminOnly, usuarioController.listarUsuarios);
router.get("/:id", authMiddleware, adminOnly, usuarioController.obtenerUsuario);
router.post("/", authMiddleware, adminOnly, usuarioController.crearUsuario);
router.put("/:id", authMiddleware, adminOnly, usuarioController.actualizarUsuario);
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  usuarioController.desactivarUsuario
);

module.exports = router;
