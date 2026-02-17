const prisma = require("../prisma");

async function getSingle() {
  const registros = await prisma.configuracionExamen.findMany({ take: 1 });
  return registros[0] || null;
}

function upsert(data) {
  return prisma.configuracionExamen.upsert({
    where: { id: data.id || 1 },
    update: {
      puntajeAprobatorio: data.puntajeAprobatorio,
      puntajeTotal: data.puntajeTotal,
      intentosMaximos: data.intentosMaximos,
      tiempoEsperaMinutos: data.tiempoEsperaMinutos,
    },
    create: {
      puntajeAprobatorio: data.puntajeAprobatorio,
      puntajeTotal: data.puntajeTotal,
      intentosMaximos: data.intentosMaximos,
      tiempoEsperaMinutos: data.tiempoEsperaMinutos,
    },
  });
}

module.exports = {
  getSingle,
  upsert,
};

