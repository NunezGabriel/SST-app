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
  getDocumentosUsuarioRequest,
  getDocumentosAdminRequest,
  marcarDocumentoVistoRequest,
  createDocumentoRequest,
  updateDocumentoRequest,
  deleteDocumentoRequest,
  type Documento,
  type DocumentoUsuario,
  type TipoDocumento,
} from "@/lib/api/documentos";
import type { DocumentoFormData } from "@/components/modals/documento/editDocumentoModal";

// Re-exportar tipos de la API
export type { Documento, DocumentoUsuario } from "@/lib/api/documentos";

// Función para convertir tipo del modal (lowercase) al tipo del backend (uppercase)
const convertirTipoABackend = (
  tipo:
    | "procedimiento"
    | "instructivo"
    | "manual"
    | "mapa_de_riesgos"
    | "matriz_ambiental"
    | "matriz_de_epps"
    | "matriz_iperc"
    | "plan_de_contingencia"
    | "planes_qhse"
    | "politica"
    | "programas"
    | "risst"
): TipoDocumento => {
  // Convertir snake_case a UPPER_SNAKE_CASE
  return tipo.toUpperCase() as TipoDocumento;
};

interface DocumentoAdminContextType {
  documentos: Documento[];
  documentosUsuario: DocumentoUsuario[];
  isLoading: boolean;
  error: string | null;
  createDocumento: (data: DocumentoFormData) => Promise<void>;
  updateDocumento: (id: number, data: DocumentoFormData) => Promise<void>;
  deleteDocumento: (id: number) => Promise<void>;
  marcarVisto: (id: number) => Promise<void>;
  reload: () => Promise<void>;
  reloadUsuario: () => Promise<void>;
}

const DocumentoAdminContext = createContext<
  DocumentoAdminContextType | undefined
>(undefined);

export const DocumentoAdminProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuthContext();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [documentosUsuario, setDocumentosUsuario] = useState<
    DocumentoUsuario[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocumentosAdmin = useCallback(async () => {
    if (!user?.token || user.rol !== "ADMIN") return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocumentosAdminRequest(user.token);
      setDocumentos(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar documentos");
      console.error("Error loading documentos admin:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, user?.rol]);

  const loadDocumentosUsuario = useCallback(async () => {
    if (!user?.token || user.rol !== "WORKER") return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocumentosUsuarioRequest(user.token);
      setDocumentosUsuario(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar documentos");
      console.error("Error loading documentos usuario:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token, user?.rol]);

  useEffect(() => {
    if (user?.token) {
      if (user.rol === "ADMIN") {
        loadDocumentosAdmin();
      } else if (user.rol === "WORKER") {
        loadDocumentosUsuario();
      }
    } else {
      setDocumentos([]);
      setDocumentosUsuario([]);
    }
  }, [user?.token, user?.rol, loadDocumentosAdmin, loadDocumentosUsuario]);

  const createDocumento = useCallback(
    async (data: DocumentoFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        // Convertir tipo del modal al formato del backend
        const dataBackend = {
          nombre: data.nombre,
          tipo: convertirTipoABackend(data.tipo),
          enlace: data.enlace,
        };
        const nuevo = await createDocumentoRequest(user.token, dataBackend);
        setDocumentos((prev) => [nuevo, ...prev]);
        // Si es worker, recargar también sus documentos
        if (user.rol === "WORKER") {
          await loadDocumentosUsuario();
        }
      } catch (err: any) {
        throw new Error(err.message || "Error al crear documento");
      }
    },
    [user?.token, user?.rol, loadDocumentosUsuario]
  );

  const updateDocumento = useCallback(
    async (id: number, data: DocumentoFormData) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        // Convertir tipo del modal al formato del backend
        const dataBackend = {
          nombre: data.nombre,
          tipo: convertirTipoABackend(data.tipo),
          enlace: data.enlace,
        };
        const actualizado = await updateDocumentoRequest(
          user.token,
          id,
          dataBackend
        );
        setDocumentos((prev) =>
          prev.map((d) => (d.id === id ? actualizado : d))
        );
        // Si es worker, recargar también sus documentos
        if (user.rol === "WORKER") {
          await loadDocumentosUsuario();
        }
      } catch (err: any) {
        throw new Error(err.message || "Error al actualizar documento");
      }
    },
    [user?.token, user?.rol, loadDocumentosUsuario]
  );

  const deleteDocumento = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        await deleteDocumentoRequest(user.token, id);
        setDocumentos((prev) => prev.filter((d) => d.id !== id));
        setDocumentosUsuario((prev) => prev.filter((d) => d.id !== id));
      } catch (err: any) {
        throw new Error(err.message || "Error al eliminar documento");
      }
    },
    [user?.token]
  );

  const marcarVisto = useCallback(
    async (id: number) => {
      if (!user?.token) throw new Error("No hay usuario autenticado");

      try {
        await marcarDocumentoVistoRequest(user.token, id);
        // Actualizar el estado local
        setDocumentosUsuario((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  estado: "VISTO" as const,
                  fechaVisualizacion: new Date().toISOString(),
                }
              : d
          )
        );
      } catch (err: any) {
        throw new Error(err.message || "Error al marcar documento como visto");
      }
    },
    [user?.token]
  );

  const reload = useCallback(async () => {
    if (user?.rol === "ADMIN") {
      await loadDocumentosAdmin();
    }
  }, [user?.rol, loadDocumentosAdmin]);

  const reloadUsuario = useCallback(async () => {
    if (user?.rol === "WORKER") {
      await loadDocumentosUsuario();
    }
  }, [user?.rol, loadDocumentosUsuario]);

  return (
    <DocumentoAdminContext.Provider
      value={{
        documentos,
        documentosUsuario,
        isLoading,
        error,
        createDocumento,
        updateDocumento,
        deleteDocumento,
        marcarVisto,
        reload,
        reloadUsuario,
      }}
    >
      {children}
    </DocumentoAdminContext.Provider>
  );
};

export const useDocumentoAdminContext = () => {
  const context = useContext(DocumentoAdminContext);
  if (!context)
    throw new Error(
      "useDocumentoAdminContext debe usarse dentro de DocumentoAdminProvider"
    );
  return context;
};
