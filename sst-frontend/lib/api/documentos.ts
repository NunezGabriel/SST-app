import axios from "axios";

const API_URL = "http://localhost:8080";

export type TipoDocumento = "PROCEDIMIENTO" | "INSTRUCTIVO" | "MANUAL";

export interface Documento {
  id: number;
  nombre: string;
  tipo: TipoDocumento;
  enlace: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

// Para workers: incluye estado de visualización
export interface DocumentoUsuario extends Documento {
  estado: "SIN_VER" | "VISTO";
  fechaVisualizacion?: string | null;
}

export interface DocumentoFormData {
  nombre: string;
  tipo: TipoDocumento;
  enlace: string;
}

// ✅ Listar documentos del usuario (worker) - incluye estado de visualización
export const getDocumentosUsuarioRequest = async (
  token: string
): Promise<DocumentoUsuario[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/documentos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
    }
    throw new Error("Error al obtener los documentos.");
  }
};

// ✅ Listar todos los documentos (admin)
export const getDocumentosAdminRequest = async (
  token: string
): Promise<Documento[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/documentos/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para ver todos los documentos.");
      }
    }
    throw new Error("Error al obtener los documentos.");
  }
};

// ✅ Marcar documento como visto (worker)
export const marcarDocumentoVistoRequest = async (
  token: string,
  id: number
): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/documentos/${id}/visto`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 404) {
        throw new Error("Documento no encontrado.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al marcar documento como visto.");
  }
};

// ✅ Crear documento (solo ADMIN)
export const createDocumentoRequest = async (
  token: string,
  data: DocumentoFormData
): Promise<Documento> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/documentos`,
      {
        nombre: data.nombre,
        tipo: data.tipo,
        enlace: data.enlace,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para crear documentos.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al crear el documento.");
  }
};

// ✅ Actualizar documento (solo ADMIN)
export const updateDocumentoRequest = async (
  token: string,
  id: number,
  data: DocumentoFormData
): Promise<Documento> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/documentos/${id}`,
      {
        nombre: data.nombre,
        tipo: data.tipo,
        enlace: data.enlace,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para editar documentos.");
      }
      if (status === 404) {
        throw new Error("Documento no encontrado.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al actualizar el documento.");
  }
};

// ✅ Eliminar documento (solo ADMIN)
export const deleteDocumentoRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/documentos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para eliminar documentos.");
      }
      if (status === 404) {
        throw new Error("Documento no encontrado.");
      }
    }
    throw new Error("Error al eliminar el documento.");
  }
};
