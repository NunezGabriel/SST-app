"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getUsersWithStatsRequest,
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
  telefono?: string | null;
  idSede: number;       // ← FK
  sedNombre: string;    // ← nombre de la sede para mostrar en tabla
  // UI stats
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

const UserAdminContext = createContext<UserAdminContextType | undefined>(undefined);

export const UserAdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [usuarios,  setUsuarios]  = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const mapUsuario = (u: any): Usuario => ({
    id:        u.id,
    nombre:    u.nombre,
    apellido:  u.apellido,
    dni:       u.dni,
    correo:    u.correo,
    tipo:      u.tipo,
    activo:    u.activo,
    telefono:  u.telefono ?? null,
    idSede:    u.idSede ?? u.sede?.id ?? 0,
    sedNombre: u.sede?.nombre ?? "Sin Sede",
    charlas:   u.tipo === "WORKER" ? `${u.charlasCompletadas ?? 0}/${u.totalCharlas ?? 0}` : "—",
    examen:    u.examenStatus ?? (u.tipo === "WORKER" ? "No rendido" : "—"),
    cumpl:     u.tipo === "WORKER" ? (u.cumpl ?? 0) : 0,
  });

  const load = useCallback(async () => {
    if (!user || user.rol !== "ADMIN") return;
    setIsLoading(true); setError(null);
    try {
      const data = await getUsersWithStatsRequest(user.token);
      setUsuarios(data.map(mapUsuario));
    } catch (err: any) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const createUsuario = async (data: UserFormData) => {
    if (!user) throw new Error("No hay usuario autenticado");
    const nuevo = await createUserRequest(user.token, data);
    setUsuarios((prev) => [mapUsuario(nuevo), ...prev]);
  };

  const updateUsuario = async (id: number, data: UserFormData) => {
    if (!user) throw new Error("No hay usuario autenticado");
    const actualizado = await updateUserRequest(user.token, id, data);
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, ...mapUsuario(actualizado) } : u));
  };

  const toggleActivo = async (id: number, currentActivo: boolean) => {
    if (!user) throw new Error("No hay usuario autenticado");
    if (currentActivo) { await deactivateUserRequest(user.token, id); }
    else               { await activateUserRequest(user.token, id);   }
    setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, activo: !u.activo } : u));
  };

  const deleteUsuario = async (id: number) => {
    if (!user) throw new Error("No hay usuario autenticado");
    await deleteUserRequest(user.token, id);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <UserAdminContext.Provider value={{ usuarios, isLoading, error, createUsuario, updateUsuario, toggleActivo, deleteUsuario, reload: load }}>
      {children}
    </UserAdminContext.Provider>
  );
};

export const useUserAdminContext = () => {
  const ctx = useContext(UserAdminContext);
  if (!ctx) throw new Error("useUserAdminContext debe usarse dentro de UserAdminProvider");
  return ctx;
};