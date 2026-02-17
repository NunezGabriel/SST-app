const prisma = require("../prisma");

function findAll() {
  return prisma.charla.findMany({
    orderBy: { fechaCharla: "asc" },
  });
}

function findById(id) {
  return prisma.charla.findUnique({
    where: { id },
  });
}

function create(data) {
  return prisma.charla.create({
    data,
  });
}

function update(id, data) {
  return prisma.charla.update({
    where: { id },
    data,
  });
}

function remove(id) {
  return prisma.charla.delete({
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

