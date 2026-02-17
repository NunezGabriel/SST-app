const prisma = require("../prisma");

function findAll() {
  return prisma.documentoSeguridad.findMany({
    orderBy: { fechaCreacion: "desc" },
  });
}

function findById(id) {
  return prisma.documentoSeguridad.findUnique({
    where: { id },
  });
}

function create(data) {
  return prisma.documentoSeguridad.create({
    data,
  });
}

function update(id, data) {
  return prisma.documentoSeguridad.update({
    where: { id },
    data,
  });
}

function remove(id) {
  return prisma.documentoSeguridad.delete({
    where: { id },
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

