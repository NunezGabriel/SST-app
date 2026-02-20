"use client";

import React from "react";
import { Bell, Trophy, Clock } from "lucide-react";

export type NotificationType = "pendiente" | "logro" | "nuevo";

interface AlertCardProps {
  id?: string | number;
  title: string;
  message?: string;
  type?: NotificationType;
  time?: string;
  isNew?: boolean;
  read?: boolean;
  onDelete?: (id?: string | number) => void;
  onMarkRead?: (id?: string | number) => void;
}

const typeStyle = {
  pendiente: {
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-700",
    label: "Pendiente",
  },

  nuevo: {
    iconBg: "bg-cyan-100",
    iconColor: "text-[#0066a3]",
    label: "Nuevo",
  },

  logro: {
    iconBg: "bg-green-100",
    iconColor: "text-green-700",
    label: "Logro",
  },
};

export default function AlertCard({
  id,
  title,
  message,
  type = "nuevo",
  time,
  isNew = false,
  read = false,
  onDelete,
  onMarkRead,
}: AlertCardProps) {
  const style = typeStyle[type];

  const Icon = type === "logro" ? Trophy : type === "pendiente" ? Clock : Bell;

  return (
    <div
      className={`
      relative bg-white rounded-2xl p-5
      shadow-sm border border-slate-100
      hover:shadow-md transition-all
      ${read ? "opacity-70" : ""}
      `}
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div
          className={`
          w-12 h-12 rounded-xl
          flex items-center justify-center
          ${style.iconBg}
          `}
        >
          <Icon className={style.iconColor} size={20} />
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="flex justify-between items-start gap-4">
            <div>
              {/* TITLE */}
              <h4 className="font-semibold text-[#022B54] text-lg">{title}</h4>

              {message && (
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              )}
            </div>

            {/* STATUS */}
            <div className="flex flex-col items-end gap-2">
              {/* Estado elegante */}
              <span
                className="
                text-xs font-medium
                px-3 py-1 rounded-full
                bg-slate-100 text-slate-600
              "
              >
                {style.label}
              </span>

              {!read && onMarkRead && (
                <button
                  onClick={() => onMarkRead(id)}
                  className="
                  text-xs font-medium
                  text-[#003366]
                  hover:underline
                "
                >
                  Marcar leída
                </button>
              )}
            </div>
          </div>

          {time && (
            <div className="text-xs text-gray-400 mt-3 flex items-center gap-1">
              <Clock size={13} />

              {time}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
