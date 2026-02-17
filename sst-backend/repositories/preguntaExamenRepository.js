const prisma = require("../prisma");

function findAllActivas() {
  return prisma.preguntaExamen.findMany({
    where: { activa: true },
    orderBy: { fechaCreacion: "asc" },
  });
}

function findAll() {
  return prisma.preguntaExamen.findMany({
    orderBy: { fechaCreacion: "asc" },
  });
}

function findById(id) {
  return prisma.preguntaExamen.findUnique({
    where: { id },
  });
}

function create(data) {
  return prisma.preguntaExamen.create({ data });
}

function update(id, data) {
  return prisma.preguntaExamen.update({
    where: { id },
    data,
  });
}

function remove(id) {
  return prisma.preguntaExamen.delete({
    where: { id },
  });
}

module.exports = {
  findAll,
  findAllActivas,
  findById,
  create,
  update,
  remove,
};

