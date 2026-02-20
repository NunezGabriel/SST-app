"use client";

import { useEffect, useState } from "react";
import { X, Link, Save } from "lucide-react";

export interface CharlaFormData {
  nombre: string;
  enlace: string;
}

interface EditCharlaModalProps {
  open: boolean;
  charla: CharlaFormData | null;
  onClose: () => void;
  onSave: (data: CharlaFormData) => void;
}

const EditCharlaModal: React.FC<EditCharlaModalProps> = ({
  open,
  charla,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<CharlaFormData>({
    nombre: "",
    enlace: "",
  });

  useEffect(() => {
    if (charla) setForm(charla);
  }, [charla]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* ── Modal ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Editar Charla</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Modifica los datos de la charla
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Ej: Uso Correcto de EPP en Altura"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300"
              />
            </div>

            {/* Enlace */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Enlace de Drive <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Link
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="url"
                  name="enlace"
                  value={form.enlace}
                  onChange={handleChange}
                  required
                  placeholder="https://drive.google.com/..."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition flex items-center justify-center gap-2"
              >
                <Save size={15} />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCharlaModal;
