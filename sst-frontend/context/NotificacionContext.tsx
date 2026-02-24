"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthContext } from "@/context/AuthContext";
import {
  getNotificacionesRequest,
  marcarLeidaRequest,
  marcarTodasLeidasRequest,
  type Notificacion,
} from "@/lib/api/notificaciones";
import ToastNotification from "@/components/ToastNotification";

interface ToastItem {
  id: number;
  notificacion: Notificacion;
}

interface NotificacionContextType {
  notificaciones: Notificacion[];
  unreadCount: number;
  isLoading: boolean;
  marcarLeida: (id: number) => Promise<void>;
  marcarTodasLeidas: () => Promise<void>;
  reload: () => Promise<void>;
}

const NotificacionContext = createContext<NotificacionContextType | undefined>(
  undefined,
);

export const NotificacionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prevIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);

  const fetchNotificaciones = useCallback(
    async (showNewToasts = false) => {
      if (!user?.token) return;

      try {
        const data = await getNotificacionesRequest(user.token);
        setNotificaciones(data);

        // Detectar nuevas notificaciones para mostrar toast
        if (showNewToasts && !isFirstLoadRef.current) {
          const newOnes = data.filter(
            (n) => !prevIdsRef.current.has(n.id) && !n.leida,
          );
          newOnes.forEach((n) => {
            setToasts((prev) => [
              ...prev,
              { id: Date.now() + n.id, notificacion: n },
            ]);
          });
        }

        // Si es la primera carga, solo actualizamos el set de IDs sin mostrar toasts
        if (isFirstLoadRef.current) {
          isFirstLoadRef.current = false;
        }

        // Actualizar el set de IDs conocidos
        prevIdsRef.current = new Set(data.map((n) => n.id));
      } catch (error) {
        // Silenciar errores de polling
      }
    },
    [user?.token],
  );

  // Carga inicial
  useEffect(() => {
    if (user?.token) {
      isFirstLoadRef.current = true;
      setIsLoading(true);
      fetchNotificaciones(false).finally(() => setIsLoading(false));
    } else {
      setNotificaciones([]);
      prevIdsRef.current = new Set();
      isFirstLoadRef.current = true;
    }
  }, [user?.token, fetchNotificaciones]);

  // Polling cada 30 segundos para detectar nuevas notificaciones
  useEffect(() => {
    if (!user?.token) return;

    const interval = setInterval(() => {
      fetchNotificaciones(true);
    }, 30_000);

    return () => clearInterval(interval);
  }, [user?.token, fetchNotificaciones]);

  const marcarLeida = useCallback(
    async (id: number) => {
      if (!user?.token) return;
      try {
        await marcarLeidaRequest(user.token, id);
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, leida: true, fechaLectura: new Date().toISOString() }
              : n,
          ),
        );
      } catch (error) {
        console.error("Error al marcar notificación:", error);
      }
    },
    [user?.token],
  );

  const marcarTodasLeidas = useCallback(async () => {
    if (!user?.token) return;
    try {
      await marcarTodasLeidasRequest(user.token);
      setNotificaciones((prev) =>
        prev.map((n) => ({
          ...n,
          leida: true,
          fechaLectura: new Date().toISOString(),
        })),
      );
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  }, [user?.token]);

  const reload = useCallback(async () => {
    await fetchNotificaciones(true);
  }, [fetchNotificaciones]);

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  const dismissToast = (toastId: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  return (
    <NotificacionContext.Provider
      value={{
        notificaciones,
        unreadCount,
        isLoading,
        marcarLeida,
        marcarTodasLeidas,
        reload,
      }}
    >
      {children}

      {/* Cola de toasts globales con AnimatePresence */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div key={t.id} layout className="pointer-events-auto">
              <ToastNotification
                type={
                  t.notificacion.tipo.toLowerCase() as
                    | "logro"
                    | "nuevo"
                    | "pendiente"
                }
                title={t.notificacion.nombre}
                message={t.notificacion.descripcion}
                onClose={() => dismissToast(t.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificacionContext.Provider>
  );
};

export const useNotificacionContext = () => {
  const context = useContext(NotificacionContext);
  if (!context)
    throw new Error(
      "useNotificacionContext debe usarse dentro de NotificacionProvider",
    );
  return context;
};
