"use client";

import React, { useEffect } from "react";
import { X, Bell, Trophy } from "lucide-react";

type Type = "nuevo" | "pendiente" | "logro";

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
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === "logro" ? Trophy : Bell;

  const bgIcon = type === "logro" ? "bg-[#4b2c82]" : "bg-[#003366]";

  return (
    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
        <div
          className={`w-10 h-10 rounded-full ${bgIcon} flex items-center justify-center text-white`}
        >
          <Icon size={18} />
        </div>

        <div>
          {title && <div className="font-semibold text-slate-900">{title}</div>}

          <div className="text-sm text-slate-600">{message}</div>
        </div>

        <button
          onClick={() => onClose?.()}
          className="ml-2 text-gray-400 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
