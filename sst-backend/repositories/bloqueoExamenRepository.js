const prisma = require("../prisma");

function findByUsuario(usuarioId) {
  return prisma.bloqueoExamen.findUnique({
    where: { idUsuario: usuarioId },
  });
}

function create(data) {
  return prisma.bloqueoExamen.create({ data });
}

function update(id, data) {
  return prisma.bloqueoExamen.update({
    where: { id },
    data,
  });
}

module.exports = {
  findByUsuario,
  create,
  update,
};

