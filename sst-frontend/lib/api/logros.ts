import axios from "axios";

const API_URL = "http://localhost:8080";

export type EstadoLogro = "PENDIENTE" | "CONSEGUIDO";

export interface Logro {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  fechaCreacion: string;
}

/** UsuarioLogro: estado del logro para un worker específico */
export interface UsuarioLogro {
  id: number;
  idUsuario: number;
  idLogro: number;
  estado: EstadoLogro;
  fechaConseguido: string | null;
  logro: Logro;
}

const handleError = (error: any, fallback: string): never => {
  if (error.response) {
    const msg = error.response.data?.message || error.response.data?.error;
    if (error.response.status === 401)
      throw new Error("No autorizado. Inicia sesión nuevamente.");
    if (error.response.status === 403)
      throw new Error("No tienes permisos para realizar esta acción.");
    if (msg) throw new Error(msg);
  } else if (error.request) {
    throw new Error("No se pudo conectar con el servidor.");
  }
  throw new Error(fallback);
};

/** GET /api/logros — Logros del worker autenticado (con estado) */
export const getLogrosUsuarioRequest = async (
  token: string
): Promise<UsuarioLogro[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/logros`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return handleError(error, "Error al cargar logros del usuario.");
  }
};

/** GET /api/logros/admin — Todos los logros del sistema (admin) */
export const getLogrosAdminRequest = async (
  token: string
): Promise<Logro[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/logros/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return handleError(error, "Error al cargar logros del sistema.");
  }
};