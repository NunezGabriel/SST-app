const prisma = require("../prisma");

function create(data) {
  return prisma.notificacion.create({ data });
}

function createMany(dataArray) {
  if (!dataArray || dataArray.length === 0) return Promise.resolve();
  return prisma.notificacion.createMany({ data: dataArray });
}

function findByUsuario(usuarioId) {
  return prisma.notificacion.findMany({
    where: { idUsuario: usuarioId },
    orderBy: { fechaCreacion: "desc" },
  });
}

function marcarLeida(id) {
  return prisma.notificacion.update({
    where: { id },
    data: { leida: true, fechaLectura: new Date() },
  });
}

function marcarTodasLeidas(usuarioId) {
  return prisma.notificacion.updateMany({
    where: { idUsuario: usuarioId, leida: false },
    data: { leida: true, fechaLectura: new Date() },
  });
}

module.exports = {
  create,
  createMany,
  findByUsuario,
  marcarLeida,
  marcarTodasLeidas,
};

