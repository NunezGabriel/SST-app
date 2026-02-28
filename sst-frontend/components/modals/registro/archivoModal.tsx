import {
  X,
  CreditCard,
  HeartPulse,
  ClipboardList,
  ShieldCheck,
  Truck,
  Users,
  FileSearch,
  Activity,
  FileText,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

interface ArchivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel?: string;
}

// Opciones para el Trabajador — SIN capacitaciones (es mensual, va fuera del modal)
const workerOptions = [
  { label: "Licencia / SOAT / Bitácora", icon: CreditCard, color: "indigo" },
  { label: "Control de Salud Diario", icon: HeartPulse, color: "emerald" },
  { label: "ATS - Charla 5 min", icon: ClipboardList, color: "red" },
];

// Opciones para el Administrador
const adminOptions = [
  { label: "Triaje", icon: Activity, color: "cyan" },
  { label: "Cargo de EPPs", icon: ShieldCheck, color: "blue" },
  { label: "SCTR", icon: FileSearch, color: "purple" },
  { label: "Listado de Personal", icon: Users, color: "orange" },
  { label: "Listado de Vehículos", icon: Truck, color: "slate" },
  { label: "Vigilancia COVID", icon: FileText, color: "pink" },
];

const COLOR_MAP: Record<
  string,
  { text: string; iconBg: string; border: string; bg: string; hover: string }
> = {
  indigo: {
    text: "text-indigo-600",
    iconBg: "bg-indigo-100",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    hover: "hover:bg-indigo-100",
  },
  emerald: {
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    hover: "hover:bg-emerald-100",
  },
  red: {
    text: "text-red-600",
    iconBg: "bg-red-100",
    border: "border-red-200",
    bg: "bg-red-50",
    hover: "hover:bg-red-100",
  },
  cyan: {
    text: "text-cyan-600",
    iconBg: "bg-cyan-100",
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    hover: "hover:bg-cyan-100",
  },
  blue: {
    text: "text-blue-600",
    iconBg: "bg-blue-100",
    border: "border-blue-200",
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
  },
  purple: {
    text: "text-purple-600",
    iconBg: "bg-purple-100",
    border: "border-purple-200",
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
  },
  orange: {
    text: "text-orange-600",
    iconBg: "bg-orange-100",
    border: "border-orange-200",
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
  },
  slate: {
    text: "text-slate-600",
    iconBg: "bg-slate-100",
    border: "border-slate-200",
    bg: "bg-slate-50",
    hover: "hover:bg-slate-100",
  },
  pink: {
    text: "text-pink-600",
    iconBg: "bg-pink-100",
    border: "border-pink-200",
    bg: "bg-pink-50",
    hover: "hover:bg-pink-100",
  },
};

const ArchivoModal = ({ isOpen, onClose, weekLabel }: ArchivoModalProps) => {
  const { user } = useAuthContext();
  if (!isOpen) return null;

  const isAdmin = user?.rol === "ADMIN";
  const options = isAdmin ? adminOptions : workerOptions;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start px-6 py-5 bg-[#003366]">
          <div>
            <h2 className="text-lg font-bold text-white">
              Panel de Carga {isAdmin ? "(Admin)" : "(Worker)"}
            </h2>
            {weekLabel && (
              <p className="text-xs text-white/70 mt-1">{weekLabel}</p>
            )}
          </div>
          <button
            className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-5">
            Selecciona el tipo de documento a subir:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => {
              const Icon = opt.icon;
              const c = COLOR_MAP[opt.color];
              return (
                <button
                  key={i}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}
                  >
                    <Icon size={20} className={c.text} />
                  </div>
                  <span
                    className={`text-[11px] font-bold text-center leading-tight ${c.text}`}
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
