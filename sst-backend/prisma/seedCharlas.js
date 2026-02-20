require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed de 365 charlas...");

  // Fechas desde el 2 de enero de 2026 hasta el 31 de diciembre de 2026
  const fechaInicio = new Date("2026-01-02");
  const fechaFin = new Date("2026-12-31");
  
  // Nombres que se alternarán
  const nombres = ["Uso correcto de EPP", "Maniobras de seguridad"];
  
  // Etiqueta fija
  const etiqueta = "seguridad";
  
  // Enlace base de Google Drive (inventado, se modificará después)
  const enlaceBase = "https://drive.google.com/file/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456/view?usp=sharing";
  
  const charlas = [];
  let fechaActual = new Date(fechaInicio);
  let indiceNombre = 0;
  
  // Generar 365 charlas
  while (fechaActual <= fechaFin) {
    const fechaCharla = new Date(fechaActual);
    
    charlas.push({
      nombre: nombres[indiceNombre % nombres.length],
      enlace: enlaceBase,
      etiqueta: etiqueta,
      fechaCharla: fechaCharla,
    });
    
    // Avanzar al siguiente día
    fechaActual.setDate(fechaActual.getDate() + 1);
    indiceNombre++;
  }

  try {
    // Eliminar todas las charlas existentes (opcional, comentar si no se desea)
    // await prisma.charla.deleteMany({});

    // Crear las charlas
    for (const charla of charlas) {
      await prisma.charla.create({
        data: charla,
      });
    }

    console.log(`✅ Se crearon ${charlas.length} charlas exitosamente`);
    console.log(`   - Rango de fechas: ${fechaInicio.toISOString().split('T')[0]} hasta ${fechaFin.toISOString().split('T')[0]}`);
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
