const prisma = require("../prisma");

function findAll() {
  return prisma.logro.findMany({
    orderBy: { fechaCreacion: "asc" },
  });
}

function findById(id) {
  return prisma.logro.findUnique({
    where: { id },
  });
}

function findByNombre(nombre) {
  return prisma.logro.findUnique({
    where: { nombre },
  });
}

function create(data) {
  return prisma.logro.create({ data });
}

function update(id, data) {
  return prisma.logro.update({
    where: { id },
    data,
  });
}

function remove(id) {
  return prisma.logro.delete({
    where: { id },
  });
}

module.exports = {
  findAll,
  findById,
  findByNombre,
  create,
  update,
  remove,
};

