import axios from "axios";

const API_URL = "http://localhost:8080";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime?: string;
  size?: string;
}

export interface UploadParams {
  files: File[];               // ← array (antes era file: File)
  rol: "WORKER" | "ADMIN";
  brigada: string;
  mes: string;
  semana: string;
  tipoDoc: string;
}

export interface UploadResponse {
  message: string;
  archivos: { id: string; name: string; webViewLink: string }[];
}

export interface RouteParams {
  rol: string;
  brigada: string;
  mes: string;
  semana: string;   // vacío para capacitación mensual
  tipoDoc: string;
}

// ✅ Listar archivos/carpetas por folderId (usado en GestionarCarpetaView)
export const getDriveFilesRequest = async (
  token: string,
  folderId?: string,
): Promise<{ files: DriveFile[] }> => {
  try {
    const response = await axios.get(`${API_URL}/api/drive`, {
      headers: { Authorization: `Bearer ${token}` },
      params: folderId ? { folderId } : {},
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al obtener archivos de Drive.");
  }
};

// ✅ Listar archivos por ruta lógica (usado en ArchivoModal)
// Ej: rol=WORKER, brigada=CHICLAYO, mes=Marzo, semana=01 al 07 de Marzo, tipoDoc=ATS - Charla 5 min
export const getFilesByRouteRequest = async (
  token: string,
  params: RouteParams,
): Promise<{ files: DriveFile[] }> => {
  try {
    const response = await axios.get(`${API_URL}/api/drive/carpeta-ruta`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al listar archivos.");
  }
};

// ✅ Subir archivos a Drive (múltiples)
export const uploadDriveFileRequest = async (
  token: string,
  params: UploadParams,
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    params.files.forEach((f) => formData.append("files", f));  // ← "files" plural
    formData.append("rol",     params.rol);
    formData.append("brigada", params.brigada);
    formData.append("mes",     params.mes);
    formData.append("semana",  params.semana);
    formData.append("tipoDoc", params.tipoDoc);
    const response = await axios.post(`${API_URL}/api/drive/upload`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al subir el archivo.");
  }
};

// ✅ Crear carpeta en Drive
export const createDriveFolderRequest = async (
  token: string,
  nombre: string,
  parentId?: string,
): Promise<{ carpeta: DriveFile }> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/drive/carpeta`,
      { nombre, parentId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al crear la carpeta.");
  }
};

// ✅ Eliminar archivo o carpeta de Drive
export const deleteDriveItemRequest = async (
  token: string,
  fileId: string,
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/drive/${fileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al eliminar.");
  }
};