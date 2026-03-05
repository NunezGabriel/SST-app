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
  Filter,
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
    case "MAPA_DE_RIESGOS":
      return {
        icon: FileText,
        barColor: "bg-red-500",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        label: "Mapa de Riesgos",
      };
    case "MATRIZ_AMBIENTAL":
      return {
        icon: FileText,
        barColor: "bg-emerald-500",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        label: "Matriz Ambiental",
      };
    case "MATRIZ_DE_EPPS":
      return {
        icon: FileText,
        barColor: "bg-orange-500",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        label: "Matriz de EPPs",
      };
    case "MATRIZ_IPERC":
      return {
        icon: FileText,
        barColor: "bg-yellow-500",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
        label: "Matriz IPERC",
      };
    case "PLAN_DE_CONTINGENCIA":
      return {
        icon: FileText,
        barColor: "bg-rose-500",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        label: "Plan de Contingencia",
      };
    case "PLANES_QHSE":
      return {
        icon: FileText,
        barColor: "bg-teal-500",
        iconBg: "bg-teal-100",
        iconColor: "text-teal-600",
        label: "Planes QHSE",
      };
    case "POLITICA":
      return {
        icon: FileText,
        barColor: "bg-indigo-500",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        label: "Política",
      };
    case "PROGRAMAS":
      return {
        icon: FileText,
        barColor: "bg-cyan-500",
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
        label: "Programas",
      };
    case "RISST":
      return {
        icon: FileText,
        barColor: "bg-slate-500",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        label: "RISST",
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
    | "todos"
    | "PROCEDIMIENTO"
    | "INSTRUCTIVO"
    | "MANUAL"
    | "MAPA_DE_RIESGOS"
    | "MATRIZ_AMBIENTAL"
    | "MATRIZ_DE_EPPS"
    | "MATRIZ_IPERC"
    | "PLAN_DE_CONTINGENCIA"
    | "PLANES_QHSE"
    | "POLITICA"
    | "PROGRAMAS"
    | "RISST"
  >("todos");
  const [busqueda, setBusqueda] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [docEditando, setDocEditando] = useState<Documento | null>(null);

  const tipoLabels: Record<string, string> = {
    PROCEDIMIENTO: "Procedimientos",
    INSTRUCTIVO: "Instructivos",
    MANUAL: "Manuales",
    MAPA_DE_RIESGOS: "Mapa de Riesgos",
    MATRIZ_AMBIENTAL: "Matriz Ambiental",
    MATRIZ_DE_EPPS: "Matriz de EPPs",
    MATRIZ_IPERC: "Matriz IPERC",
    PLAN_DE_CONTINGENCIA: "Plan de Contingencia",
    PLANES_QHSE: "Planes QHSE",
    POLITICA: "Política",
    PROGRAMAS: "Programas",
    RISST: "RISST",
  };

  const filterOptions = useMemo(() => {
    const tipos = documentos.map((d) => d.tipo);
    const tiposUnicos = Array.from(new Set(tipos));
    
    const options: Array<{
      key: typeof selectedFilter;
      label: string;
    }> = [
      {
        key: "todos",
        label: "Todos",
      },
    ];

    // Agregar todos los tipos disponibles
    tiposUnicos.forEach((tipo) => {
      if (tipoLabels[tipo]) {
        options.push({
          key: tipo as typeof selectedFilter,
          label: tipoLabels[tipo],
        });
      }
    });

    return options;
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
              Documentación HSE
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

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca por nombre de documento..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por tipo */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) =>
                  setSelectedFilter(
                    e.target.value as typeof selectedFilter
                  )
                }
                className="pl-12 pr-10 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer min-w-[200px]"
              >
                {filterOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
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

        {/* Cards Grid */}
        {!isLoading && !error && (
          <>
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
                  | "manual"
                  | "mapa_de_riesgos"
                  | "matriz_ambiental"
                  | "matriz_de_epps"
                  | "matriz_iperc"
                  | "plan_de_contingencia"
                  | "planes_qhse"
                  | "politica"
                  | "programas"
                  | "risst",
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
