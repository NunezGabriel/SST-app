const prisma = require("../prisma");

function findByUsuario(usuarioId) {
  return prisma.usuarioLogro.findMany({
    where: { idUsuario: usuarioId },
    include: { logro: true },
    orderBy: { id: "asc" },
  });
}

function findByUsuarioYLogro(usuarioId, logroId) {
  return prisma.usuarioLogro.findUnique({
    where: {
      idUsuario_idLogro: {
        idUsuario: usuarioId,
        idLogro: logroId,
      },
    },
  });
}

function update(id, data) {
  return prisma.usuarioLogro.update({
    where: { id },
    data,
  });
}

function createMany(dataArray) {
  if (!dataArray || dataArray.length === 0) return Promise.resolve();
  return prisma.usuarioLogro.createMany({ data: dataArray });
}

module.exports = {
  findByUsuario,
  findByUsuarioYLogro,
  update,
  createMany,
};

