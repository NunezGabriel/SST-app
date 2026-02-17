const prisma = require("../prisma");

function findByUsuario(usuarioId) {
  return prisma.progresoCharla.findMany({
    where: { idUsuario: usuarioId },
    include: { charla: true },
    orderBy: {
      charla: { fechaCharla: "asc" },
    },
  });
}

function findByUsuarioYCharla(usuarioId, charlaId) {
  return prisma.progresoCharla.findUnique({
    where: {
      idUsuario_idCharla: {
        idUsuario: usuarioId,
        idCharla: charlaId,
      },
    },
  });
}

function update(id, data) {
  return prisma.progresoCharla.update({
    where: { id },
    data,
  });
}

module.exports = {
  findByUsuario,
  findByUsuarioYCharla,
  update,
};

