require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Genera un string de fecha UTC seguro a partir de año, mes (1-indexed) y día.
 * Usa las 12:00:00 UTC para que ningún offset de zona horaria desfase el día.
 */
function fechaUTC(year, month, day) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return new Date(`${year}-${mm}-${dd}T12:00:00.000Z`);
}

/**
 * Avanza un día sobre una fecha representada como { year, month, day } (month 1-indexed).
 * Usa operaciones de calendario puro sin depender de Date local.
 */
function siguienteDia({ year, month, day }) {
  const d = new Date(Date.UTC(year, month - 1, day + 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

async function main() {
  console.log("Iniciando seed de charlas (2 ene 2026 → 31 dic 2026)...");

  const nombres = ["Uso correcto de EPP", "Maniobras de seguridad"];
  const etiqueta = "seguridad";
  const enlaceBase =
    "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/view?usp=sharing";

  const charlas = [];
  let actual = { year: 2026, month: 1, day: 2 };   // 2 de enero de 2026
  const fin   = { year: 2026, month: 12, day: 31 }; // 31 de diciembre de 2026
  let indice = 0;

  while (
    actual.year < fin.year ||
    (actual.year === fin.year && actual.month < fin.month) ||
    (actual.year === fin.year && actual.month === fin.month && actual.day <= fin.day)
  ) {
    charlas.push({
      nombre: nombres[indice % nombres.length],
      enlace: enlaceBase,
      etiqueta: etiqueta,
      fechaCharla: fechaUTC(actual.year, actual.month, actual.day),
    });
    actual = siguienteDia(actual);
    indice++;
  }

  try {
    await prisma.charla.deleteMany({});

    for (const charla of charlas) {
      await prisma.charla.create({ data: charla });
    }

    console.log(`✅ Se crearon ${charlas.length} charlas exitosamente`);
    console.log(`   - Rango: 2026-01-02 → 2026-12-31`);
    console.log(`   - Etiqueta: ${etiqueta}`);
    console.log(`   - Nombres alternados: ${nombres.join(" / ")}`);
  } catch (error) {
    console.error("❌ Error al crear las charlas:", error);
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
