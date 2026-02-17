const prisma = require("../prisma");

function findAll() {
  return prisma.formato.findMany({
    orderBy: { fechaCreacion: "desc" },
  });
}

function findById(id) {
  return prisma.formato.findUnique({
    where: { id },
  });
}

function create(data) {
  return prisma.formato.create({
    data,
  });
}

function update(id, data) {
  return prisma.formato.update({
    where: { id },
    data,
  });
}

function remove(id) {
  return prisma.formato.delete({
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

