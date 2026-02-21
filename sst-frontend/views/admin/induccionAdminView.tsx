"use client";

import { useState, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  Shield,
  PlayCircle,
  Presentation,
  Download,
  ExternalLink,
  Save,
  CheckCircle2,
  Wrench,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useInduccionAdminContext } from "@/context/InduccionAdminContext";

// ── Convierte cualquier URL de YouTube al formato embed ──────────────────────
const toEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    let videoId: string | null = null;

    if (u.hostname === "youtu.be") {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") {
        videoId = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        return url; // ya es embed
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.split("/shorts/")[1];
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

const InduccionAdminView = () => {
  const router = useRouter();
  const { induccion, isLoading, error, updateInduccion } = useInduccionAdminContext();
  const [form, setForm] = useState({
    youtubeUrl: "",
    enlacePdf: "",
    enlaceDiapositivas: "",
    duracion: 10,
  });
  const [saved, setSaved] = useState(false);
  const [urlError, setUrlError] = useState("");

  // Cargar datos del contexto cuando estén disponibles
  useEffect(() => {
    if (induccion) {
      setForm({
        youtubeUrl: induccion.linkVideo,
        enlacePdf: induccion.linkPdf,
        enlaceDiapositivas: induccion.linkDiapo,
        duracion: induccion.duracion,
      });
    }
  }, [induccion]);

  const embedUrl = toEmbedUrl(form.youtubeUrl);

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="text-center py-12">Cargando material de inducción...</div>
      </LayoutComponent>
    );
  }

  if (error && !induccion) {
    return (
      <LayoutComponent>
        <div className="text-center py-12 text-red-500">
          {error || "Error al cargar material de inducción"}
        </div>
      </LayoutComponent>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
    if (name === "youtubeUrl") setUrlError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedUrl) {
      setUrlError("El enlace no es una URL de YouTube válida.");
      return;
    }
    try {
      await updateInduccion({
        linkVideo: form.youtubeUrl,
        linkPdf: form.enlacePdf,
        linkDiapo: form.enlaceDiapositivas,
        duracion: form.duracion,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setUrlError(err.message || "Error al guardar cambios");
    }
  };

  return (
    <LayoutComponent>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#003366] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#022B54]">
              Inducción de Seguridad
            </h1>
            <p className="text-gray-500 text-base mt-1">
              Gestión del material de inducción para workers
            </p>
          </div>
        </div>

        {/* ── Formulario de edición ── */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Configurar Material
            </h2>
            {saved && (
              <span className="flex items-center gap-2 text-sm text-emerald-600 font-semibold">
                <CheckCircle2 size={16} /> Guardado correctamente
              </span>
            )}
          </div>

          {/* YouTube */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Enlace de YouTube <span className="text-red-400">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Acepta cualquier formato:{" "}
              <span className="font-mono">youtube.com/watch?v=...</span>,{" "}
              <span className="font-mono">youtu.be/...</span>,{" "}
              <span className="font-mono">youtube.com/shorts/...</span>
            </p>
            <div className="relative">
              <PlayCircle
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="url"
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={handleChange}
                required
                placeholder="https://www.youtube.com/watch?v=..."
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-gray-50 placeholder-gray-300 ${
                  urlError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-200 focus:ring-cyan-300"
                }`}
              />
            </div>
            {urlError && (
              <p className="text-xs text-red-500 mt-1">{urlError}</p>
            )}
            {/* Preview embed en tiempo real */}
            {embedUrl && (
              <div
                className="mt-4 rounded-xl overflow-hidden shadow-md border border-gray-100"
                style={{ paddingBottom: "42%", position: "relative" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl}
                  title="Preview video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Enlace PDF (Drive) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Download
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="url"
                name="enlacePdf"
                value={form.enlacePdf}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Diapositivas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Enlace Diapositivas (Drive){" "}
              <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Presentation
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="url"
                name="enlaceDiapositivas"
                value={form.enlaceDiapositivas}
                onChange={handleChange}
                required
                placeholder="https://drive.google.com/..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300"
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Duración (minutos) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Clock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                name="duracion"
                value={form.duracion}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duracion: parseInt(e.target.value) || 0,
                  }))
                }
                required
                min="1"
                placeholder="10"
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition shadow"
          >
            <Save size={16} />
            Guardar Cambios
          </button>
        </form>

        {/* ── Preview de cómo lo verá el worker ── */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Vista previa — como lo verá el worker
          </p>

          {/* Links PDF y Diapositivas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={form.enlaceDiapositivas}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-300 px-6 py-5 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Presentation className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">
                  Ver Diapositivas
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {form.enlaceDiapositivas}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
            </a>

            <a
              href={form.enlacePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white rounded-2xl border-2 border-gray-200 hover:border-cyan-300 px-6 py-5 transition-all shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Download className="w-6 h-6 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">
                  Ver Documento PDF
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {form.enlacePdf}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
            </a>
          </div>

          {/* Botón examen — igual que en worker, solo redirige */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Glows decorativos */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

            <div className="relative flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                <Wrench className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Accede aqui para modificar el examen
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    20 preguntas
                  </span>
                </div>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  El examen de inducción es obligatorio para todos los workers.
                  Asegúrate de que el contenido esté actualizado y sea relevante
                  para la seguridad en el trabajo. Ademas podras modificar el
                  examen y sus reglas
                </p>
                <button
                  onClick={() => router.push("/examen")}
                  className="px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 transform hover:scale-105"
                >
                  Modificar Examen
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default InduccionAdminView;
