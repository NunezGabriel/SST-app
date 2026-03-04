const driveRepository = require("../repositories/driveRepository");

// Mapeo de roles a nombre de carpeta en Drive
const ROL_CARPETA = {
  WORKER: "Worker",
  ADMIN: "Admin",
};

// Listar archivos de una carpeta
async function listarArchivos(folderId) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  return driveRepository.listarArchivos(folderId || ROOT);
}

// Subir archivo a la ruta correcta en Drive
// Parámetros:
//   file       → objeto de multer { buffer, mimetype, originalname }
//   rol        → "WORKER" | "ADMIN"
//   brigada    → "Chiclayo" | "Chimbote" | etc.
//   mes        → "Octubre"
//   semana     → "01 al 07 de Octubre"
//   tipoDoc    → "ATS - Charla 5 min" | "Control de Salud" | etc.
async function subirArchivo({ file, rol, brigada, mes, semana, tipoDoc }) {
  const carpetaRol = ROL_CARPETA[rol] || rol;

  // Si no hay semana (capacitación mensual), la ruta no incluye semana
  const rutaCarpetas = semana
    ? [carpetaRol, brigada, mes, semana, tipoDoc]
    : [carpetaRol, brigada, mes, tipoDoc]; // ← sin semana

  return driveRepository.subirArchivo({
    buffer: file.buffer,
    mimetype: file.mimetype,
    originalname: file.originalname,
    rutaCarpetas,
  });
}

async function crearCarpeta(nombre, parentId) {
  return driveRepository.crearCarpeta(nombre, parentId);
}

async function eliminar(fileId) {
  return driveRepository.eliminar(fileId);
}

// ─── AGREGAR al driveService.js existente ────────────────────────────────────

const BRIGADAS = ["CHICLAYO", "CHIMBOTE", "HUANCABAMBA", "JAÉN", "TRUJILLO"];

const SEMANAS_MES = (mes) => [
  `01 al 07 de ${mes}`,
  `08 al 14 de ${mes}`,
  `15 al 21 de ${mes}`,
  `22 al 31 de ${mes}`,
];

const WORKER_DOCS = [
  "Licencia / SOAT / Bitácora",
  "Control de Salud Diario",
  "ATS - Charla 5 min",
];
const ADMIN_DOCS = [
  "Triaje",
  "Cargo de EPPs",
  "SCTR",
  "Listado de Personal",
  "Listado de Vehículos",
  "Vigilancia COVID",
];

async function getEstadoMes(mes, rol) {
  const esWorker = rol === "WORKER";
  const carpetaRol = esWorker ? "Worker" : "Admin";
  const tiposDoc = esWorker ? WORKER_DOCS : ADMIN_DOCS;
  const semanas = SEMANAS_MES(mes);

  return driveRepository.getEstadoMes({
    rol: carpetaRol,
    mes,
    brigadas: BRIGADAS,
    semanas,
    tiposDoc,
    tipoDocMensual: esWorker ? "Capacitación Mensual" : null,
  });
}

// Actualizar module.exports:
// module.exports = { listarArchivos, subirArchivo, crearCarpeta, eliminar, getEstadoMes };

module.exports = {
  listarArchivos,
  subirArchivo,
  crearCarpeta,
  eliminar,
  getEstadoMes,
};
