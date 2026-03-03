"use client";

import { useState, useEffect, useCallback } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { useAuthContext } from "@/context/AuthContext";
import {
  getDriveFilesRequest,
  createDriveFolderRequest,
  deleteDriveItemRequest,
  DriveFile,
} from "@/lib/api/drive";
import {
  Folder,
  FileText,
  ChevronLeft,
  FolderPlus,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  id: string;
  name: string;
}

const ROOT_ID = process.env.NEXT_PUBLIC_DRIVE_ROOT_FOLDER_ID || "";
const FOLDER_MIME = "application/vnd.google-apps.folder";

// ─── Vista ────────────────────────────────────────────────────────────────────

const GestionarCarpetaView = () => {
  const { user } = useAuthContext();

  const [items, setItems] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Breadcrumb: historial de carpetas navegadas
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([
    { id: ROOT_ID, name: "Drive" },
  ]);

  // Crear carpeta
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Eliminar
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const currentFolder = breadcrumb[breadcrumb.length - 1];

  // ─── Fetch del contenido de la carpeta actual ─────────────────────────────
  const fetchItems = useCallback(async () => {
    if (!user?.token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDriveFilesRequest(
        user.token,
        currentFolder.id || undefined,
      );
      setItems(data.files);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolder.id, user?.token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // ─── Navegar a subcarpeta ─────────────────────────────────────────────────
  const handleOpenFolder = (item: DriveFile) => {
    setBreadcrumb((prev) => [...prev, { id: item.id, name: item.name }]);
    setShowCreate(false);
  };

  // ─── Navegar al breadcrumb ────────────────────────────────────────────────
  const handleBreadcrumb = (index: number) => {
    setBreadcrumb((prev) => prev.slice(0, index + 1));
    setShowCreate(false);
  };

  // ─── Crear carpeta ────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!newName.trim() || !user?.token) return;
    setCreating(true);
    try {
      await createDriveFolderRequest(
        user.token,
        newName.trim(),
        currentFolder.id || undefined,
      );
      setNewName("");
      setShowCreate(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // ─── Eliminar ─────────────────────────────────────────────────────────────
  const handleDelete = async (fileId: string) => {
    if (!user?.token) return;
    setDeletingId(fileId);
    try {
      await deleteDriveItemRequest(user.token, fileId);
      setItems((prev) => prev.filter((i) => i.id !== fileId));
      setConfirmId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* — Header — */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            Gestionar Carpetas
          </h1>
          <p className="text-gray-500 text-sm">
            Explora, crea y elimina carpetas y archivos en Drive
          </p>
        </div>

        {/* — Breadcrumb + botón crear — */}
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-wrap">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.id} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 text-sm">/</span>}
                <button
                  onClick={() => handleBreadcrumb(i)}
                  className={`text-sm px-2 py-1 rounded-lg transition-colors ${
                    i === breadcrumb.length - 1
                      ? "text-gray-800 font-semibold bg-gray-100 cursor-default"
                      : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={i === breadcrumb.length - 1}
                >
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>

          {/* Botón crear carpeta */}
          <button
            onClick={() => {
              setShowCreate(true);
              setNewName("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#003366] hover:bg-[#004488] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <FolderPlus size={16} />
            Nueva carpeta
          </button>
        </div>

        {/* — Input crear carpeta — */}
        {showCreate && (
          <div className="mb-5 flex items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl max-w-md">
            <Folder size={18} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setShowCreate(false);
              }}
              placeholder="Nombre de la carpeta..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-300"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              {creating ? (
                <Loader2 size={14} className="animate-spin text-emerald-600" />
              ) : (
                <Check size={14} className="text-emerald-600" />
              )}
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* — Error — */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            <AlertCircle size={16} />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X size={14} />
            </button>
          </div>
        )}

        {/* — Loading — */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-500" />
          </div>
        )}

        {/* — Vacío — */}
        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Folder size={48} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">Esta carpeta está vacía</p>
            <p className="text-xs mt-1">
              Crea una carpeta o sube un archivo desde Registro
            </p>
          </div>
        )}

        {/* — Grid de items — */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((item) => {
              const isFolder = item.mimeType === FOLDER_MIME;
              const isConfirming = confirmId === item.id;
              const isDeleting = deletingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative bg-white rounded-2xl p-4 flex flex-col border border-white items-center gap-3 transition-all duration-200 shadow-sm
                    ${isFolder ? " hover:border-cyan-300 hover:shadow-md cursor-pointer" : "hover:border-cyan-300 hover:shadow-md"}`}
                  onClick={() =>
                    isFolder && !isConfirming && handleOpenFolder(item)
                  }
                >
                  {/* Icono */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${isFolder ? "bg-cyan-50" : "bg-gray-50"}`}
                  >
                    {isFolder ? (
                      <Folder size={24} className="text-cyan-500" />
                    ) : (
                      <FileText size={24} className="text-gray-400" />
                    )}
                  </div>

                  {/* Nombre */}
                  <p className="text-xs font-semibold text-gray-700 text-center leading-snug line-clamp-2 w-full">
                    {item.name}
                  </p>

                  {/* Acciones — aparecen al hover */}
                  <div
                    className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Abrir en Drive (solo archivos) */}
                    {!isFolder && item.webViewLink && (
                      <a
                        href={item.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-6 h-6 rounded-lg bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
                        title="Abrir en Drive"
                      >
                        <ExternalLink size={12} className="text-blue-600" />
                      </a>
                    )}

                    {/* Eliminar */}
                    {isConfirming ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isDeleting}
                          className="w-6 h-6 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                          title="Confirmar eliminación"
                        >
                          {isDeleting ? (
                            <Loader2
                              size={10}
                              className="animate-spin text-white"
                            />
                          ) : (
                            <Check size={10} className="text-white" />
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="w-6 h-6 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          title="Cancelar"
                        >
                          <X size={10} className="text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(item.id)}
                        className="w-6 h-6 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                        title={
                          isFolder
                            ? "Eliminar carpeta y todo su contenido"
                            : "Eliminar archivo"
                        }
                      >
                        <Trash2 size={12} className="text-red-500" />
                      </button>
                    )}
                  </div>

                  {/* Badge archivo */}
                  {!isFolder && (
                    <a
                      href={item.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={9} /> Abrir
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </LayoutComponent>
  );
};

export default GestionarCarpetaView;
