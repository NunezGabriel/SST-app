"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  loginRequest,
  changePasswordRequest,
  logoutRequest,
  solicitarRecuperacionRequest,
  validarCodigoRequest,
  resetPasswordRequest,
} from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nombre: string;
  rol: string;
  email?: string;
  token: string;
  apellido?: string;
  sede: string;    // nombre de la sede, ej: "CHICLAYO"
  idSede: number;  // FK por si se necesita en algún lado
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  solicitarRecuperacion: (correo: string) => Promise<{ message: string }>;
  validarCodigo: (correo: string, codigo: string) => Promise<{ valid: boolean; message: string }>;
  resetPassword: (correo: string, codigo: string, nuevaContrasena: string) => Promise<{ message: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    const { token, usuario } = await loginRequest(correo, contrasena);

    const newUser: User = {
      id:       usuario.id,
      nombre:   usuario.nombre,
      rol:      usuario.tipo,
      email:    correo,
      token:    token,
      apellido: usuario.apellido,
      sede:     usuario.sede ?? "",     // ← nombre string directo del payload
      idSede:   usuario.idSede ?? 0,
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    router.push("/dashboard");
  };

  const logout = async () => {
    if (user?.token) {
      try { await logoutRequest(user.token); } catch { /* no-op */ }
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("No hay usuario autenticado");
    await changePasswordRequest(user.token, currentPassword, newPassword);
    alert("Contraseña cambiada correctamente");
  };

  const solicitarRecuperacion = (correo: string) => solicitarRecuperacionRequest(correo);
  const validarCodigo = (correo: string, codigo: string) => validarCodigoRequest(correo, codigo);
  const resetPassword = (correo: string, codigo: string, nuevaContrasena: string) =>
    resetPasswordRequest(correo, codigo, nuevaContrasena);

  return (
    <AuthContext.Provider value={{ user, login, logout, changePassword, solicitarRecuperacion, validarCodigo, resetPassword, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return ctx;
};