const prisma = require("../prisma");

function findAll() {
  return prisma.sede.findMany({
    orderBy: { nombre: "asc" },
  });
}

function findById(id) {
  return prisma.sede.findUnique({
    where: { id },
  });
}

function findByNombre(nombre) {
  return prisma.sede.findUnique({
    where: { nombre },
  });
}

function create(nombre) {
  return prisma.sede.create({
    data: { nombre: nombre.trim().toUpperCase() },
  });
}

function update(id, nombre) {
  return prisma.sede.update({
    where: { id },
    data: { nombre: nombre.trim().toUpperCase() },
  });
}

function destroy(id) {
  return prisma.sede.delete({
    where: { id },
  });
}

function countUsuarios(id) {
  return prisma.usuario.count({
    where: { idSede: id },
  });
}

module.exports = {
  findAll,
  findById,
  findByNombre,
  create,
  update,
  destroy,
  countUsuarios,
};