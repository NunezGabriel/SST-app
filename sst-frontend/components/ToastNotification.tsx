"use client";

import React from "react";
import { X } from "lucide-react";

export default function ToastNotification({
  title,
  message,
  onClose,
}: {
  title?: string;
  message: string;
  onClose?: () => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-100">
        <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 9v4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="pr-2">
          {title && <div className="font-semibold text-slate-800">{title}</div>}
          <div className="text-sm text-slate-700">{message}</div>
        </div>

        <button onClick={() => onClose && onClose()} className="ml-2 text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
