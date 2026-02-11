import React from "react";
import { Bell, X } from "lucide-react";

type Severity = "info" | "warning" | "danger" | "success";

const severityMap: Record<
  Severity,
  { bg: string; iconBg: string; text: string }
> = {
  info: { bg: "bg-[#E6F7FB]", iconBg: "bg-[#CFF6FF]", text: "text-[#00738a]" },
  warning: { bg: "bg-yellow-50", iconBg: "bg-yellow-100", text: "text-yellow-700" },
  danger: { bg: "bg-red-50", iconBg: "bg-red-100", text: "text-red-700" },
  success: { bg: "bg-green-50", iconBg: "bg-green-100", text: "text-green-700" },
};

export default function AlertCard({
  id,
  title,
  message,
  severity = "info",
  time,
  isNew = false,
  onDelete,
  onMarkRead,
  read = false,
}: {
  id?: string | number;
  title: string;
  message?: string;
  severity?: Severity;
  time?: string;
  isNew?: boolean;
  read?: boolean;
  onDelete?: (id?: string | number) => void;
  onMarkRead?: (id?: string | number) => void;
}) {
  const cls = severityMap[severity];

  return (
    <div className={`relative rounded-xl p-4 shadow-sm ${cls.bg} ${read ? "opacity-80" : ""}`}>
      <button
        aria-label="Eliminar alerta"
        onClick={() => onDelete && onDelete(id)}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cls.iconBg} ${cls.text}` }>
          <Bell size={18} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className={`font-semibold ${cls.text}`}>{title}</h4>
              {message && <p className="text-sm text-slate-700 mt-1">{message}</p>}
            </div>

            <div className="flex flex-col items-end gap-2">
              {isNew && <span className="bg-white text-sm text-[#003366] px-3 py-1 rounded-full shadow-sm">Nuevo</span>}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onMarkRead && onMarkRead(id)}
                  className="bg-white text-sm text-slate-700 px-3 py-1 rounded-full shadow-sm hover:opacity-95"
                >
                  Marcar como leída
                </button>
              </div>
            </div>
          </div>

          {time && <div className="text-xs text-gray-500 mt-3">{time}</div>}
        </div>
      </div>
    </div>
  );
}
