const prisma = require("../prisma");

async function create(correo, codigo, expira) {
  try {
    const passwordReset = await prisma.passwordReset.create({
      data: {
        correo,
        codigo,
        expira,
        utilizado: false,
      },
    });
    return passwordReset;
  } catch (error) {
    console.error("Error creating password reset:", error);
    throw error;
  }
}

async function findByCorreoAndCodigo(correo, codigo) {
  try {
    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        correo,
        codigo,
        utilizado: false,
        expira: {
          gt: new Date(),
        },
      },
    });
    return passwordReset;
  } catch (error) {
    console.error("Error finding password reset:", error);
    throw error;
  }
}

async function markAsUsed(id) {
  try {
    const passwordReset = await prisma.passwordReset.update({
      where: { id },
      data: { utilizado: true },
    });
    return passwordReset;
  } catch (error) {
    console.error("Error marking password reset as used:", error);
    throw error;
  }
}

async function invalidatePreviousCodes(correo) {
  try {
    await prisma.passwordReset.updateMany({
      where: {
        correo,
        utilizado: false,
      },
      data: {
        utilizado: true,
      },
    });
  } catch (error) {
    console.error("Error invalidating previous codes:", error);
    throw error;
  }
}

module.exports = {
  create,
  findByCorreoAndCodigo,
  markAsUsed,
  invalidatePreviousCodes,
};
