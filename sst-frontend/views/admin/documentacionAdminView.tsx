"use client";

import { useState, useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import EditDocumentoModal from "@/components/modals/documento/editDocumentoModal";
import CreateDocumentoModal from "@/components/modals/documento/createDocumentoModal";
import { DocumentoFormData } from "@/components/modals/documento/editDocumentoModal";
import {
  useDocumentoAdminContext,
  Documento,
} from "@/context/DocumentoAdminContext";
import {
  Search,
  FileText,
  Pencil,
  Trash2,
  PlusCircle,
} from "lucide-react";

const getTypeConfig = (tipo: string) => {
  switch (tipo) {
    case "PROCEDIMIENTO":
      return {
        icon: FileText,
        barColor: "bg-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        label: "Procedimiento",
      };
    case "INSTRUCTIVO":
      return {
        icon: FileText,
        barColor: "bg-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        label: "Instructivo",
      };
    case "MANUAL":
      return {
        icon: FileText,
        barColor: "bg-purple-500",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        label: "Manual",
      };
    default:
      return {
        icon: FileText,
        barColor: "bg-gray-500",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        label: "Documento",
      };
  }
};

const DocumentacionAdminView = () => {
  const {
    documentos,
    isLoading,
    error,
    createDocumento,
    updateDocumento,
    deleteDocumento,
  } = useDocumentoAdminContext();
  const [selectedFilter, setSelectedFilter] = useState<
    "todos" | "PROCEDIMIENTO" | "INSTRUCTIVO" | "MANUAL"
  >("todos");
  const [busqueda, setBusqueda] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [docEditando, setDocEditando] = useState<Documento | null>(null);

  const filterOptions = useMemo(() => {
    const tipos = documentos.map((d) => d.tipo);
    const procedimientos = tipos.filter((t) => t === "PROCEDIMIENTO").length;
    const instructivos = tipos.filter((t) => t === "INSTRUCTIVO").length;
    const manuales = tipos.filter((t) => t === "MANUAL").length;

    return [
      { key: "todos" as const, label: "Todos", count: documentos.length },
      {
        key: "PROCEDIMIENTO" as const,
        label: "Procedimientos",
        count: procedimientos,
      },
      {
        key: "INSTRUCTIVO" as const,
        label: "Instructivos",
        count: instructivos,
      },
      { key: "MANUAL" as const, label: "Manuales", count: manuales },
    ];
  }, [documentos]);

  const filteredDocs = useMemo(() => {
    return documentos.filter((doc) => {
      const coincideFiltro =
        selectedFilter === "todos" || doc.tipo === selectedFilter;
      const coincideBusqueda = doc.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideFiltro && coincideBusqueda;
    });
  }, [documentos, selectedFilter, busqueda]);

  const handleEditarClick = (doc: Documento) => {
    setDocEditando(doc);
    setEditModalOpen(true);
  };

  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await deleteDocumento(id);
    } catch (err: any) {
      alert(err.message || "Error al eliminar documento");
    }
  };

  const handleSaveEdit = async (data: DocumentoFormData) => {
    if (!docEditando) return;

    try {
      await updateDocumento(docEditando.id, data);
      setEditModalOpen(false);
      setDocEditando(null);
    } catch (err: any) {
      alert(err.message || "Error al actualizar documento");
    }
  };

  const handleCreate = async (data: DocumentoFormData) => {
    try {
      await createDocumento(data);
      setCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Error al crear documento");
    }
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Documentación en Seguridad
            </h1>
            <p className="text-gray-600">
              Gestión de recursos, guías y protocolos de SST
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-md hover:shadow-lg"
          >
            <PlusCircle size={18} />
            Crear Documento
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca por nombre de documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500 text-lg font-medium">
              Cargando documentos...
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500 text-lg font-medium">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        {!isLoading && !error && (
          <>
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedFilter(option.key)}
                  className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedFilter === option.key
                      ? "bg-cyan-500 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {option.label}{" "}
                  <span className="ml-2 text-sm">{option.count}</span>
                </button>
              ))}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDocs.map((doc) => {
                const config = getTypeConfig(doc.tipo);
                const IconComponent = config.icon;
                return (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col"
                  >
                    {/* Barra de color */}
                    <div className={`h-2 ${config.barColor}`} />

                    {/* Contenido */}
                    <div className="p-6 flex flex-col items-center justify-center gap-4 flex-1 min-h-[180px]">
                      <div
                        className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}
                      >
                        <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                          {doc.nombre}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Botones editar / eliminar */}
                    <div className="flex border-t border-gray-100">
                      <button
                        onClick={() => handleEditarClick(doc)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#003366] hover:bg-blue-50 transition"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <div className="w-px bg-gray-100" />
                      <button
                        onClick={() => handleEliminar(doc.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredDocs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No se encontraron documentos
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Intenta con otros términos o cambia el filtro
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <EditDocumentoModal
        open={editModalOpen}
        documento={
          docEditando
            ? {
                nombre: docEditando.nombre,
                tipo: docEditando.tipo.toLowerCase() as
                  | "procedimiento"
                  | "instructivo"
                  | "manual",
                enlace: docEditando.enlace,
              }
            : null
        }
        onClose={() => {
          setEditModalOpen(false);
          setDocEditando(null);
        }}
        onSave={handleSaveEdit}
      />
      <CreateDocumentoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </LayoutComponent>
  );
};

export default DocumentacionAdminView;
