const express = require("express");
const notificacionController = require("../controllers/notificacionController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, notificacionController.listar);
router.post(
  "/marcar-todas-leidas",
  authMiddleware,
  notificacionController.marcarTodasLeidas
);
router.post(
  "/:id/leida",
  authMiddleware,
  notificacionController.marcarLeida
);

module.exports = router;

