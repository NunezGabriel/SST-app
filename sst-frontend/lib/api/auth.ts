import axios from "axios";

const API_URL = "http://localhost:8080";

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    tipo: string;
    nombre: string;
    apellido: string;
    sede: string;
    idSede: number;
  };
}

// ✅ Login
export const loginRequest = async (
  correo: string,
  contrasena: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      correo,
      contrasena,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || error.response.data?.error;

      if (status === 401) {
        throw new Error(
          "Credenciales incorrectas. Verifica tu correo y contraseña.",
        );
      } else if (status === 404) {
        throw new Error("Usuario no encontrado.");
      } else if (message) {
        throw new Error(message);
      } else {
        throw new Error("Error al iniciar sesión. Intenta de nuevo.");
      }
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    } else {
      throw new Error("Error inesperado. Intenta de nuevo.");
    }
  }
};

export interface UsuarioCompleto {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  tipo: "ADMIN" | "WORKER";
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  telefono?: string | null;
  idSede: number;
  sede: { id: number; nombre: string };  // ← objeto, no string
}

export interface MeResponse {
  user: UsuarioCompleto;
}

// ✅ Obtener información del usuario autenticado
export const getMeRequest = async (token: string): Promise<MeResponse> => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("Token inválido o expirado.");
      }
    }
    throw new Error("Error al obtener información del usuario.");
  }
};

// ✅ Cambiar contraseña (si existe el endpoint)
export const changePasswordRequest = async (
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  try {
    await axios.put(
      `${API_URL}/api/auth/change-password`,
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error: any) {
    if (error.response) {
      const message =
        error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al cambiar la contraseña.");
    }
    throw new Error("Error al cambiar la contraseña.");
  }
};

// ✅ Logout
export const logoutRequest = async (token: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error: any) {
    // Incluso si falla el request, el logout del cliente debe continuar
    console.error("Error al cerrar sesión en el servidor:", error);
  }
};

// ✅ Solicitar recuperación de contraseña
export const solicitarRecuperacionRequest = async (
  correo: string,
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/password-reset/solicitar`,
      {
        correo,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message =
        error.response.data?.message || error.response.data?.error;
      throw new Error(
        message || "Error al solicitar recuperación de contraseña.",
      );
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    } else {
      throw new Error("Error inesperado. Intenta de nuevo.");
    }
  }
};

// ✅ Validar código de recuperación
export const validarCodigoRequest = async (
  correo: string,
  codigo: string,
): Promise<{ valid: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/password-reset/validar`,
      {
        correo,
        codigo,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message =
        error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al validar el código.");
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    } else {
      throw new Error("Error inesperado. Intenta de nuevo.");
    }
  }
};

// ✅ Restablecer contraseña
export const resetPasswordRequest = async (
  correo: string,
  codigo: string,
  nuevaContrasena: string,
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/password-reset/resetear`,
      {
        correo,
        codigo,
        nuevaContrasena,
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const message =
        error.response.data?.message || error.response.data?.error;
      throw new Error(message || "Error al restablecer la contraseña.");
    } else if (error.request) {
      throw new Error(
        "No se pudo conectar con el servidor. Verifica tu conexión.",
      );
    } else {
      throw new Error("Error inesperado. Intenta de nuevo.");
    }
  }
};
