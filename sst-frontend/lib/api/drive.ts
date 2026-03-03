import axios from "axios";

const API_URL = "http://localhost:8080";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  modifiedTime?: string;
}

export interface UploadParams {
  file: File;
  rol: "WORKER" | "ADMIN";
  brigada: string;
  mes: string;
  semana: string;
  tipoDoc: string;
}

export interface UploadResponse {
  message: string;
  archivo: { id: string; name: string; webViewLink: string };
}

// ✅ Listar archivos de una carpeta de Drive
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
    const message =
      error.response?.data?.message || error.response?.data?.error;
    throw new Error(message || "Error al obtener archivos de Drive.");
  }
};

// ✅ Subir archivo a Drive
export const uploadDriveFileRequest = async (
  token: string,
  params: UploadParams,
): Promise<UploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("rol", params.rol);
    formData.append("brigada", params.brigada);
    formData.append("mes", params.mes);
    formData.append("semana", params.semana);
    formData.append("tipoDoc", params.tipoDoc);

    const response = await axios.post(`${API_URL}/api/drive/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.response?.data?.error;
    throw new Error(message || "Error al subir el archivo.");
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
    const message = error.response?.data?.error;
    throw new Error(message || "Error al crear la carpeta.");
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
    const message = error.response?.data?.error;
    throw new Error(message || "Error al eliminar.");
  }
};
