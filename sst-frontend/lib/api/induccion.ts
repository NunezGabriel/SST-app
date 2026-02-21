import axios from "axios";

const API_URL = "http://localhost:8080";

export interface Induccion {
  id: number;
  linkDiapo: string;
  linkPdf: string;
  linkVideo: string;
  duracion: number;
  fechaActualizacion: string;
}

export interface InduccionFormData {
  linkDiapo: string;
  linkPdf: string;
  linkVideo: string;
  duracion: number;
}

// Obtener material de inducción
export const getInduccionRequest = async (token: string): Promise<Induccion> => {
  try {
    const response = await axios.get(`${API_URL}/api/induccion`, {
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
    throw new Error("Error al obtener el material de inducción.");
  }
};

// Actualizar material de inducción (admin)
export const updateInduccionRequest = async (
  token: string,
  data: InduccionFormData
): Promise<Induccion> => {
  try {
    const response = await axios.put(`${API_URL}/api/induccion`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error || error.response.data?.message;

      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para actualizar la inducción.");
      }
      if (status === 400 && message) {
        throw new Error(message);
      }
    }
    throw new Error("Error al actualizar el material de inducción.");
  }
};
