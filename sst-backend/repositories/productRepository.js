const prisma = require("../prisma");

function findAll() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

function findById(id) {
  return prisma.product.findUnique({
    where: { id },
  });
}

function create(data) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
    },
  });
}

function update(id, data) {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
    },
  });
}

function remove(id) {
  return prisma.product.delete({
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
