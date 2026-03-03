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

module.exports = { listarArchivos, subirArchivo };
