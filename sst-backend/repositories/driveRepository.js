const { google } = require("googleapis");
const { Readable } = require("stream");

// ─── Cliente OAuth2 con refresh token (no expira) ────────────────────────────
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

// ─── Listar archivos dentro de una carpeta ───────────────────────────────────
async function listarArchivos(folderId) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, webViewLink, modifiedTime)",
    orderBy: "name",
  });
  return response.data.files ?? [];
}

// ─── Buscar subcarpeta por nombre — si no existe, crearla ───────────────────
async function obtenerOCrearCarpeta(nombre, parentId) {
  const busqueda = await drive.files.list({
    q: `'${parentId}' in parents and name = '${nombre}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });

  if (busqueda.data.files.length > 0) {
    return busqueda.data.files[0].id;
  }

  // No existe → crearla
  const carpeta = await drive.files.create({
    requestBody: {
      name: nombre,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });

  return carpeta.data.id;
}

// ─── Subir archivo a: ROOT / rol / brigada / mes / semana / tipoDoc ──────────
async function subirArchivo({ buffer, mimetype, originalname, rutaCarpetas }) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  // Navegar/crear carpetas de la ruta
  let parentId = ROOT;
  for (const nombreCarpeta of rutaCarpetas) {
    parentId = await obtenerOCrearCarpeta(nombreCarpeta, parentId);
  }

  // Convertir buffer a stream
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const archivo = await drive.files.create({
    requestBody: {
      name: originalname,
      parents: [parentId],
    },
    media: {
      mimeType: mimetype,
      body: stream,
    },
    fields: "id, name, webViewLink",
  });

  return archivo.data;
}

// ─── Subir archivo directamente en una carpeta ya conocida (por ID) ──────────
async function subirArchivoEnCarpeta({ buffer, mimetype, originalname, parentId }) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  const archivo = await drive.files.create({
    requestBody: { name: originalname, parents: [parentId] },
    media: { mimeType: mimetype, body: stream },
    fields: "id, name, webViewLink",
  });
  return archivo.data;
}

// ─── Crear carpeta manualmente desde la UI ───────────────────────────────────
async function crearCarpeta(nombre, parentId) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const carpeta = await drive.files.create({
    requestBody: {
      name: nombre,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId || ROOT],
    },
    fields: "id, name, mimeType, webViewLink",
  });
  return carpeta.data;
}

// ─── Eliminar archivo o carpeta ───────────────────────────────────────────────
async function eliminar(fileId) {
  await drive.files.delete({ fileId });
}

// ─── AGREGAR estas funciones al driveRepository.js existente ─────────────────
// (antes del module.exports)

// Buscar carpeta por nombre exacto dentro de un padre — retorna el id o null
async function buscarCarpeta(nombre, parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${nombre}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
  });
  return res.data.files?.[0]?.id ?? null;
}

// Verificar si una carpeta tiene al menos 1 archivo (no carpetas)
async function tieneArchivo(folderId) {
  if (!folderId) return false;
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });
  return (res.data.files?.length ?? 0) > 0;
}

// Verificar si TODOS los tiposDoc tienen al menos 1 archivo dentro de semanaId
async function verificarSemana(semanaId, tiposDoc) {
  if (!semanaId) return false;
  const checks = await Promise.all(
    tiposDoc.map(async (tipo) => {
      const tipoId = await buscarCarpeta(tipo, semanaId);
      return tieneArchivo(tipoId);
    }),
  );
  return checks.every(Boolean);
}

// Estado completo de un mes para un rol
// rol: "Worker" | "Admin"
// mes: "Marzo"
// brigadas: ["CHICLAYO", "TRUJILLO", ...]
// semanas: ["01 al 07 de Marzo", "08 al 14 de Marzo", ...]
// tiposDoc: ["ATS - Charla 5 min", "Control de Salud Diario", ...]
// tipoDocMensual: "Capacitacion Mensual" (solo para Worker, null para Admin)
async function getEstadoMes({
  rol,
  mes,
  brigadas,
  semanas,
  tiposDoc,
  tipoDocMensual,
}) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;

  // Resultado: { CHICLAYO: { "01 al 07...": true, mensual: true }, ... }
  const resultado = {};

  await Promise.all(
    brigadas.map(async (brigada) => {
      resultado[brigada] = {};

      // Navegar hasta la carpeta del mes de esta brigada
      const rolId = await buscarCarpeta(rol, ROOT);
      const brigadaId = rolId ? await buscarCarpeta(brigada, rolId) : null;
      const mesId = brigadaId ? await buscarCarpeta(mes, brigadaId) : null;

      // Verificar cada semana en paralelo
      await Promise.all(
        semanas.map(async (semana) => {
          const semanaId = mesId ? await buscarCarpeta(semana, mesId) : null;
          resultado[brigada][semana] = await verificarSemana(
            semanaId,
            tiposDoc,
          );
        }),
      );

      // Verificar capacitación mensual (solo Worker)
      if (tipoDocMensual && mesId) {
        const mensualId = await buscarCarpeta(tipoDocMensual, mesId);
        resultado[brigada]["mensual"] = await tieneArchivo(mensualId);
      } else {
        resultado[brigada]["mensual"] = false;
      }
    }),
  );

  return resultado;
}

// Actualizar module.exports al final del archivo:
// module.exports = { listarArchivos, subirArchivo, crearCarpeta, eliminar, getEstadoMes };

module.exports = {
  listarArchivos,
  subirArchivo,
  crearCarpeta,
  eliminar,
  getEstadoMes,
  buscarCarpeta,
  subirArchivoEnCarpeta,
  obtenerOCrearCarpeta,
};
