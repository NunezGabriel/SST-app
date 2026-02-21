"use client";

import { useState, useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import EditFormatoModal, {
  FormatoFormData,
} from "@/components/modals/formato/editFormatoModal";
import CreateFormatoModal from "@/components/modals/formato/crearFormatoModal";
import {
  FileText,
  Search,
  Filter,
  FileCheck,
  FileSpreadsheet,
  FileBarChart,
  FileX,
  FileType,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useFormatoAdminContext,
  Formato,
} from "@/context/FormatoAdminContext";

const iconoPorTipo = (tipo: string | null) => {
  switch (tipo) {
    case "Inspección":
      return FileCheck;
    case "Incidentes":
      return FileX;
    case "Riesgos":
      return FileBarChart;
    case "Capacitación":
      return FileText;
    case "Equipos":
      return FileSpreadsheet;
    case "Permisos":
      return FileType;
    default:
      return FileText;
  }
};

const FormatoAdminView = () => {
  const {
    formatos,
    isLoading,
    error,
    createFormato,
    updateFormato,
    deleteFormato,
  } = useFormatoAdminContext();
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formatoEditando, setFormatoEditando] = useState<Formato | null>(null);

  const categorias = useMemo(() => {
    const tipos = formatos
      .map((f) => f.tipo)
      .filter((t): t is string => t !== null && t !== undefined);
    return ["Todos", ...Array.from(new Set(tipos))];
  }, [formatos]);

  const formatosFiltrados = useMemo(() => {
    return formatos.filter((f) => {
      const coincideBusqueda = f.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const coincideCategoria =
        categoriaFiltro === "Todos" ||
        f.tipo === categoriaFiltro ||
        (!f.tipo && categoriaFiltro === "Todos");
      return coincideBusqueda && coincideCategoria;
    });
  }, [formatos, busqueda, categoriaFiltro]);

  const handleEditarClick = (formato: Formato) => {
    setFormatoEditando(formato);
    setEditModalOpen(true);
  };

  const handleEliminar = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este formato? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      await deleteFormato(id);
    } catch (err: any) {
      alert(err.message || "Error al eliminar formato");
    }
  };

  const handleSaveEdit = async (data: FormatoFormData) => {
    if (!formatoEditando) return;

    try {
      await updateFormato(formatoEditando.id, data);
      setEditModalOpen(false);
      setFormatoEditando(null);
    } catch (err: any) {
      alert(err.message || "Error al actualizar formato");
    }
  };

  const handleCreate = async (data: FormatoFormData) => {
    try {
      await createFormato(data);
      setCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Error al crear formato");
    }
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto py-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#022B54] mb-1">
                Formatos y Plantillas
              </h1>
              <p className="text-gray-600">
                Gestión de formatos y plantillas del sistema
              </p>
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PlusCircle size={18} />
              Crear Formato
            </button>
          </div>

          {/* Buscador y Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar formato..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="pl-12 pr-10 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-500 text-lg font-medium">
                Cargando formatos...
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

          {/* Grid de Formatos */}
          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formatosFiltrados.map((formato) => {
                  const IconComponent = iconoPorTipo(formato.tipo);
                  return (
                    <div
                      key={formato.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col"
                    >
                      {/* Contenido */}
                      <div className="p-6 flex flex-col items-center justify-center gap-4 flex-1 min-h-[160px]">
                        <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-cyan-600" />
                        </div>
                        <div className="text-center">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                            {formato.nombre}
                          </h3>
                          {formato.tipo && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                              {formato.tipo}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Botones editar / eliminar */}
                      <div className="flex border-t border-gray-100">
                        <button
                          onClick={() => handleEditarClick(formato)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#003366] hover:bg-blue-50 transition"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleEliminar(formato.id)}
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
              {formatosFiltrados.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-medium">
                    No se encontraron formatos
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Intenta con otros términos de búsqueda o cambia el filtro
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <EditFormatoModal
        open={editModalOpen}
        formato={
          formatoEditando
            ? {
                nombre: formatoEditando.nombre,
                tipo: formatoEditando.tipo || "Inspección",
                enlace: formatoEditando.enlace,
              }
            : null
        }
        onClose={() => {
          setEditModalOpen(false);
          setFormatoEditando(null);
        }}
        onSave={handleSaveEdit}
      />
      <CreateFormatoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </LayoutComponent>
  );
};

export default FormatoAdminView;
