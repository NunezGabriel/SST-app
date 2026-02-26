const crypto = require("crypto");
const { Resend } = require("resend");
const passwordResetRepository = require("../repositories/passwordResetRepository");
const usuarioRepository = require("../repositories/usuarioRepository");

const resend = new Resend(process.env.RESEND_API_KEY);

async function solicitarRecuperacion(correo) {
  try {
    const usuario = await usuarioRepository.findByCorreo(correo);

    if (!usuario) {
      return {
        success: true,
        message: "Si el correo es válido, recibirás un código de recuperación",
      };
    }

    await passwordResetRepository.invalidatePreviousCodes(correo);

    const codigo = crypto.randomInt(100000, 999999).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await passwordResetRepository.create(correo, codigo, expira);

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: correo,
        subject: "Código de Recuperación de Contraseña - HSE App",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #003d70;">HSE App</h2>
              <p style="color: #666;">Health Safety & Environment</p>
            </div>
            
            <h3 style="color: #333; margin-bottom: 20px;">Recuperación de Contraseña</h3>
            
            <p style="color: #666; line-height: 1.6;">
              Hemos recibido una solicitud para restablecer tu contraseña. 
              Utiliza el siguiente código de 6 dígitos para continuar:
            </p>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #003d70; letter-spacing: 8px;">
                ${codigo}
              </span>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Este código expirará en <strong>15 minutos</strong>. 
              Si no solicitaste esta recuperación, puedes ignorar este correo.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                © 2026 HSE App - Todos los derechos reservados<br>
                Este es un mensaje automático, por favor no responder.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return {
        success: true,
        message: "Si el correo es válido, recibirás un código de recuperación",
      };
    }

    return {
      success: true,
      message: "Si el correo es válido, recibirás un código de recuperación",
    };
  } catch (error) {
    console.error("Error en solicitarRecuperacion:", error);
    throw new Error("Error al procesar la solicitud de recuperación");
  }
}

async function validarCodigo(correo, codigo) {
  try {
    const passwordReset = await passwordResetRepository.findByCorreoAndCodigo(
      correo,
      codigo,
    );

    if (!passwordReset) {
      return { valid: false, message: "Código inválido o expirado" };
    }

    return { valid: true, message: "Código válido" };
  } catch (error) {
    console.error("Error en validarCodigo:", error);
    throw new Error("Error al validar el código");
  }
}

async function resetPassword(correo, codigo, nuevaContrasena) {
  try {
    const passwordReset = await passwordResetRepository.findByCorreoAndCodigo(
      correo,
      codigo,
    );

    if (!passwordReset) {
      throw new Error("Código inválido o expirado");
    }

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    await usuarioRepository.updatePassword(correo, hashedPassword);

    await passwordResetRepository.markAsUsed(passwordReset.id);

    return { success: true, message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error("Error en resetPassword:", error);
    throw error;
  }
}

module.exports = {
  solicitarRecuperacion,
  validarCodigo,
  resetPassword,
};
