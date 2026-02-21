"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loginRequest, changePasswordRequest, logoutRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nombre: string;
  rol: string;
  email?: string;
  token: string;
  apellido?: string;
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Error decodificando token:", err);
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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (correo: string, contrasena: string) => {
    try {
      const { token, usuario } = await loginRequest(correo, contrasena);
      
      const newUser: User = {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.tipo,
        email: correo,
        token: token,
        apellido: usuario.apellido,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      router.push("/dashboard");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    // Llamar al backend para logout (aunque con JWT stateless es principalmente simbólico)
    if (user?.token) {
      try {
        await logoutRequest(user.token);
      } catch (error) {
        console.error("Error al cerrar sesión en el servidor:", error);
      }
    }
    // Limpiar datos del cliente
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user) throw new Error("No hay usuario autenticado");
    try {
      await changePasswordRequest(user.token, currentPassword, newPassword);
      alert("Contraseña cambiada correctamente");
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, changePassword, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  return context;
};
