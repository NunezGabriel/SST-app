"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { FileText, Search, Filter, FileCheck, FileSpreadsheet, FileBarChart, FileX, FileImage, FileType, FileCode } from "lucide-react";

interface Formato {
  id: number;
  nombre: string;
  categoria: string;
  icono: any;
}

const formatosMock: Formato[] = [
  {
    id: 1,
    nombre: "Formato de Inspección",
    categoria: "Inspección",
    icono: FileCheck,
  },
  {
    id: 2,
    nombre: "Formato de Reporte de Incidente",
    categoria: "Incidentes",
    icono: FileX,
  },
  {
    id: 3,
    nombre: "Formato de Evaluación de Riesgos",
    categoria: "Riesgos",
    icono: FileBarChart,
  },
  {
    id: 4,
    nombre: "Formato de Capacitación",
    categoria: "Capacitación",
    icono: FileText,
  },
  {
    id: 5,
    nombre: "Formato de Checklist",
    categoria: "Inspección",
    icono: FileCheck,
  },
  {
    id: 6,
    nombre: "Formato de Registro de EPP",
    categoria: "Equipos",
    icono: FileSpreadsheet,
  },
  {
    id: 7,
    nombre: "Formato de Permiso de Trabajo",
    categoria: "Permisos",
    icono: FileType,
  },
  {
    id: 8,
    nombre: "Formato de Inspección de Maquinaria",
    categoria: "Inspección",
    icono: FileCheck,
  },
  {
    id: 9,
    nombre: "Formato de Análisis de Seguridad",
    categoria: "Riesgos",
    icono: FileBarChart,
  },
  {
    id: 10,
    nombre: "Formato de Registro de Capacitación",
    categoria: "Capacitación",
    icono: FileText,
  },
  {
    id: 11,
    nombre: "Formato de Reporte de Accidente",
    categoria: "Incidentes",
    icono: FileX,
  },
  {
    id: 12,
    nombre: "Formato de Inspección de Área",
    categoria: "Inspección",
    icono: FileCheck,
  },
];

const categorias = ["Todos", ...Array.from(new Set(formatosMock.map(f => f.categoria)))];

const FormatosView = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const formatosFiltrados = formatosMock.filter((formato) => {
    const coincideBusqueda = formato.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === "Todos" || formato.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const handleClickFormato = (formato: Formato) => {
    window.open("https://drive.google.com", "_blank");
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto py-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[#022B54] mb-1">
              Formatos y Plantillas
            </h1>
            <p className="text-gray-600">
              Accede a los formatos y plantillas disponibles para tu trabajo
            </p>
          </div>

          {/* Buscador y Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar formato..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por categoría */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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

          {/* Grid de Formatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formatosFiltrados.map((formato) => {
              const IconComponent = formato.icono;
              return (
                <button
                  key={formato.id}
                  onClick={() => handleClickFormato(formato)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col items-center justify-center gap-4 min-h-[180px] group"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-100 group-hover:bg-cyan-200 flex items-center justify-center transition-colors">
                    <IconComponent className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="text-center font-semibold text-gray-900 text-sm leading-tight">
                    {formato.nombre}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Mensaje si no hay resultados */}
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
        </div>
      </div>
    </LayoutComponent>
  );
};

export default FormatosView;
