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
  getFormatosRequest,
  createFormatoRequest,
  updateFormatoRequest,
  deleteFormatoRequest,
  Formato as FormatoAPI,
  FormatoFormData,
} from "@/lib/api/formatos";

export interface Formato {
  id: number;
  nombre: string;
  tipo: string | null;
  enlace: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

interface FormatoAdminContextType {
  formatos: Formato[];
  isLoading: boolean;
  error: string | null;
  createFormato: (data: FormatoFormData) => Promise<void>;
  updateFormato: (id: number, data: FormatoFormData) => Promise<void>;
  deleteFormato: (id: number) => Promise<void>;
  reload: () => Promise<void>;
}

const FormatoAdminContext = createContext<FormatoAdminContextType | undefined>(
  undefined
);

export const FormatoAdminProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFormatos = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getFormatosRequest(user.token);
      setFormatos(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar formatos");
      console.error("Error loading formatos:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      loadFormatos();
    } else {
      setFormatos([]);
    }
  }, [user?.token, loadFormatos]);

  const createFormato = useCallback(
    async (data: FormatoFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        const nuevo = await createFormatoRequest(user.token, data);
        setFormatos((prev) => [nuevo, ...prev]);
      } catch (err: any) {
        throw new Error(err.message || "Error al crear formato");
      }
    },
    [user?.token]
  );

  const updateFormato = useCallback(
    async (id: number, data: FormatoFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        const actualizado = await updateFormatoRequest(user.token, id, data);
        setFormatos((prev) =>
          prev.map((f) => (f.id === id ? actualizado : f))
        );
      } catch (err: any) {
        throw new Error(err.message || "Error al actualizar formato");
      }
    },
    [user?.token]
  );

  const deleteFormato = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        await deleteFormatoRequest(user.token, id);
        setFormatos((prev) => prev.filter((f) => f.id !== id));
      } catch (err: any) {
        throw new Error(err.message || "Error al eliminar formato");
      }
    },
    [user?.token]
  );

  const reload = useCallback(async () => {
    await loadFormatos();
  }, [loadFormatos]);

  return (
    <FormatoAdminContext.Provider
      value={{
        formatos,
        isLoading,
        error,
        createFormato,
        updateFormato,
        deleteFormato,
        reload,
      }}
    >
      {children}
    </FormatoAdminContext.Provider>
  );
};

export const useFormatoAdminContext = () => {
  const context = useContext(FormatoAdminContext);
  if (!context)
    throw new Error(
      "useFormatoAdminContext debe usarse dentro de FormatoAdminProvider"
    );
  return context;
};
