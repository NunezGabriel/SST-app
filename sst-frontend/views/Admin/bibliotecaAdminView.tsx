"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import InfoCharlaModal from "@/components/modals/infoCharlaModal";
import { Search, HardHat, AlertTriangle, FileText, Shield } from "lucide-react";

interface Charla {
  id: string;
  type: "epp" | "riesgo" | "obligaciones" | "protocolos";
  title: string;
  description: string;
  views: number;
  updatedTime: string;
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case "epp":
      return {
        icon: HardHat,
        barColor: "bg-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      };
    case "riesgo":
      return {
        icon: AlertTriangle,
        barColor: "bg-yellow-500",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      };
    case "obligaciones":
      return {
        icon: FileText,
        barColor: "bg-green-500",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      };
    case "protocolos":
      return {
        icon: Shield,
        barColor: "bg-purple-500",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      };
    default:
      return {
        icon: HardHat,
        barColor: "bg-blue-500",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      };
  }
};

const BibliotecaView = () => {
  const [selectedFilter, setSelectedFilter] = useState<
    "todos" | "epp" | "riesgo" | "obligaciones" | "protocolos"
  >("todos");
  const [selectedCharla, setSelectedCharla] = useState<Charla | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Datos hardcodeados
  const allCharlas: Charla[] = [
    {
      id: "1",
      type: "epp",
      title: "Uso Correcto de Casco de Seguridad",
      description:
        "Guía completa sobre el uso, mantenimiento y vida útil del casco de seguridad en el trabajo.",
      views: 245,
      updatedTime: "Actualizado hace 2 días",
    },
    {
      id: "2",
      type: "riesgo",
      title: "Identificación de Riesgos Eléctricos",
      description:
        "Protocolo para identificar y mitigar riesgos eléctricos en el lugar de trabajo.",
      views: 189,
      updatedTime: "Actualizado hace 5 días",
    },
    {
      id: "3",
      type: "obligaciones",
      title: "Obligaciones Legales en SST",
      description:
        "Resumen de las obligaciones legales del empleador y empleado en materia de seguridad.",
      views: 567,
      updatedTime: "Actualizado hace 1 semana",
    },
    {
      id: "4",
      type: "protocolos",
      title: "Protocolo de Trabajo en Altura",
      description:
        "Procedimientos seguros para trabajo en altura, incluyendo arnés y línea de vida.",
      views: 412,
      updatedTime: "Actualizado hace 3 días",
    },
    {
      id: "5",
      type: "riesgo",
      title: "Protección Respiratoria",
      description:
        "Tipos de mascarillas y respiradores, cuándo usarlos y cómo mantenerlos.",
      views: 298,
      updatedTime: "Actualizado hace 4 días",
    },
    {
      id: "6",
      type: "obligaciones",
      title: "Manejo de Sustancias Químicas",
      description:
        "Guía para el manejo seguro de productos químicos peligrosos.",
      views: 334,
      updatedTime: "Actualizado hace 1 semana",
    },
  ];

  const filterOptions = [
    { key: "todos" as const, label: "Todos", count: 120, icon: "📚" },
    { key: "epp" as const, label: "EPP", count: 35, icon: "🎓" },
    { key: "riesgo" as const, label: "Riesgos", count: 42, icon: "⚠️" },
    {
      key: "obligaciones" as const,
      label: "Obligaciones",
      count: 28,
      icon: "📋",
    },
    { key: "protocolos" as const, label: "Protocolos", count: 15, icon: "🛡️" },
  ];

  const filteredCharlas = allCharlas.filter((charla) => {
    const coincideFiltro = selectedFilter === "todos" || charla.type === selectedFilter;
    const coincideBusqueda = charla.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      charla.description.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  const handleOpenModal = (charla: Charla) => {
    setSelectedCharla(charla);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCharla(null);
  };

  return (
    <>
      <LayoutComponent>
        <div className="min-h-screen p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Documentacion en Seguridad
            </h1>
            <p className="text-gray-600">
              Accede a recursos, guías y protocolos de SST
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Busca riesgos laborales, equipos de protección, protocolos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Tabs */}
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
            {filteredCharlas.map((charla) => {
              const config = getTypeConfig(charla.type);
              const IconComponent = config.icon;
              return (
                <button
                  key={charla.id}
                  onClick={() => handleOpenModal(charla)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200 flex flex-col group"
                >
                  {/* Barra de color superior */}
                  <div className={`h-2 ${config.barColor}`}></div>
                  
                  {/* Contenido */}
                  <div className="p-6 flex flex-col items-center justify-center gap-4 min-h-[200px]">
                    <div className={`w-16 h-16 rounded-full ${config.iconBg} group-hover:scale-110 flex items-center justify-center transition-transform`}>
                      <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                        {charla.title}
                      </h3>
                      <p className="text-xs text-gray-500">{charla.views} vistas</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredCharlas.length === 0 && (
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
        </div>
      </LayoutComponent>

      <InfoCharlaModal
        isOpen={isModalOpen}
        charla={selectedCharla}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default BibliotecaView;
