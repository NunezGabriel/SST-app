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
  getCharlasUsuarioRequest,
  getCharlasAdminRequest,
  marcarCharlaCompletadaRequest,
  createCharlaRequest,
  updateCharlaRequest,
  deleteCharlaRequest,
  type Charla,
  type CharlaFormData,
} from "@/lib/api/charlas";

// Re-exportar tipos de la API
export type { Charla, CharlaFormData } from "@/lib/api/charlas";

interface CharlaAdminContextType {
  charlas: Charla[];
  charlasUsuario: Charla[];
  isLoading: boolean;
  error: string | null;
  createCharla: (data: CharlaFormData) => Promise<void>;
  updateCharla: (id: number, data: CharlaFormData) => Promise<void>;
  deleteCharla: (id: number) => Promise<void>;
  marcarCompletada: (id: number) => Promise<void>;
  reload: () => Promise<void>;
  reloadUsuario: () => Promise<void>;
}

const CharlaAdminContext = createContext<
  CharlaAdminContextType | undefined
>(undefined);

export const CharlaAdminProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [charlas, setCharlas] = useState<Charla[]>([]);
  const [charlasUsuario, setCharlasUsuario] = useState<Charla[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCharlasAdmin = useCallback(async () => {
    if (!user?.token || user.rol !== "ADMIN") return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCharlasAdminRequest(user.token);
      setCharlas(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar charlas");
      console.error("Error loading charlas admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, user?.rol]);

  const loadCharlasUsuario = useCallback(async () => {
    if (!user?.token || user.rol !== "WORKER") return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getCharlasUsuarioRequest(user.token);
      setCharlasUsuario(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar charlas");
      console.error("Error loading charlas usuario:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, user?.rol]);

  useEffect(() => {
    if (user?.token) {
      if (user.rol === "ADMIN") {
        loadCharlasAdmin();
      } else if (user.rol === "WORKER") {
        loadCharlasUsuario();
      }
    } else {
      setCharlas([]);
      setCharlasUsuario([]);
    }
  }, [user?.token, user?.rol, loadCharlasAdmin, loadCharlasUsuario]);

  const createCharla = useCallback(
    async (data: CharlaFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        const nueva = await createCharlaRequest(user.token, data);
        setCharlas((prev) => [nueva, ...prev]);
        // Si es worker, recargar también sus charlas
        if (user.rol === "WORKER") {
          await loadCharlasUsuario();
        }
      } catch (err: any) {
        throw new Error(err.message || "Error al crear charla");
      }
    },
    [user?.token, user?.rol, loadCharlasUsuario]
  );

  const updateCharla = useCallback(
    async (id: number, data: CharlaFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        const actualizada = await updateCharlaRequest(user.token, id, data);
        setCharlas((prev) =>
          prev.map((c) => (c.id === id ? actualizada : c))
        );
        // Si es worker, recargar también sus charlas
        if (user.rol === "WORKER") {
          await loadCharlasUsuario();
        }
      } catch (err: any) {
        throw new Error(err.message || "Error al actualizar charla");
      }
    },
    [user?.token, user?.rol, loadCharlasUsuario]
  );

  const deleteCharla = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        await deleteCharlaRequest(user.token, id);
        setCharlas((prev) => prev.filter((c) => c.id !== id));
        setCharlasUsuario((prev) => prev.filter((c) => c.id !== id));
      } catch (err: any) {
        throw new Error(err.message || "Error al eliminar charla");
      }
    },
    [user?.token]
  );

  const marcarCompletada = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        await marcarCharlaCompletadaRequest(user.token, id);
        // Actualizar el estado local
        setCharlasUsuario((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  estado: "COMPLETADA" as const,
                  fechaCompletada: new Date().toISOString(),
                }
              : c
          )
        );
      } catch (err: any) {
        throw new Error(err.message || "Error al marcar charla como completada");
      }
    },
    [user?.token]
  );

  const reload = useCallback(async () => {
    if (user?.rol === "ADMIN") {
      await loadCharlasAdmin();
    }
  }, [user?.rol, loadCharlasAdmin]);

  const reloadUsuario = useCallback(async () => {
    if (user?.rol === "WORKER") {
      await loadCharlasUsuario();
    }
  }, [user?.rol, loadCharlasUsuario]);

  return (
    <CharlaAdminContext.Provider
      value={{
        charlas,
        charlasUsuario,
        isLoading,
        error,
        createCharla,
        updateCharla,
        deleteCharla,
        marcarCompletada,
        reload,
        reloadUsuario,
      }}
    >
      {children}
    </CharlaAdminContext.Provider>
  );
};

export const useCharlaAdminContext = () => {
  const context = useContext(CharlaAdminContext);
  if (!context)
    throw new Error(
      "useCharlaAdminContext debe usarse dentro de CharlaAdminProvider"
    );
  return context;
};
