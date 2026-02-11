import { HardHat, AlertTriangle, FileText, Shield } from "lucide-react";

interface SSTCharlaCardProps {
  type: "epp" | "riesgo" | "obligaciones" | "protocolos";
  title: string;
  description: string;
  views: number;
  updatedTime: string;
  onReadMore?: () => void;
}

const SSTCharlaCard: React.FC<SSTCharlaCardProps> = ({
  type,
  title,
  description,
  views,
  updatedTime,
  onReadMore,
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case "epp":
        return {
          icon: <HardHat className="w-12 h-12" />,
          bgColor: "bg-blue-500",
          borderColor: "border-t-blue-500",
        };
      case "riesgo":
        return {
          icon: <AlertTriangle className="w-12 h-12" />,
          bgColor: "bg-yellow-500",
          borderColor: "border-t-yellow-500",
        };
      case "obligaciones":
        return {
          icon: <FileText className="w-12 h-12" />,
          bgColor: "bg-green-500",
          borderColor: "border-t-green-500",
        };
      case "protocolos":
        return {
          icon: <Shield className="w-12 h-12" />,
          bgColor: "bg-purple-500",
          borderColor: "border-t-purple-500",
        };
      default:
        return {
          icon: <HardHat className="w-12 h-12" />,
          bgColor: "bg-blue-500",
          borderColor: "border-t-blue-500",
        };
    }
  };

  const { icon, bgColor, borderColor } = getIconAndColor();

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${borderColor} transition-shadow hover:shadow-lg`}
    >
      {/* Top colored bar */}
      <div className={`h-1 ${bgColor}`}></div>

      {/* Content */}
      <div className="p-6">
        {/* Icon and views */}
        <div className="flex justify-between items-start mb-4">
          <div className={`${bgColor} text-white rounded-lg p-3`}>{icon}</div>
          <span className="text-sm text-gray-500">{views} vistas</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>

        {/* Updated time and link */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{updatedTime}</span>
          <button
            onClick={onReadMore}
            className="text-cyan-500 hover:text-cyan-600 text-sm font-medium flex items-center gap-1 transition-colors"
          >
            Leer más <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SSTCharlaCard;
