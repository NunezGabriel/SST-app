"use client";

import React, { useEffect } from "react";
import { X, Bell, Trophy, AlertTriangle } from "lucide-react";

type Type = "nuevo" | "pendiente" | "logro" | "NUEVO" | "PENDIENTE" | "LOGRO";

const normalize = (t: Type): "nuevo" | "pendiente" | "logro" => {
  return t.toLowerCase() as "nuevo" | "pendiente" | "logro";
};

const typeConfig = {
  logro: {
    icon: Trophy,
    bgIcon: "bg-gradient-to-br from-amber-400 to-yellow-500",
    border: "border-amber-200",
    bar: "bg-gradient-to-r from-amber-400 to-yellow-500",
  },
  nuevo: {
    icon: Bell,
    bgIcon: "bg-gradient-to-br from-[#003366] to-[#0066a3]",
    border: "border-blue-200",
    bar: "bg-gradient-to-r from-[#003366] to-[#0066a3]",
  },
  pendiente: {
    icon: AlertTriangle,
    bgIcon: "bg-gradient-to-br from-orange-400 to-red-500",
    border: "border-orange-200",
    bar: "bg-gradient-to-r from-orange-400 to-red-500",
  },
};

export default function ToastNotification({
  title,
  message,
  onClose,
  type = "nuevo",
}: {
  title?: string;
  message: string;
  onClose?: () => void;
  type?: Type;
}) {
  const key = normalize(type);
  const config = typeConfig[key];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="w-80 animate-in fade-in slide-in-from-right-4 duration-300">
      <div
        className={`relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-2xl border ${config.border} overflow-hidden`}
      >
        {/* Barra de color lateral */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />

        {/* Icono */}
        <div
          className={`w-10 h-10 rounded-xl ${config.bgIcon} flex items-center justify-center text-white shrink-0 shadow-md`}
        >
          <Icon size={18} />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-bold text-slate-800 text-sm leading-tight truncate">
              {title}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{message}</p>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => onClose?.()}
          className="text-gray-400 hover:text-gray-700 transition-colors shrink-0 mt-0.5"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
