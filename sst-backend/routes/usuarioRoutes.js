const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Solo ADMIN puede gestionar usuarios
router.get("/", authMiddleware, adminOnly, usuarioController.listarUsuarios);
router.get("/stats", authMiddleware, adminOnly, usuarioController.listarUsuariosConStats);
router.get("/:id", authMiddleware, adminOnly, usuarioController.obtenerUsuario);
router.post("/", authMiddleware, adminOnly, usuarioController.crearUsuario);
router.put("/:id", authMiddleware, adminOnly, usuarioController.actualizarUsuario);
router.patch(
  "/:id/desactivar",
  authMiddleware,
  adminOnly,
  usuarioController.desactivarUsuario
);
router.patch(
  "/:id/activar",
  authMiddleware,
  adminOnly,
  usuarioController.activarUsuario
);

router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  usuarioController.eliminarUsuario
);

module.exports = router;
