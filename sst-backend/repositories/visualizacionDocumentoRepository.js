const prisma = require("../prisma");

function findByUsuario(usuarioId) {
  return prisma.visualizacionDocumento.findMany({
    where: { idUsuario: usuarioId },
    include: { documento: true },
    orderBy: {
      documento: { fechaCreacion: "desc" },
    },
  });
}

function findByUsuarioYDocumento(usuarioId, documentoId) {
  return prisma.visualizacionDocumento.findUnique({
    where: {
      idUsuario_idDocumento: {
        idUsuario: usuarioId,
        idDocumento: documentoId,
      },
    },
  });
}

function update(id, data) {
  return prisma.visualizacionDocumento.update({
    where: { id },
    data,
  });
}

module.exports = {
  findByUsuario,
  findByUsuarioYDocumento,
  update,
};

