"use client";

import { useState, useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { Search, FileText, Eye, EyeOff } from "lucide-react";
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
    "todos" | "PROCEDIMIENTO" | "INSTRUCTIVO" | "MANUAL"
  >("todos");
  const [busqueda, setBusqueda] = useState("");

  const filterOptions = useMemo(() => {
    const tipos = documentosUsuario.map((d) => d.tipo);
    const procedimientos = tipos.filter((t) => t === "PROCEDIMIENTO").length;
    const instructivos = tipos.filter((t) => t === "INSTRUCTIVO").length;
    const manuales = tipos.filter((t) => t === "MANUAL").length;

    return [
      {
        key: "todos" as const,
        label: "Todos",
        count: documentosUsuario.length,
      },
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
            Documentación en Seguridad
          </h1>
          <p className="text-gray-600">
            Accede a recursos, guías y protocolos de SST
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca riesgos laborales, equipos de protección, protocolos..."
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
