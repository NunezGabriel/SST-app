const prisma = require("../prisma");

async function getSingle() {
  const registros = await prisma.induccion.findMany({ take: 1 });
  return registros[0] || null;
}

async function upsert(data) {
  // Primero verificar si existe algún registro
  const existente = await prisma.induccion.findFirst();
  
  if (existente) {
    // Si existe, actualizar el primero que encuentre
    return prisma.induccion.update({
      where: { id: existente.id },
      data: {
        linkDiapo: data.linkDiapo,
        linkPdf: data.linkPdf,
        linkVideo: data.linkVideo,
        duracion: data.duracion,
      },
    });
  } else {
    // Si no existe, crear uno nuevo
    return prisma.induccion.create({
      data: {
        linkDiapo: data.linkDiapo,
        linkPdf: data.linkPdf,
        linkVideo: data.linkVideo,
        duracion: data.duracion,
      },
    });
  }
}

module.exports = {
  getSingle,
  upsert,
};

