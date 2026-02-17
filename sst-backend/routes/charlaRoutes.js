const express = require("express");
const charlaController = require("../controllers/charlaController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin
router.get("/admin", authMiddleware, adminOnly, charlaController.listarCharlasAdmin);
router.post("/", authMiddleware, adminOnly, charlaController.crearCharla);
router.put("/:id", authMiddleware, adminOnly, charlaController.actualizarCharla);
router.delete("/:id", authMiddleware, adminOnly, charlaController.eliminarCharla);

// Worker - listado y completar
router.get("/", authMiddleware, charlaController.listarCharlasUsuario);
router.post("/:id/completar", authMiddleware, charlaController.marcarCharlaCompletada);

module.exports = router;

