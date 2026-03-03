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

  // Ruta: Worker / Chiclayo / Octubre / 01 al 07 de Octubre / ATS - Charla 5 min
  const rutaCarpetas = [carpetaRol, brigada, mes, semana, tipoDoc];

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

module.exports = { listarArchivos, subirArchivo, crearCarpeta, eliminar };
