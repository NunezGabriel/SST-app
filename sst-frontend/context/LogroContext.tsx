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
  getLogrosUsuarioRequest,
  getLogrosAdminRequest,
  type Logro,
  type UsuarioLogro,
} from "@/lib/api/logros";

interface LogroContextType {
  /** Para workers: sus logros con estado (PENDIENTE / CONSEGUIDO) */
  logrosUsuario: UsuarioLogro[];
  /** Para admin: todos los logros del sistema */
  logrosAdmin: Logro[];
  isLoading: boolean;
  reload: () => Promise<void>;
}

const LogroContext = createContext<LogroContextType | undefined>(undefined);

export const LogroProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [logrosUsuario, setLogrosUsuario] = useState<UsuarioLogro[]>([]);
  const [logrosAdmin, setLogrosAdmin] = useState<Logro[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogros = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    try {
      if (user.rol === "WORKER") {
        const data = await getLogrosUsuarioRequest(user.token);
        setLogrosUsuario(data);
      } else if (user.rol === "ADMIN") {
        const data = await getLogrosAdminRequest(user.token);
        setLogrosAdmin(data);
      }
    } catch (error) {
      console.error("Error al cargar logros:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, user?.rol]);

  useEffect(() => {
    if (user?.token) {
      fetchLogros();
    } else {
      setLogrosUsuario([]);
      setLogrosAdmin([]);
    }
  }, [user?.token, fetchLogros]);

  const reload = useCallback(async () => {
    await fetchLogros();
  }, [fetchLogros]);

  return (
    <LogroContext.Provider
      value={{ logrosUsuario, logrosAdmin, isLoading, reload }}
    >
      {children}
    </LogroContext.Provider>
  );
};

export const useLogroContext = () => {
  const context = useContext(LogroContext);
  if (!context)
    throw new Error("useLogroContext debe usarse dentro de LogroProvider");
  return context;
};
