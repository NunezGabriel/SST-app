"use client";

import { useState, useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { Search, FileText, Eye, EyeOff, Filter } from "lucide-react";
import {
  useDocumentoAdminContext,
  DocumentoUsuario,
} from "@/context/DocumentoAdminContext";

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

const DocumentacionView = () => {
  const { documentosUsuario, isLoading, error, marcarVisto } =
    useDocumentoAdminContext();
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
    const tipos = documentosUsuario.map((d) => d.tipo);
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
  }, [documentosUsuario]);

  const filteredDocs = useMemo(() => {
    return documentosUsuario.filter((doc) => {
      const coincideFiltro =
        selectedFilter === "todos" || doc.tipo === selectedFilter;
      const coincideBusqueda = doc.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideFiltro && coincideBusqueda;
    });
  }, [documentosUsuario, selectedFilter, busqueda]);

  const handleClickDoc = async (doc: DocumentoUsuario) => {
    // Abrir el enlace
    if (doc.enlace) {
      window.open(doc.enlace, "_blank");
    }

    // Marcar como visto si no está visto
    if (doc.estado === "SIN_VER") {
      try {
        await marcarVisto(doc.id);
      } catch (err: any) {
        console.error("Error al marcar documento como visto:", err);
        // No mostramos error al usuario, solo lo registramos
      }
    }
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Documentación HSE
          </h1>
          <p className="text-gray-600">
            Accede a recursos, guías y protocolos de SST
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca riesgos laborales, equipos de protección, protocolos..."
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
                const visto = doc.estado === "VISTO";
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleClickDoc(doc)}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col group text-left relative"
                  >
                    {/* Barra de color superior */}
                    <div className={`h-2 ${config.barColor}`} />

                    {/* Ojo - estado de visto */}
                    <div
                      className={`absolute top-4 right-4 ${visto ? "text-emerald-500" : "text-gray-300"}`}
                    >
                      {visto ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>

                    {/* Contenido */}
                    <div className="p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]">
                      <div
                        className={`w-16 h-16 rounded-full ${config.iconBg} group-hover:scale-110 flex items-center justify-center transition-transform`}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${config.iconColor}`}
                        />
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
                  </button>
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
                  Intenta con otros términos de búsqueda o cambia el filtro
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutComponent>
  );
};

export default DocumentacionView;
