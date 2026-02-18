"use client";
import { useState, useEffect } from "react";
import { X, Check, Youtube, Image, Edit3 } from "lucide-react";

const categorias = [
  { value: "Seguridad", label: "Seguridad" },
  { value: "Riesgos", label: "Riesgos" },
  { value: "Salud", label: "Salud" },
  { value: "Emergencias", label: "Emergencias" },
];

export interface EditCharlaData {
  id: number;
  titulo: string;
  categoria: string;
  duracionMin: number;
  markdown: string;
  videoUrl: string;
  portadaUrl: string;
  quizPregunta: string;
  quizOpciones: string[];
  quizCorrecta: number;
}

export default function EditCharlaModal({ open, onClose, charla, onSave }: {
  open: boolean;
  onClose: () => void;
  charla: EditCharlaData | null;
  onSave: (data: EditCharlaData) => void;
}) {
  const [form, setForm] = useState<EditCharlaData | null>(charla);

  // Sincroniza el form si cambia la charla
  useEffect(() => {
    setForm(charla);
  }, [charla]);

  if (!open || !form) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 " >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative font-inter">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-[#00BFFF] transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-[#003366] mb-1">Editar Charla</h2>
        <p className="text-gray-600 mb-6">Modifica los detalles de la charla de seguridad</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#003366] mb-1">Título de la Charla</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
              value={form.titulo}
              onChange={e => setForm(f => f && { ...f, titulo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003366] mb-1">Categoría</label>
            <select
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none bg-white"
              value={form.categoria}
              onChange={e => setForm(f => f && { ...f, categoria: e.target.value })}
            >
              {categorias.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#003366] mb-1">Duración (minutos)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
              value={form.duracionMin}
              onChange={e => setForm(f => f && { ...f, duracionMin: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#003366] mb-1">Contenido en Markdown</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-mono font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
            rows={4}
            value={form.markdown}
            onChange={e => setForm(f => f && { ...f, markdown: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-[#003366] mb-1">URL del Video</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
              value={form.videoUrl}
              onChange={e => setForm(f => f && { ...f, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#003366] mb-1">URL de Imagen Portada</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
              value={form.portadaUrl}
              onChange={e => setForm(f => f && { ...f, portadaUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className="bg-[#E0F7FA] rounded-xl p-4 mb-4 border border-cyan-100">
          <div className="font-semibold text-[#003366] mb-2">Quiz Interactivo</div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-[#003366] mb-1">Pregunta</label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
              value={form.quizPregunta}
              onChange={e => setForm(f => f && { ...f, quizPregunta: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-[#003366] mb-1">Opciones de Respuesta</label>
            <div className="space-y-2">
              {form.quizOpciones.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-base font-inter focus:ring-2 focus:ring-[#00BFFF] focus:border-[#00BFFF] outline-none"
                    value={opt}
                    onChange={e => setForm(f => f && { ...f, quizOpciones: f.quizOpciones.map((o, i) => i === idx ? e.target.value : o) })}
                  />
                  {form.quizCorrecta === idx ? (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-md bg-[#00BFFF] text-white font-semibold text-sm flex items-center gap-1 shadow hover:bg-[#0099cc] transition"
                    >
                      <Check className="w-4 h-4" /> Correcta
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-md bg-white border border-gray-200 text-sm hover:bg-[#E0F7FA] transition"
                      onClick={() => setForm(f => f && { ...f, quizCorrecta: idx })}
                    >
                      Marcar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
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
