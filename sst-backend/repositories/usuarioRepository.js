const prisma = require("../prisma");

function findById(id) {
  return prisma.usuario.findUnique({
    where: { id },
  });
}

function findByCorreo(correo) {
  return prisma.usuario.findUnique({
    where: { correo },
  });
}

function findAll() {
  return prisma.usuario.findMany({
    orderBy: { fechaCreacion: "desc" },
  });
}

function create(data) {
  return prisma.usuario.create({
    data,
  });
}

function update(id, data) {
  return prisma.usuario.update({
    where: { id },
    data,
  });
}

function deactivate(id) {
  return prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });
}

module.exports = {
  findById,
  findByCorreo,
  findAll,
  create,
  update,
  deactivate,
};

