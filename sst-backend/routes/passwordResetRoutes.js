const express = require("express");
const passwordResetController = require("../controllers/passwordResetController");

const router = express.Router();

router.post("/solicitar", passwordResetController.solicitarRecuperacion);
router.post("/validar", passwordResetController.validarCodigo);
router.post("/resetear", passwordResetController.resetPassword);

module.exports = router;
