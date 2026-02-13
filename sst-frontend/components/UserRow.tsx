"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function UserRow({ user, onEdit, onDelete }: { user: any; onEdit: (u: any) => void; onDelete: (id: number) => void }) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
    : user.email?.[0]?.toUpperCase();

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-[#003366] font-bold">{initials}</div>
        <div>
          <div className="font-semibold text-slate-800">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email} • {user.dept || "Producción"} • <span className="text-green-600">{user.compliance || "100%"} cumplimiento</span></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => onEdit(user)} className="px-3 py-2 rounded-md border border-gray-200 text-sm hover:bg-gray-50 flex items-center gap-2">
          <Edit2 size={16} />
          <span>Editar</span>
        </button>
        <button onClick={() => onDelete(user.id)} className="px-3 py-2 rounded-md border border-red-200 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
          <Trash2 size={16} />
          <span>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
