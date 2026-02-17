const express = require("express");
const examenController = require("../controllers/examenController");
const {
  authMiddleware,
  adminOnly,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// ========== CONFIGURACIÓN ==========
router.get("/config", authMiddleware, examenController.obtenerConfiguracion);
router.put(
  "/config",
  authMiddleware,
  adminOnly,
  examenController.actualizarConfiguracion
);

// ========== PREGUNTAS (Admin) ==========
router.get("/preguntas", authMiddleware, adminOnly, examenController.listarPreguntas);
router.get(
  "/preguntas/activas",
  authMiddleware,
  examenController.listarPreguntasActivas
);
router.get("/preguntas/:id", authMiddleware, adminOnly, examenController.obtenerPregunta);
router.post("/preguntas", authMiddleware, adminOnly, examenController.crearPregunta);
router.put(
  "/preguntas/:id",
  authMiddleware,
  adminOnly,
  examenController.actualizarPregunta
);
router.delete(
  "/preguntas/:id",
  authMiddleware,
  adminOnly,
  examenController.eliminarPregunta
);

// ========== RENDIR EXAMEN (Worker) ==========
router.get("/generar", authMiddleware, examenController.generarPreguntas);
router.post("/rendir", authMiddleware, examenController.rendirExamen);
router.get("/historial", authMiddleware, examenController.obtenerHistorialIntentos);
router.get("/estado", authMiddleware, examenController.obtenerEstadoExamen);
router.post("/resetear-bloqueo", authMiddleware, examenController.resetearBloqueo);

module.exports = router;
