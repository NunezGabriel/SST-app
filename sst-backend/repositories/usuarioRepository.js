const prisma = require("../prisma");

const INCLUDE_SEDE = { sede: { select: { id: true, nombre: true } } };

function findById(id) {
  return prisma.usuario.findUnique({
    where: { id },
    include: INCLUDE_SEDE,
  });
}

function findByCorreo(correo) {
  return prisma.usuario.findUnique({
    where: { correo },
    include: INCLUDE_SEDE,
  });
}

function findAll() {
  return prisma.usuario.findMany({
    orderBy: { fechaCreacion: "desc" },
    include: INCLUDE_SEDE,
  });
}

function create(data) {
  return prisma.usuario.create({
    data,
    include: INCLUDE_SEDE,
  });
}

function update(id, data) {
  return prisma.usuario.update({
    where: { id },
    data,
    include: INCLUDE_SEDE,
  });
}

function deactivate(id) {
  return prisma.usuario.update({
    where: { id },
    data: { activo: false },
  });
}

function activate(id) {
  return prisma.usuario.update({
    where: { id },
    data: { activo: true },
  });
}

function destroy(id) {
  return prisma.usuario.delete({
    where: { id },
  });
}

function updatePassword(correo, hashedPassword) {
  return prisma.usuario.update({
    where: { correo },
    data: { contrasena: hashedPassword },
  });
}

module.exports = {
  findById,
  findByCorreo,
  findAll,
  create,
  update,
  deactivate,
  activate,
  destroy,
  updatePassword,
};