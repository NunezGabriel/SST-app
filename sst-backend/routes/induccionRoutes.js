const express = require("express");
const induccionController = require("../controllers/induccionController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Todos los usuarios autenticados pueden ver el material
router.get("/", authMiddleware, induccionController.obtenerInduccion);

// Solo admin puede actualizar
router.put("/", authMiddleware, adminOnly, induccionController.actualizarInduccion);

module.exports = router;
