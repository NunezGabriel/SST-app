"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getUsersRequest,
  createUserRequest,
  updateUserRequest,
  activateUserRequest,
  deactivateUserRequest,
  deleteUserRequest,
} from "@/lib/api/users";
import type { TipoUsuario, UserFormData } from "@/components/modals/user/editUserModal";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  tipo: TipoUsuario;
  activo: boolean;
  // Campos solo para la UI (placeholder por ahora)
  charlas: string;
  examen: string;
  cumpl: number;
}

interface UserAdminContextType {
  usuarios: Usuario[];
  isLoading: boolean;
  error: string | null;
  createUsuario: (data: UserFormData) => Promise<void>;
  updateUsuario: (id: number, data: UserFormData) => Promise<void>;
  toggleActivo: (id: number, currentActivo: boolean) => Promise<void>;
  deleteUsuario: (id: number) => Promise<void>;
  reload: () => Promise<void>;
}

const UserAdminContext = createContext<UserAdminContextType | undefined>(
  undefined
);

export const UserAdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapUsuario = (u: any): Usuario => ({
    id: u.id,
    nombre: u.nombre,
    apellido: u.apellido,
    dni: u.dni,
    correo: u.correo,
    tipo: u.tipo,
    activo: u.activo,
    charlas: u.tipo === "WORKER" ? "0/0" : "—",
    examen: u.tipo === "WORKER" ? "No rendido" : "—",
    cumpl: 0,
  });

  const load = useCallback(async () => {
    if (!user || user.rol !== "ADMIN") return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsersRequest(user.token);
      setUsuarios(data.map(mapUsuario));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const createUsuario = async (data: UserFormData) => {
    if (!user) throw new Error("No hay usuario autenticado");
    setError(null);
    try {
      const nuevo = await createUserRequest(user.token, data);
      setUsuarios((prev) => [mapUsuario(nuevo), ...prev]);
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const updateUsuario = async (id: number, data: UserFormData) => {
    if (!user) throw new Error("No hay usuario autenticado");
    setError(null);
    try {
      const actualizado = await updateUserRequest(user.token, id, data);
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                nombre: actualizado.nombre,
                apellido: actualizado.apellido,
                dni: actualizado.dni,
                correo: actualizado.correo,
                tipo: actualizado.tipo,
              }
            : u
        )
      );
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const toggleActivo = async (id: number, currentActivo: boolean) => {
    if (!user) throw new Error("No hay usuario autenticado");
    setError(null);
    try {
      if (currentActivo) {
        await deactivateUserRequest(user.token, id);
      } else {
        await activateUserRequest(user.token, id);
      }
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                activo: !u.activo,
              }
            : u
        )
      );
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const deleteUsuario = async (id: number) => {
    if (!user) throw new Error("No hay usuario autenticado");
    setError(null);
    try {
      await deleteUserRequest(user.token, id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const reload = async () => {
    await load();
  };

  return (
    <UserAdminContext.Provider
      value={{
        usuarios,
        isLoading,
        error,
        createUsuario,
        updateUsuario,
        toggleActivo,
        deleteUsuario,
        reload,
      }}
    >
      {children}
    </UserAdminContext.Provider>
  );
};

export const useUserAdminContext = () => {
  const ctx = useContext(UserAdminContext);
  if (!ctx) {
    throw new Error(
      "useUserAdminContext debe usarse dentro de un UserAdminProvider"
    );
  }
  return ctx;
};

