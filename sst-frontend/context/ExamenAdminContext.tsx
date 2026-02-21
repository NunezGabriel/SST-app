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
  getConfiguracionRequest,
  updateConfiguracionRequest,
  getPreguntasRequest,
  getPreguntasActivasRequest,
  createPreguntaRequest,
  updatePreguntaRequest,
  deletePreguntaRequest,
  generarPreguntasRequest,
  rendirExamenRequest,
  getHistorialIntentosRequest,
  getEstadoExamenRequest,
  resetearBloqueoRequest,
  type PreguntaExamen,
  type PreguntaExamenFormData,
  type ConfiguracionExamen,
  type ConfiguracionExamenFormData,
  type EstadoExamen,
  type ResultadoExamen,
  type IntentoExamen,
} from "@/lib/api/examen";

interface ExamenAdminContextType {
  // Configuración
  configuracion: ConfiguracionExamen | null;
  isLoadingConfig: boolean;
  updateConfiguracion: (data: ConfiguracionExamenFormData) => Promise<void>;
  refreshConfiguracion: () => Promise<void>;

  // Preguntas (Admin)
  preguntas: PreguntaExamen[];
  preguntasActivas: PreguntaExamen[];
  isLoadingPreguntas: boolean;
  error: string | null;
  createPregunta: (data: PreguntaExamenFormData) => Promise<void>;
  updatePregunta: (id: number, data: Partial<PreguntaExamenFormData>) => Promise<void>;
  deletePregunta: (id: number) => Promise<void>;
  refreshPreguntas: () => Promise<void>;

  // Examen (Worker)
  preguntasExamen: PreguntaExamen[];
  estadoExamen: EstadoExamen | null;
  historialIntentos: IntentoExamen[];
  isLoadingExamen: boolean;
  errorExamen: string | null;
  generarPreguntas: () => Promise<void>;
  rendirExamen: (respuestas: Record<number, string>) => Promise<ResultadoExamen>;
  refreshEstadoExamen: () => Promise<void>;
  refreshHistorial: () => Promise<void>;
  resetearBloqueo: () => Promise<void>;
}

const ExamenAdminContext = createContext<ExamenAdminContextType | undefined>(
  undefined
);

export const ExamenAdminProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [configuracion, setConfiguracion] = useState<ConfiguracionExamen | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [preguntas, setPreguntas] = useState<PreguntaExamen[]>([]);
  const [preguntasActivas, setPreguntasActivas] = useState<PreguntaExamen[]>([]);
  const [isLoadingPreguntas, setIsLoadingPreguntas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preguntasExamen, setPreguntasExamen] = useState<PreguntaExamen[]>([]);
  const [estadoExamen, setEstadoExamen] = useState<EstadoExamen | null>(null);
  const [historialIntentos, setHistorialIntentos] = useState<IntentoExamen[]>([]);
  const [isLoadingExamen, setIsLoadingExamen] = useState(false);
  const [errorExamen, setErrorExamen] = useState<string | null>(null);

  // ========== CONFIGURACIÓN ==========
  const fetchConfiguracion = useCallback(async () => {
    if (!user?.token) {
      setConfiguracion(null);
      setIsLoadingConfig(false);
      return;
    }

    try {
      setIsLoadingConfig(true);
      const data = await getConfiguracionRequest(user.token);
      setConfiguracion(data);
    } catch (err: any) {
      console.error("Error al obtener configuración:", err);
      setError(err.message || "Error al cargar configuración");
    } finally {
      setIsLoadingConfig(false);
    }
  }, [user?.token]);

  const updateConfiguracion = useCallback(
    async (data: ConfiguracionExamenFormData) => {
      if (!user?.token) throw new Error("No hay token de autenticación");

      try {
        setError(null);
        const updated = await updateConfiguracionRequest(user.token, data);
        setConfiguracion(updated);
      } catch (err: any) {
        console.error("Error al actualizar configuración:", err);
        const errorMessage = err.message || "Error al actualizar configuración";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.token]
  );

  // ========== PREGUNTAS (ADMIN) ==========
  const fetchPreguntas = useCallback(async () => {
    if (!user?.token || user.rol !== "ADMIN") {
      setPreguntas([]);
      setIsLoadingPreguntas(false);
      return;
    }

    try {
      setIsLoadingPreguntas(true);
      setError(null);
      const [allPreguntas, activas] = await Promise.all([
        getPreguntasRequest(user.token),
        getPreguntasActivasRequest(user.token),
      ]);
      setPreguntas(allPreguntas);
      setPreguntasActivas(activas);
    } catch (err: any) {
      console.error("Error al obtener preguntas:", err);
      setError(err.message || "Error al cargar preguntas");
    } finally {
      setIsLoadingPreguntas(false);
    }
  }, [user?.token, user?.rol]);

  const createPregunta = useCallback(
    async (data: PreguntaExamenFormData) => {
      if (!user?.token) throw new Error("No hay token de autenticación");

      try {
        setError(null);
        const nueva = await createPreguntaRequest(user.token, data);
        setPreguntas((prev) => [nueva, ...prev]);
        if (nueva.activa) {
          setPreguntasActivas((prev) => [nueva, ...prev]);
        }
      } catch (err: any) {
        console.error("Error al crear pregunta:", err);
        const errorMessage = err.message || "Error al crear pregunta";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.token]
  );

  const updatePregunta = useCallback(
    async (id: number, data: Partial<PreguntaExamenFormData>) => {
      if (!user?.token) throw new Error("No hay token de autenticación");

      try {
        setError(null);
        const updated = await updatePreguntaRequest(user.token, id, data);
        setPreguntas((prev) =>
          prev.map((p) => (p.id === id ? updated : p))
        );
        // Actualizar también en activas si cambió el estado
        if (data.activa !== undefined) {
          if (updated.activa) {
            setPreguntasActivas((prev) => {
              const exists = prev.find((p) => p.id === id);
              return exists ? prev.map((p) => (p.id === id ? updated : p)) : [...prev, updated];
            });
          } else {
            setPreguntasActivas((prev) => prev.filter((p) => p.id !== id));
          }
        } else {
          setPreguntasActivas((prev) =>
            prev.map((p) => (p.id === id ? updated : p))
          );
        }
      } catch (err: any) {
        console.error("Error al actualizar pregunta:", err);
        const errorMessage = err.message || "Error al actualizar pregunta";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.token]
  );

  const deletePregunta = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay token de autenticación");

      try {
        setError(null);
        await deletePreguntaRequest(user.token, id);
        setPreguntas((prev) => prev.filter((p) => p.id !== id));
        setPreguntasActivas((prev) => prev.filter((p) => p.id !== id));
      } catch (err: any) {
        console.error("Error al eliminar pregunta:", err);
        const errorMessage = err.message || "Error al eliminar pregunta";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [user?.token]
  );

  // ========== EXAMEN (WORKER) ==========
  const generarPreguntas = useCallback(async () => {
    if (!user?.token || user.rol !== "WORKER") {
      setPreguntasExamen([]);
      setIsLoadingExamen(false);
      return;
    }

    try {
      setIsLoadingExamen(true);
      setErrorExamen(null);
      const data = await generarPreguntasRequest(user.token);
      setPreguntasExamen(data);
    } catch (err: any) {
      console.error("Error al generar preguntas:", err);
      setErrorExamen(err.message || "Error al generar preguntas");
      throw err;
    } finally {
      setIsLoadingExamen(false);
    }
  }, [user?.token, user?.rol]);

  const rendirExamen = useCallback(
    async (respuestas: Record<number, string>) => {
      if (!user?.token) throw new Error("No hay token de autenticación");

      try {
        setErrorExamen(null);
        const resultado = await rendirExamenRequest(user.token, respuestas as Record<number, "A" | "B" | "C" | "D">);
        // Refrescar estado y historial después de rendir
        await Promise.all([fetchEstadoExamen(), fetchHistorial()]);
        return resultado;
      } catch (err: any) {
        console.error("Error al rendir examen:", err);
        setErrorExamen(err.message || "Error al rendir examen");
        throw err;
      }
    },
    [user?.token]
  );

  const fetchEstadoExamen = useCallback(async () => {
    if (!user?.token || user.rol !== "WORKER") {
      setEstadoExamen(null);
      return;
    }

    try {
      const data = await getEstadoExamenRequest(user.token);
      setEstadoExamen(data);
    } catch (err: any) {
      console.error("Error al obtener estado del examen:", err);
      setErrorExamen(err.message || "Error al obtener estado");
    }
  }, [user?.token, user?.rol]);

  const fetchHistorial = useCallback(async () => {
    if (!user?.token || user.rol !== "WORKER") {
      setHistorialIntentos([]);
      return;
    }

    try {
      const data = await getHistorialIntentosRequest(user.token);
      setHistorialIntentos(data);
    } catch (err: any) {
      console.error("Error al obtener historial:", err);
      setErrorExamen(err.message || "Error al obtener historial");
    }
  }, [user?.token, user?.rol]);

  const resetearBloqueo = useCallback(async () => {
    if (!user?.token) throw new Error("No hay token de autenticación");

    try {
      setErrorExamen(null);
      await resetearBloqueoRequest(user.token);
      await fetchEstadoExamen();
    } catch (err: any) {
      console.error("Error al resetear bloqueo:", err);
      const errorMessage = err.message || "Error al resetear bloqueo";
      setErrorExamen(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user?.token, fetchEstadoExamen]);

  // Efectos
  useEffect(() => {
    fetchConfiguracion();
  }, [fetchConfiguracion]);

  useEffect(() => {
    if (user?.rol === "ADMIN") {
      fetchPreguntas();
    }
  }, [fetchPreguntas, user?.rol]);

  useEffect(() => {
    if (user?.rol === "WORKER") {
      fetchEstadoExamen();
      fetchHistorial();
    }
  }, [fetchEstadoExamen, fetchHistorial, user?.rol]);

  return (
    <ExamenAdminContext.Provider
      value={{
        // Configuración
        configuracion,
        isLoadingConfig,
        updateConfiguracion,
        refreshConfiguracion: fetchConfiguracion,

        // Preguntas (Admin)
        preguntas,
        preguntasActivas,
        isLoadingPreguntas,
        error,
        createPregunta,
        updatePregunta,
        deletePregunta,
        refreshPreguntas: fetchPreguntas,

        // Examen (Worker)
        preguntasExamen,
        estadoExamen,
        historialIntentos,
        isLoadingExamen,
        errorExamen,
        generarPreguntas,
        rendirExamen,
        refreshEstadoExamen: fetchEstadoExamen,
        refreshHistorial: fetchHistorial,
        resetearBloqueo,
      }}
    >
      {children}
    </ExamenAdminContext.Provider>
  );
};

export const useExamenAdminContext = () => {
  const context = useContext(ExamenAdminContext);
  if (!context)
    throw new Error(
      "useExamenAdminContext debe usarse dentro de ExamenAdminProvider"
    );
  return context;
};
