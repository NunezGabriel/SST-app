import axios from "axios";
import type { TipoUsuario, UserFormData } from "@/components/modals/user/editUserModal";

const API_URL = "http://localhost:8080";

export interface UsuarioApi {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  tipo: TipoUsuario;
  activo: boolean;
}

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getUsersRequest = async (token: string): Promise<UsuarioApi[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/usuarios`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al obtener usuarios.");
    }
    throw new Error("Error al obtener usuarios.");
  }
};

export const createUserRequest = async (
  token: string,
  data: UserFormData
): Promise<UsuarioApi> => {
  try {
    const payload: any = {
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      correo: data.correo,
      tipo: data.tipo,
      contrasena: data.contrasena,
    };

    const response = await axios.post(`${API_URL}/api/usuarios`, payload, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al crear usuario.");
    }
    throw new Error("Error al crear usuario.");
  }
};

export const updateUserRequest = async (
  token: string,
  id: number,
  data: UserFormData
): Promise<UsuarioApi> => {
  try {
    const payload: any = {
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      correo: data.correo,
      tipo: data.tipo,
    };

    if (data.contrasena) {
      payload.contrasena = data.contrasena;
    }

    const response = await axios.put(`${API_URL}/api/usuarios/${id}`, payload, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al actualizar usuario.");
    }
    throw new Error("Error al actualizar usuario.");
  }
};

export const deactivateUserRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/api/usuarios/${id}/desactivar`,
      {},
      {
        headers: getAuthHeaders(token),
      }
    );
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al desactivar usuario.");
    }
    throw new Error("Error al desactivar usuario.");
  }
};

export const activateUserRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/api/usuarios/${id}/activar`,
      {},
      {
        headers: getAuthHeaders(token),
      }
    );
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al activar usuario.");
    }
    throw new Error("Error al activar usuario.");
  }
};

export const deleteUserRequest = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/usuarios/${id}`, {
      headers: getAuthHeaders(token),
    });
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al eliminar usuario.");
    }
    throw new Error("Error al eliminar usuario.");
  }
};

