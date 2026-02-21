import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Formato {
  id: number;
  nombre: string;
  tipo: string | null;
  enlace: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface FormatoFormData {
  nombre: string;
  tipo: string;
  enlace: string;
}

// ✅ Listar todos los formatos (requiere autenticación)
export const getFormatosRequest = async (token: string): Promise<Formato[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/formatos`, {
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
    throw new Error("Error al obtener los formatos.");
  }
};

// ✅ Obtener un formato por ID
export const getFormatoRequest = async (
  token: string,
  id: number
): Promise<Formato> => {
  try {
    const response = await axios.get(`${API_URL}/api/formatos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("Formato no encontrado.");
      }
      if (status === 401) {
        throw new Error("No autorizado.");
      }
    }
    throw new Error("Error al obtener el formato.");
  }
};

// ✅ Crear formato (solo ADMIN)
export const createFormatoRequest = async (
  token: string,
  data: FormatoFormData
): Promise<Formato> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/formatos`,
      {
        nombre: data.nombre,
        tipo: data.tipo || null,
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
        throw new Error("No tienes permisos para crear formatos.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al crear el formato.");
  }
};

// ✅ Actualizar formato (solo ADMIN)
export const updateFormatoRequest = async (
  token: string,
  id: number,
  data: FormatoFormData
): Promise<Formato> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/formatos/${id}`,
      {
        nombre: data.nombre,
        tipo: data.tipo || null,
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
        throw new Error("No tienes permisos para editar formatos.");
      }
      if (status === 404) {
        throw new Error("Formato no encontrado.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al actualizar el formato.");
  }
};

// ✅ Eliminar formato (solo ADMIN)
export const deleteFormatoRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/formatos/${id}`, {
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
        throw new Error("No tienes permisos para eliminar formatos.");
      }
      if (status === 404) {
        throw new Error("Formato no encontrado.");
      }
    }
    throw new Error("Error al eliminar el formato.");
  }
};
