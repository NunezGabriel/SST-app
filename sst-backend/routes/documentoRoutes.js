const express = require("express");
const documentoController = require("../controllers/documentoController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin
router.get(
  "/admin",
  authMiddleware,
  adminOnly,
  documentoController.listarDocumentosAdmin
);
router.post(
  "/",
  authMiddleware,
  adminOnly,
  documentoController.crearDocumento
);
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  documentoController.actualizarDocumento
);
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  documentoController.eliminarDocumento
);

// Worker
router.get("/", authMiddleware, documentoController.listarDocumentosUsuario);
router.post(
  "/:id/visto",
  authMiddleware,
  documentoController.marcarDocumentoVisto
);

module.exports = router;

