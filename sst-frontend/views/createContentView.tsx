"use client";

import React, { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { BookOpen, Bell, FileText } from "lucide-react";

export default function CreateContentView() {
  const [type, setType] = useState<"charla" | "alerta" | "recurso">("charla");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [alertLevel, setAlertLevel] = useState("Media");
  const [alertMessage, setAlertMessage] = useState("");

  const saveDraft = () => {
    // placeholder
    alert("Borrador guardado (simulado)");
  };

  const publish = () => {
    alert("Publicado (simulado)");
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-5xl mx-auto py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#022B54]">Crear Contenido</h1>
              <p className="text-gray-600">Crea charlas, alertas o recursos para la biblioteca</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={saveDraft} className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-md shadow-sm">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Guardar Borrador
              </button>
              <button onClick={publish} className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-sm">
                Publicar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <div className="flex gap-2 bg-[#F0FAFF] rounded-full p-1">
                <button onClick={() => setType("charla")} className={`px-4 py-2 rounded-full ${type === "charla" ? "bg-[#00C2FF] text-white" : "text-slate-700"}`}>
                  <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Charla 5 Min</div>
                </button>
                <button onClick={() => setType("alerta")} className={`px-4 py-2 rounded-full ${type === "alerta" ? "bg-[#00C2FF] text-white" : "text-slate-700"}`}>
                  <div className="flex items-center gap-2"><Bell className="w-4 h-4" /> Alerta</div>
                </button>
                <button onClick={() => setType("recurso")} className={`px-4 py-2 rounded-full ${type === "recurso" ? "bg-[#00C2FF] text-white" : "text-slate-700"}`}>
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Recurso Biblioteca</div>
                </button>
              </div>
            </div>

            {/* Form fields change per type */}
            {type === "charla" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Título de la Charla</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Uso Correcto de EPP en Altura" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">Categoría</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-100">
                      <option value="">Seleccionar categoría</option>
                      <option>Seguridad</option>
                      <option>Procedimientos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-1">URL del Video (opcional)</label>
                    <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Descripción Corta</label>
                  <textarea value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" rows={3} placeholder="Breve descripción de la charla..." />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-1">Contenido en Markdown</label>
                  <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 font-mono" rows={8} placeholder="# Título Principal\nEscribe el contenido en markdown..." />
                </div>
              </div>
            )}

            {type === "alerta" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Título de la Alerta</label>
                  <input placeholder="Ej: Inspección de EPP Requerida" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Nivel de Urgencia</label>
                  <select value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-100">
                    <option>Alta</option>
                    <option>Media</option>
                    <option>Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Mensaje</label>
                  <textarea value={alertMessage} onChange={(e) => setAlertMessage(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" rows={4} placeholder="Escribe el mensaje de la alerta..." />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Destinatarios</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-white border border-gray-100">
                    <option>Seleccionar destinatarios</option>
                    <option>Todos</option>
                    <option>Producción</option>
                  </select>
                </div>
              </div>
            )}

            {type === "recurso" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Título del Recurso</label>
                  <input placeholder="Ej: Manual de Seguridad" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Descripción</label>
                  <textarea className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-100" rows={4} />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 mb-1">Adjuntar archivo (opcional)</label>
                  <input type="file" className="w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-[#E9F9FF] rounded-xl p-4 border border-cyan-100">
            <div className="font-medium text-[#003366] mb-2">Vista Previa</div>
            <div className="h-28 rounded-lg bg-white border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400">
              La vista previa aparecerá aquí una vez que completes los campos
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
