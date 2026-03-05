const driveRepository = require("../repositories/driveRepository");
const prisma = require("../prisma");

const ROL_CARPETA = { WORKER: "Worker", ADMIN: "Admin" };

// const BRIGADAS    = ["CHICLAYO", "CHIMBOTE", "HUANCABAMBA", "JAÉN", "TRUJILLO"];
const SEMANAS_MES = (mes) => [
  `01 al 07 de ${mes}`,
  `08 al 14 de ${mes}`,
  `15 al 21 de ${mes}`,
  `22 al 31 de ${mes}`,
];
const WORKER_DOCS = ["Licencia / SOAT / Bitácora", "Control de Salud Diario", "ATS - Charla 5 min"];
const ADMIN_DOCS  = ["Triaje", "Cargo de EPPs", "SCTR", "Listado de Personal", "Listado de Vehículos", "Vigilancia COVID"];

// ─── Listar archivos de una carpeta por ID ───────────────────────────────────
async function listarArchivos(folderId) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  return driveRepository.listarArchivos(folderId || ROOT);
}

// ─── Subir archivo ────────────────────────────────────────────────────────────
// WORKER: Worker / brigada / mes / semana / tipoDoc  (semana="" para capacitación mensual)
// ADMIN:  Admin  / mes / SEDE / tipoDoc              (se replica a TODAS las sedes en paralelo)
async function subirArchivo({ file, rol, brigada, mes, semana, tipoDoc }) {
  const carpetaRol = ROL_CARPETA[rol] || rol;
  const nombreBrigada = brigada ? brigada.toUpperCase() : "TRUJILLO";

  if (rol === "ADMIN") {
    const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

    // Crear Admin y mes UNA SOLA VEZ antes del paralelo
    // así las 5 sedes comparten la misma carpeta Admin/mes
    const adminId = await driveRepository.obtenerOCrearCarpeta(carpetaRol, ROOT);
    const mesId   = await driveRepository.obtenerOCrearCarpeta(mes, adminId);
    const sedesDB = await prisma.sede.findMany();

    // Ahora subir a cada sede en paralelo usando mesId ya existente
    const resultados = await Promise.all(
      sedesDB.map(async (sede) => {
        const sedeNombre = sede.nombre.toUpperCase();
        const sedeId   = await driveRepository.obtenerOCrearCarpeta(sedeNombre, mesId);
        const tipoId   = await driveRepository.obtenerOCrearCarpeta(tipoDoc, sedeId);
        return driveRepository.subirArchivoEnCarpeta({
          buffer:       file.buffer,
          mimetype:     file.mimetype,
          originalname: file.originalname,
          parentId:     tipoId,
        });
      })
    );
    return resultados[0];
  }

  // WORKER: Worker / mes / brigada / semana / tipoDoc
  const rutaCarpetas = semana
    ? [carpetaRol, mes, nombreBrigada, semana, tipoDoc]
    : [carpetaRol, mes, nombreBrigada, tipoDoc];

  return driveRepository.subirArchivo({
    buffer:       file.buffer,
    mimetype:     file.mimetype,
    originalname: file.originalname,
    rutaCarpetas,
  });
}

// ─── Crear carpeta ────────────────────────────────────────────────────────────
async function crearCarpeta(nombre, parentId) {
  return driveRepository.crearCarpeta(nombre, parentId);
}

// ─── Eliminar ─────────────────────────────────────────────────────────────────
async function eliminar(fileId) {
  return driveRepository.eliminar(fileId);
}

// ─── Estado del mes para el cuadro de control ────────────────────────────────
// WORKER: verifica semanas + capacitación mensual
// ADMIN:  verifica solo tiposDoc a nivel de mes/sede (sin semanas)
async function getEstadoMes(mes, rol) {
  const esWorker   = rol === "WORKER";
  const carpetaRol = esWorker ? "Worker" : "Admin";
  const tiposDoc   = esWorker ? WORKER_DOCS : ADMIN_DOCS;

  const sedesDB = await prisma.sede.findMany();
  const nombresSedes = sedesDB.map(s => s.nombre.toUpperCase());

  return driveRepository.getEstadoMes({
    rol:            carpetaRol,
    mes,
    brigadas:       nombresSedes, // <--- DINÁMICO
    semanas:        esWorker ? SEMANAS_MES(mes) : [],
    tiposDoc,
    tipoDocMensual: esWorker ? "Capacitación Mensual" : null,
  });
}

// ─── Listar archivos por ruta lógica (usado en ArchivoModal) ─────────────────
// WORKER: Worker / brigada / mes / semana? / tipoDoc
// ADMIN:  Admin  / mes / brigada(sede) / tipoDoc
async function listarPorRuta({ rol, brigada, mes, semana, tipoDoc }) {
  const carpetaRol = ROL_CARPETA[rol] || rol;
  const ROOT       = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  const ruta = rol === "ADMIN"
    ? [carpetaRol, mes, brigada, tipoDoc]
    : semana
      ? [carpetaRol, mes, brigada, semana, tipoDoc]
      : [carpetaRol, mes, brigada, tipoDoc];

  let parentId = ROOT;
  for (const nombre of ruta) {
    const id = await driveRepository.buscarCarpeta(nombre, parentId);
    if (!id) return [];
    parentId = id;
  }
  return driveRepository.listarArchivos(parentId);
}

// ─── Link de la carpeta del mes ───────────────────────────────────────────────
// WORKER: Worker / mes    ADMIN: Admin / mes
async function getLinkMes(mes, rol) {
  const carpetaRol = ROL_CARPETA[rol] || rol;
  return driveRepository.getLinkMes(carpetaRol, mes);
}

module.exports = {
  listarArchivos,
  subirArchivo,
  crearCarpeta,
  eliminar,
  getEstadoMes,
  listarPorRuta,
  getLinkMes,
};