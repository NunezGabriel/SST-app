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
  getInduccionRequest,
  updateInduccionRequest,
  type Induccion,
  type InduccionFormData,
} from "@/lib/api/induccion";

interface InduccionAdminContextType {
  induccion: Induccion | null;
  isLoading: boolean;
  error: string | null;
  updateInduccion: (data: InduccionFormData) => Promise<void>;
  refreshInduccion: () => Promise<void>;
}

const InduccionAdminContext = createContext<
  InduccionAdminContextType | undefined
>(undefined);

export function InduccionAdminProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuthContext();
  const [induccion, setInduccion] = useState<Induccion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInduccion = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getInduccionRequest(user.token);
      setInduccion(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar material de inducción");
      console.error("Error loading inducción:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchInduccion();
    } else {
      setInduccion(null);
    }
  }, [user?.token, fetchInduccion]);

  const updateInduccion = useCallback(
    async (data: InduccionFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        setError(null);
        const updated = await updateInduccionRequest(user.token, data);
        setInduccion(updated);
      } catch (err: any) {
        const errorMessage = err.message || "Error al actualizar material de inducción";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.token]
  );

  const refreshInduccion = useCallback(async () => {
    await fetchInduccion();
  }, [fetchInduccion]);

  return (
    <InduccionAdminContext.Provider
      value={{
        induccion,
        isLoading,
        error,
        updateInduccion,
        refreshInduccion,
      }}
    >
      {children}
    </InduccionAdminContext.Provider>
  );
}

export function useInduccionAdminContext() {
  const context = useContext(InduccionAdminContext);
  if (context === undefined) {
    throw new Error(
      "useInduccionAdminContext debe usarse dentro de InduccionAdminProvider"
    );
  }
  return context;
}
