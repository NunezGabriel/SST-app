"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const categorias = [
  "Inspecciones",
  "Incidentes",
  "Riesgos",
  "Capacitación",
  "Equipos",
  "Permisos",
];
const colores = [
  { value: "Azul", label: "Azul", color: "#2196F3" },
  { value: "Verde", label: "Verde", color: "#4CAF50" },
  { value: "Amarillo", label: "Amarillo", color: "#FFEB3B" },
  { value: "Morado", label: "Morado", color: "#9C27B0" },
  { value: "Rojo", label: "Rojo", color: "#F44336" },
];

export interface EditFormatoData {
  id?: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  colorIcono: string;
  archivo: string;
}

export default function EditFormatoModal({ open, onClose, formato, onSave, isNew }: {
  open: boolean;
  onClose: () => void;
  formato: EditFormatoData | null;
  onSave: (data: EditFormatoData) => void;
  isNew?: boolean;
}) {
  const [form, setForm] = useState<EditFormatoData | null>(formato);

  useEffect(() => {
    setForm(formato);
  }, [formato]);

  if (!open || !form) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter:'blur(6px)', background:'rgba(255,255,255,0.7)'}}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative font-inter">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[#00BFFF] transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-[#003366] mb-1">{isNew ? 'Crear nuevo formato' : 'Editar Formato'}</h2>
        <p className="text-gray-600 mb-6">{isNew ? 'Crea un nuevo formato o plantilla' : 'Modifica los detalles del formato o plantilla'}</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Título del Formato</label>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
            value={form.nombre}
            onChange={e => setForm(f => f && { ...f, nombre: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Categoría</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none bg-white"
            value={form.categoria}
            onChange={e => setForm(f => f && { ...f, categoria: e.target.value })}
          >
            {categorias.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Descripción</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
            rows={3}
            value={form.descripcion}
            onChange={e => setForm(f => f && { ...f, descripcion: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Color del ícono</label>
          <select
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none bg-white"
            value={form.colorIcono}
            onChange={e => setForm(f => f && { ...f, colorIcono: e.target.value })}
          >
            {colores.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Archivo Adjunto (URL o subir)</label>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
            value={form.archivo}
            onChange={e => setForm(f => f && { ...f, archivo: e.target.value })}
            placeholder="https://... o selecciona archivo"
          />
          <div className="text-xs text-gray-400 mt-1">Formatos soportados: PDF, DOCX, XLSX</div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-5 py-2 rounded-full bg-white border border-gray-200 text-[#003366] font-semibold shadow hover:bg-[#E0F7FA] transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 rounded-full bg-[#00BFFF] text-white font-bold shadow hover:bg-[#0099cc] transition"
            onClick={() => form && onSave(form)}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
