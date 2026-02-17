const prisma = require("../prisma");

function create(data) {
  return prisma.intentoExamen.create({ data });
}

function findByUsuario(usuarioId) {
  return prisma.intentoExamen.findMany({
    where: { idUsuario: usuarioId },
    orderBy: { fechaIntento: "desc" },
  });
}

module.exports = {
  create,
  findByUsuario,
};

