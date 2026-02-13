"use client";

import React, { useState, useEffect } from "react";

export default function CreateUserModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: { id?: number; name: string; email: string; role: string }) => void;
  initial?: { id?: number; name?: string; email?: string; role?: string };
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Trabajador");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setEmail(initial.email || "");
      setRole(initial.role || "Trabajador");
    } else {
      setName("");
      setEmail("");
      setRole("Trabajador");
    }
  }, [initial, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{initial ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Nombre</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Correo electrónico</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50" />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Rol de Usuario</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white">
              <option>Trabajador</option>
              <option>Administrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-[#E6F7FB] focus:outline-none focus:ring-2 focus:ring-cyan-200 transition"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSave({ id: initial?.id, name, email, role });
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-400 text-white hover:opacity-95"
            >
              {initial ? "Guardar" : "Crear Usuario"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
