const passwordResetService = require("../services/passwordResetService");

async function solicitarRecuperacion(req, res) {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({
        error: "El correo electrónico es obligatorio",
      });
    }

    const result = await passwordResetService.solicitarRecuperacion(correo);
    res.json(result);
  } catch (error) {
    console.error("Error en solicitarRecuperacion:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud de recuperación",
    });
  }
}

async function validarCodigo(req, res) {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({
        error: "El correo y el código son obligatorios",
      });
    }

    const result = await passwordResetService.validarCodigo(correo, codigo);
    res.json(result);
  } catch (error) {
    console.error("Error en validarCodigo:", error);
    res.status(500).json({
      error: "Error al validar el código",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;

    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({
        error: "El correo, código y nueva contraseña son obligatorios",
      });
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    const result = await passwordResetService.resetPassword(
      correo,
      codigo,
      nuevaContrasena,
    );
    res.json(result);
  } catch (error) {
    console.error("Error en resetPassword:", error);

    if (error.message === "Código inválido o expirado") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({
      error: "Error al restablecer la contraseña",
    });
  }
}

module.exports = {
  solicitarRecuperacion,
  validarCodigo,
  resetPassword,
};
