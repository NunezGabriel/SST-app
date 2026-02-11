"use client";

import { X, HardHat, AlertTriangle, FileText, Shield } from "lucide-react";

interface Charla {
  id: string;
  type: "epp" | "riesgo" | "obligaciones" | "protocolos";
  title: string;
  description: string;
  views: number;
  updatedTime: string;
  content?: string;
}

interface InfoCharlaModalProps {
  isOpen: boolean;
  charla: Charla | null;
  onClose: () => void;
}

const InfoCharlaModal: React.FC<InfoCharlaModalProps> = ({
  isOpen,
  charla,
  onClose,
}) => {
  if (!isOpen || !charla) return null;

  const getIconAndColor = () => {
    switch (charla.type) {
      case "epp":
        return {
          icon: <HardHat className="w-8 h-8" />,
          bgColor: "bg-blue-500",
          textColor: "text-blue-500",
          lightBg: "bg-blue-50",
        };
      case "riesgo":
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          bgColor: "bg-yellow-500",
          textColor: "text-yellow-500",
          lightBg: "bg-yellow-50",
        };
      case "obligaciones":
        return {
          icon: <FileText className="w-8 h-8" />,
          bgColor: "bg-green-500",
          textColor: "text-green-500",
          lightBg: "bg-green-50",
        };
      case "protocolos":
        return {
          icon: <Shield className="w-8 h-8" />,
          bgColor: "bg-purple-500",
          textColor: "text-purple-500",
          lightBg: "bg-purple-50",
        };
      default:
        return {
          icon: <HardHat className="w-8 h-8" />,
          bgColor: "bg-blue-500",
          textColor: "text-blue-500",
          lightBg: "bg-blue-50",
        };
    }
  };

  const { icon, bgColor, textColor, lightBg } = getIconAndColor();

  const getTypeLabel = () => {
    switch (charla.type) {
      case "epp":
        return "Equipo de Protección Personal";
      case "riesgo":
        return "Identificación de Riesgos";
      case "obligaciones":
        return "Obligaciones Legales";
      case "protocolos":
        return "Protocolo de Seguridad";
      default:
        return "Información de Seguridad";
    }
  };

  const detailedContent =
    charla.content ||
    `
    Este es el contenido detallado de: ${charla.title}
    
    La información completa sobre este tema está siendo desarrollada. Aquí se incluirán:
    - Procedimientos paso a paso
    - Recomendaciones prácticas
    - Normas y regulaciones aplicables
    - Ejemplos y casos de estudio
    - Recursos adicionales
  `;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className={`${bgColor} text-white p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-opacity-20 rounded-lg p-3">{icon}</div>
                <div>
                  <p className={`text-sm font-medium opacity-90`}>
                    {getTypeLabel()}
                  </p>
                  <h2 className="text-2xl font-bold">{charla.title}</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className={`${lightBg} rounded-lg p-4 text-center`}>
                <p className="text-2xl font-bold text-gray-900">
                  {charla.views}
                </p>
                <p className={`text-sm ${textColor} font-medium`}>Vistas</p>
              </div>
              <div className={`${lightBg} rounded-lg p-4 text-center`}>
                <p className="text-lg font-semibold text-gray-900">
                  {charla.type.charAt(0).toUpperCase() + charla.type.slice(1)}
                </p>
                <p className={`text-sm ${textColor} font-medium`}>Categoría</p>
              </div>
              <div className={`${lightBg} rounded-lg p-4 text-center`}>
                <p className="text-sm font-semibold text-gray-900">
                  {charla.updatedTime.split(" ").pop()}
                </p>
                <p className={`text-sm ${textColor} font-medium`}>
                  Actualizado
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Descripción
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {charla.description}
              </p>
            </div>

            {/* Detailed Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Información Detallada
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {detailedContent}
              </div>
            </div>

            {/* Update info */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">
                  Última actualización:
                </span>{" "}
                {charla.updatedTime}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              className={`px-6 py-2 ${bgColor} text-white font-medium rounded-lg hover:opacity-90 transition-opacity`}
            >
              Descargar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCharlaModal;
