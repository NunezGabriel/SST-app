import axios from "axios";

const API_URL = "http://localhost:8080";

export type TipoNotificacion = "LOGRO" | "NUEVO" | "PENDIENTE";

export interface Notificacion {
  id: number;
  idUsuario: number;
  nombre: string;
  descripcion: string;
  tipo: TipoNotificacion;
  leida: boolean;
  fechaCreacion: string;
  fechaLectura: string | null;
}

const handleError = (error: any, fallback: string): never => {
  if (error.response) {
    const msg = error.response.data?.message || error.response.data?.error;
    if (error.response.status === 401)
      throw new Error("No autorizado. Inicia sesión nuevamente.");
    if (msg) throw new Error(msg);
  } else if (error.request) {
    throw new Error("No se pudo conectar con el servidor.");
  }
  throw new Error(fallback);
};

/** GET /api/notificaciones — Lista las notificaciones del usuario autenticado */
export const getNotificacionesRequest = async (
  token: string
): Promise<Notificacion[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/notificaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    return handleError(error, "Error al cargar notificaciones.");
  }
};

/** POST /api/notificaciones/:id/leida — Marca una notificación como leída */
export const marcarLeidaRequest = async (
  token: string,
  id: number
): Promise<Notificacion> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/notificaciones/${id}/leida`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    return handleError(error, "Error al marcar notificación como leída.");
  }
};

/** POST /api/notificaciones/marcar-todas-leidas — Marca todas como leídas */
export const marcarTodasLeidasRequest = async (
  token: string
): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/api/notificaciones/marcar-todas-leidas`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error: any) {
    return handleError(error, "Error al marcar todas las notificaciones como leídas.");
  }
};