require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Buscando charlas del 01 de enero de 2026...");

  // Fecha del 01 de enero de 2026 (normalizada)
  const fechaEnero01 = new Date(2026, 0, 1); // Año, Mes (0-indexed), Día
  fechaEnero01.setHours(0, 0, 0, 0);

  // También buscar con diferentes formatos por si acaso
  const fechaEnero01ISO = "2026-01-01";

  try {
    // Buscar charlas del 01 de enero
    const charlasEnero01 = await prisma.charla.findMany({
      where: {
        fechaCharla: {
          gte: new Date("2026-01-01T00:00:00.000Z"),
          lt: new Date("2026-01-02T00:00:00.000Z"),
        },
      },
    });

    if (charlasEnero01.length === 0) {
      console.log("✅ No se encontraron charlas del 01 de enero de 2026");
      return;
    }

    console.log(`⚠️  Se encontraron ${charlasEnero01.length} charla(s) del 01 de enero:`);
    charlasEnero01.forEach((charla) => {
      console.log(`   - ID: ${charla.id}, Nombre: ${charla.nombre}, Fecha: ${charla.fechaCharla}`);
    });

    // Eliminar las charlas del 01 de enero
    const resultado = await prisma.charla.deleteMany({
      where: {
        fechaCharla: {
          gte: new Date("2026-01-01T00:00:00.000Z"),
          lt: new Date("2026-01-02T00:00:00.000Z"),
        },
      },
    });

    console.log(`✅ Se eliminaron ${resultado.count} charla(s) del 01 de enero de 2026`);
  } catch (error) {
    console.error("❌ Error al eliminar charlas del 01 de enero:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
