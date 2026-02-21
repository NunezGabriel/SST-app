import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Charla {
  id: number;
  nombre: string;
  enlace: string;
  etiqueta: string | null;
  fechaCharla: string; // ISO date string
  estado: "PENDIENTE" | "COMPLETADA";
  fechaCompletada: string | null;
}

export interface CharlaFormData {
  nombre: string;
  enlace: string;
  etiqueta?: string | null;
  fechaCharla: string; // ISO date string "YYYY-MM-DD"
}

// Worker: Listar charlas del usuario con estado
export const getCharlasUsuarioRequest = async (
  token: string
): Promise<Charla[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/charlas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al cargar charlas.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al cargar charlas.");
    }
  }
};

// Admin: Listar todas las charlas
export const getCharlasAdminRequest = async (
  token: string
): Promise<Charla[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/charlas/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al cargar charlas.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al cargar charlas.");
    }
  }
};

// Worker: Marcar charla como completada
export const marcarCharlaCompletadaRequest = async (
  token: string,
  charlaId: number
): Promise<Charla> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/charlas/${charlaId}/completar`,
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
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (status === 404) {
        throw new Error("Charla no encontrada.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al marcar charla como completada.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al marcar charla como completada.");
    }
  }
};

// Admin: Crear charla
export const createCharlaRequest = async (
  token: string,
  data: CharlaFormData
): Promise<Charla> => {
  try {
    const response = await axios.post(`${API_URL}/api/charlas`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al crear charla.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al crear charla.");
    }
  }
};

// Admin: Actualizar charla
export const updateCharlaRequest = async (
  token: string,
  id: number,
  data: CharlaFormData
): Promise<Charla> => {
  try {
    const response = await axios.put(`${API_URL}/api/charlas/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (status === 404) {
        throw new Error("Charla no encontrada.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al actualizar charla.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al actualizar charla.");
    }
  }
};

// Admin: Eliminar charla
export const deleteCharlaRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/charlas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      } else if (status === 403) {
        throw new Error("No tienes permisos para realizar esta acción.");
      } else if (status === 404) {
        throw new Error("Charla no encontrada.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al eliminar charla.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión."
      );
    } else {
      throw new Error("Error inesperado al eliminar charla.");
    }
  }
};
