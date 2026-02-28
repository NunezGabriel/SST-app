import {
  X,
  CreditCard,
  HeartPulse,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

interface ArchivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel?: string;
}

const uploadOptions = [
  {
    label: "Subir Licencia de Conducir / SOAT / Bitácora",
    icon: CreditCard,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    hover: "hover:bg-indigo-100",
  },
  {
    label: "Subir Control de Salud",
    icon: HeartPulse,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    hover: "hover:bg-emerald-100",
  },
  {
    label: "Subir Capacitaciones",
    icon: GraduationCap,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
    border: "border-amber-200",
    bg: "bg-amber-50",
    hover: "hover:bg-amber-100",
  },
  {
    label: "Subir ATS",
    icon: ClipboardList,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    border: "border-red-200",
    bg: "bg-red-50",
    hover: "hover:bg-red-100",
  },
];

const ArchivoModal = ({ isOpen, onClose, weekLabel }: ArchivoModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-5 bg-[#003366]">
          <div>
            <h2 className="text-lg font-bold text-white">Subir Archivos</h2>
            {weekLabel && (
              <p className="text-xs text-indigo-300 mt-1">{weekLabel}</p>
            )}
          </div>
          <button
            className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-5">
            Selecciona el tipo de documento que deseas subir:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {uploadOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <button
                  key={i}
                  className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border ${opt.border} ${opt.bg} ${opt.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${opt.iconBg} flex items-center justify-center`}
                  >
                    <Icon size={24} className={opt.iconColor} />
                  </div>
                  <span
                    className={`text-xs font-semibold text-center leading-tight ${opt.iconColor}`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivoModal;
