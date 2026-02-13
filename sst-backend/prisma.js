require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

// Creamos un pool de conexiones de 'pg'
const pool = new Pool({ connectionString });
// Usamos el adaptador para que Prisma hable con ese pool
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
  