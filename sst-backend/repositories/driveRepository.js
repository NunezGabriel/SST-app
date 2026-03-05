const { google } = require("googleapis");
const { Readable } = require("stream");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
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

// ─── Buscar subcarpeta por nombre — retorna id o null ────────────────────────
async function buscarCarpeta(nombre, parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${nombre}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
  });
  return res.data.files?.[0]?.id ?? null;
}

// ─── Buscar carpeta y devolver id + webViewLink ───────────────────────────────
async function buscarCarpetaConLink(nombre, parentId) {
  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${nombre}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, webViewLink)",
  });
  return res.data.files?.[0] ?? null;
}

// ─── Buscar subcarpeta — si no existe, crearla ───────────────────────────────
async function obtenerOCrearCarpeta(nombre, parentId) {
  const busqueda = await drive.files.list({
    q: `'${parentId}' in parents and name = '${nombre}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id, name)",
  });
  if (busqueda.data.files.length > 0) return busqueda.data.files[0].id;
  const carpeta = await drive.files.create({
    requestBody: { name: nombre, mimeType: "application/vnd.google-apps.folder", parents: [parentId] },
    fields: "id",
  });
  return carpeta.data.id;
}

// ─── Subir archivo navegando ruta completa ───────────────────────────────────
async function subirArchivo({ buffer, mimetype, originalname, rutaCarpetas }) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  let parentId = ROOT;
  for (const nombreCarpeta of rutaCarpetas) {
    parentId = await obtenerOCrearCarpeta(nombreCarpeta, parentId);
  }
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

// ─── Subir archivo en carpeta ya conocida (por ID) ───────────────────────────
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

// ─── Crear carpeta desde UI ───────────────────────────────────────────────────
async function crearCarpeta(nombre, parentId) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const carpeta = await drive.files.create({
    requestBody: { name: nombre, mimeType: "application/vnd.google-apps.folder", parents: [parentId || ROOT] },
    fields: "id, name, mimeType, webViewLink",
  });
  return carpeta.data;
}

// ─── Eliminar archivo o carpeta ───────────────────────────────────────────────
async function eliminar(fileId) {
  await drive.files.delete({ fileId });
}

// ─── Verificar si carpeta tiene al menos 1 archivo ───────────────────────────
async function tieneArchivo(folderId) {
  if (!folderId) return false;
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id)",
    pageSize: 1,
  });
  return (res.data.files?.length ?? 0) > 0;
}

// ─── Verificar si TODOS los tiposDoc tienen archivo dentro de semanaId ────────
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

// ─── Verificar si TODOS los tiposDoc tienen archivo directamente en brigada ───
// (para ADMIN que no tiene semanas)
async function verificarBrigadaAdmin(brigadaId, tiposDoc) {
  if (!brigadaId) return false;
  const checks = await Promise.all(
    tiposDoc.map(async (tipo) => {
      const tipoId = await buscarCarpeta(tipo, brigadaId);
      return tieneArchivo(tipoId);
    }),
  );
  return checks.every(Boolean);
}

// ─── Estado completo de un mes ────────────────────────────────────────────────
// WORKER: Worker / mes / brigada / semana / tipoDoc  + mensual
// ADMIN:  Admin  / mes / brigada / tipoDoc           (sin semanas)
async function getEstadoMes({ rol, mes, brigadas, semanas, tiposDoc, tipoDocMensual }) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const resultado = {};

  // Buscar rol y mes UNA VEZ (compartido entre brigadas)
  const rolId = await buscarCarpeta(rol, ROOT);
  const mesId = rolId ? await buscarCarpeta(mes, rolId) : null;

  await Promise.all(
    brigadas.map(async (brigada) => {
      resultado[brigada] = {};
      const brigadaId = mesId ? await buscarCarpeta(brigada, mesId) : null;

      if (semanas.length > 0) {
        // WORKER — verificar cada semana
        await Promise.all(
          semanas.map(async (semana) => {
            const semanaId = brigadaId ? await buscarCarpeta(semana, brigadaId) : null;
            resultado[brigada][semana] = await verificarSemana(semanaId, tiposDoc);
          }),
        );
        // Capacitación mensual
        if (tipoDocMensual) {
          const mensualId = brigadaId ? await buscarCarpeta(tipoDocMensual, brigadaId) : null;
          resultado[brigada]["mensual"] = await tieneArchivo(mensualId);
        } else {
          resultado[brigada]["mensual"] = false;
        }
      } else {
        // ADMIN — verificar tiposDoc directo en brigada (sin semanas)
        resultado[brigada]["completo"] = await verificarBrigadaAdmin(brigadaId, tiposDoc);
      }
    }),
  );

  return resultado;
}

// ─── Obtener webViewLink de carpeta de mes ────────────────────────────────────
// WORKER: Worker / mes    ADMIN: Admin / mes
async function getLinkMes(rol, mes) {
  const ROOT = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  const rolId = await buscarCarpeta(rol, ROOT);
  if (!rolId) return null;
  const carpeta = await buscarCarpetaConLink(mes, rolId);
  return carpeta?.webViewLink ?? null;
}

module.exports = {
  listarArchivos,
  buscarCarpeta,
  buscarCarpetaConLink,
  obtenerOCrearCarpeta,
  subirArchivo,
  subirArchivoEnCarpeta,
  crearCarpeta,
  eliminar,
  tieneArchivo,
  verificarSemana,
  getEstadoMes,
  getLinkMes,
};