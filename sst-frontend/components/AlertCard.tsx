import React from "react";
import { Bell, Edit3, Trash2 } from "lucide-react";

type Severity = "info" | "warning" | "danger" | "success";

type Props = {
  id: number;
  title: string;
  message?: string;
  severity: Severity;
  time?: string;
  isNew?: boolean;
  read?: boolean;
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
  onEdit: (id: number) => void;
};

const severityMap: Record<
  Severity,
  { bar: string; iconBg: string; iconColor: string }
> = {
  info: {
    bar: "bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  warning: {
    bar: "bg-yellow-500",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  danger: {
    bar: "bg-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  success: {
    bar: "bg-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
};

export default function AlertCard({
  id,
  title,
  message,
  severity,
  time,
  isNew,
  read,
  onDelete,
  onMarkRead,
  onEdit,
}: Props) {
  const cls = severityMap[severity];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-cyan-300 transition-all duration-200 group">
      {/* Barra de color superior */}
      <div className={`h-2 ${cls.bar}`} />

      <div className="p-5 flex items-start gap-4">
        {/* Icono */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${cls.iconBg} ${cls.iconColor} group-hover:scale-110 transition-transform`}
        >
          <Bell size={20} />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">{title}</h4>
            {isNew && !read && (
              <span className="text-xs bg-[#00BFFF] text-white px-2 py-0.5 rounded-full font-medium">
                Nueva
              </span>
            )}
          </div>
          {message && <p className="text-sm text-slate-700 mt-1">{message}</p>}
          {time && <div className="text-xs text-gray-400 mt-2">{time}</div>}
        </div>

        {/* Botones */}
        <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
          {isNew && !read && (
            <button
              onClick={() => onMarkRead(id)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-gray-500 font-medium shadow border border-gray-200 hover:bg-gray-50 transition text-xs"
            >
              Marcar leída
            </button>
          )}
          <button
            onClick={() => onEdit(id)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#E0F7FA] text-[#003366] font-semibold shadow border border-cyan-100 hover:bg-[#00BFFF] hover:text-white transition text-xs"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            <Edit3 className="w-4 h-4" /> Editar
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white text-red-600 font-semibold shadow border border-red-200 hover:bg-red-50 transition text-xs"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            <Trash2 className="w-4 h-4" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}