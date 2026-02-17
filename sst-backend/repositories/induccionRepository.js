const prisma = require("../prisma");

async function getSingle() {
  const registros = await prisma.induccion.findMany({ take: 1 });
  return registros[0] || null;
}

function upsert(data) {
  return prisma.induccion.upsert({
    where: { id: data.id || 1 },
    update: {
      linkDiapo: data.linkDiapo,
      linkPdf: data.linkPdf,
      linkVideo: data.linkVideo,
      duracion: data.duracion,
    },
    create: {
      linkDiapo: data.linkDiapo,
      linkPdf: data.linkPdf,
      linkVideo: data.linkVideo,
      duracion: data.duracion,
    },
  });
}

module.exports = {
  getSingle,
  upsert,
};

