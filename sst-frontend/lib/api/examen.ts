import axios from "axios";

const API_URL = "http://localhost:8080";

export type Opcion = "A" | "B" | "C" | "D";

export interface PreguntaExamen {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuestaCorrecta: Opcion;
  activa: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface PreguntaExamenFormData {
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuestaCorrecta: Opcion;
  activa?: boolean;
}

export interface ConfiguracionExamen {
  id: number;
  puntajeAprobatorio: number;
  puntajeTotal: number;
  intentosMaximos: number;
  tiempoEsperaMinutos: number;
  fechaActualizacion?: string;
}

export interface ConfiguracionExamenFormData {
  puntajeAprobatorio: number;
  puntajeTotal: number;
  intentosMaximos: number;
  tiempoEsperaMinutos: number;
}

export interface IntentoExamen {
  id: number;
  numeroIntento: number;
  puntajeObtenido: number;
  aprobado: boolean;
  respuestasJson?: any;
  fechaIntento: string;
}

export interface EstadoExamen {
  bloqueado: boolean;
  bloqueadoHasta: string | null;
  intentosUsados: number;
  intentosMaximos: number;
  puedeRendir: boolean;
  mejorPuntaje: number | null;
  aprobado: boolean;
  historial: number;
}

export interface ResultadoExamen {
  intento: IntentoExamen;
  puntaje: number;
  puntajeTotal: number;
  aprobado: boolean;
  respuestasDetalle: any;
}

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

// ========== CONFIGURACIÓN ==========
export const getConfiguracionRequest = async (
  token: string
): Promise<ConfiguracionExamen> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/config`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.error || "Error al obtener configuración.";
      throw new Error(message);
    }
    throw new Error("Error al obtener configuración del examen.");
  }
};

export const updateConfiguracionRequest = async (
  token: string,
  data: ConfiguracionExamenFormData
): Promise<ConfiguracionExamen> => {
  try {
    const response = await axios.put(`${API_URL}/api/examen/config`, data, {
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.error || "Error al actualizar configuración.";
      throw new Error(message);
    }
    throw new Error("Error al actualizar configuración del examen.");
  }
};

// ========== PREGUNTAS (ADMIN) ==========
export const getPreguntasRequest = async (
  token: string
): Promise<PreguntaExamen[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/preguntas`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para ver las preguntas.");
      }
    }
    throw new Error("Error al obtener preguntas.");
  }
};

export const getPreguntasActivasRequest = async (
  token: string
): Promise<PreguntaExamen[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/preguntas/activas`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
    }
    throw new Error("Error al obtener preguntas activas.");
  }
};

export const getPreguntaRequest = async (
  token: string,
  id: number
): Promise<PreguntaExamen> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/preguntas/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("Pregunta no encontrada.");
      }
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos.");
      }
    }
    throw new Error("Error al obtener la pregunta.");
  }
};

export const createPreguntaRequest = async (
  token: string,
  data: PreguntaExamenFormData
): Promise<PreguntaExamen> => {
  try {
    const response = await axios.post(`${API_URL}/api/examen/preguntas`, data, {
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
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
        throw new Error("No tienes permisos para crear preguntas.");
      }
      if (status === 400) {
        throw new Error(
          error.response.data?.error || "Datos de pregunta inválidos."
        );
      }
    }
    throw new Error("Error al crear la pregunta.");
  }
};

export const updatePreguntaRequest = async (
  token: string,
  id: number,
  data: Partial<PreguntaExamenFormData>
): Promise<PreguntaExamen> => {
  try {
    const response = await axios.put(`${API_URL}/api/examen/preguntas/${id}`, data, {
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
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
        throw new Error("No tienes permisos para actualizar preguntas.");
      }
      if (status === 404) {
        throw new Error("Pregunta no encontrada.");
      }
    }
    throw new Error("Error al actualizar la pregunta.");
  }
};

export const deletePreguntaRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/examen/preguntas/${id}`, {
      headers: getAuthHeaders(token),
    });
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 403) {
        throw new Error("No tienes permisos para eliminar preguntas.");
      }
      if (status === 404) {
        throw new Error("Pregunta no encontrada.");
      }
    }
    throw new Error("Error al eliminar la pregunta.");
  }
};

// ========== RENDIR EXAMEN (WORKER) ==========
export const generarPreguntasRequest = async (
  token: string
): Promise<PreguntaExamen[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/generar`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      const message = error.response.data?.error || "Error al generar preguntas.";
      throw new Error(message);
    }
    throw new Error("Error al generar preguntas del examen.");
  }
};

export const rendirExamenRequest = async (
  token: string,
  respuestas: Record<number, Opcion>
): Promise<ResultadoExamen> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/examen/rendir`,
      { respuestas },
      {
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      if (status === 400) {
        const message = error.response.data?.error || "Error al rendir el examen.";
        throw new Error(message);
      }
    }
    throw new Error("Error al rendir el examen.");
  }
};

export const getHistorialIntentosRequest = async (
  token: string
): Promise<IntentoExamen[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/historial`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
    }
    throw new Error("Error al obtener historial de intentos.");
  }
};

export const getEstadoExamenRequest = async (
  token: string
): Promise<EstadoExamen> => {
  try {
    const response = await axios.get(`${API_URL}/api/examen/estado`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
    }
    throw new Error("Error al obtener estado del examen.");
  }
};

export const resetearBloqueoRequest = async (token: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/api/examen/resetear-bloqueo`,
      {},
      {
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("No autorizado.");
      }
      const message = error.response.data?.error || "Error al resetear bloqueo.";
      throw new Error(message);
    }
    throw new Error("Error al resetear el bloqueo.");
  }
};
