"use client";

import LayoutComponent from "@/components/layoutComponent";
import {
  CheckCircle2,
  PlayCircle,
  Clock,
  Download,
  ExternalLink,
  Shield,
  Award,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useInduccionAdminContext } from "@/context/InduccionAdminContext";

// ── Convierte link de Drive al formato de descarga directa ────────────────────
const toDownloadUrl = (driveUrl: string): string => {
  try {
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return driveUrl; // si no reconoce el formato, abre normal
  } catch {
    return driveUrl;
  }
};

const handleDescargar = (url: string) => {
  const downloadUrl = toDownloadUrl(url);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = "material-induccion.pdf";
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// ── Convierte cualquier URL de YouTube al formato embed ───────────────────────
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
        return url;
      } else if (u.pathname.startsWith("/shorts/")) {
        videoId = u.pathname.split("/shorts/")[1];
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

const InduccionView = () => {
  const router = useRouter();
  const { induccion, isLoading, error } = useInduccionAdminContext();

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="text-center py-12">
          Cargando material de inducción...
        </div>
      </LayoutComponent>
    );
  }

  if (error || !induccion) {
    return (
      <LayoutComponent>
        <div className="text-center py-12 text-red-500">
          {error || "Error al cargar material de inducción"}
        </div>
      </LayoutComponent>
    );
  }

  const embedUrl = toEmbedUrl(induccion.linkVideo);

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-gradient-to from-[#F5FAFF] via-white to-[#F0F9FF]">
        <div className="max-w-4xl mx-auto py-8 space-y-8">
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-[#003366] flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#022B54] mb-1">
                  Inducción de Seguridad
                </h1>
                <p className="text-gray-600 text-lg">
                  Capacitación completa para tu seguridad en el trabajo
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
                <Award className="w-4 h-4" />
                aprueba el examen
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <Clock className="w-4 h-4" />
                {induccion.duracion} minutos
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-medium">
                <BookOpen className="w-4 h-4" />
                Material completo
              </span>
            </div>
          </div>

          {/* Video */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

            <div className="relative z-10 w-full">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to from-cyan-500 to-blue-600 bg-opacity-20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PlayCircle className="w-10 h-10 text-cyan-300" />
              </div>
              <div className="mb-6">
                <p className="text-sm uppercase tracking-wider opacity-90 font-semibold mb-2 text-gray-500">
                  Video de Inducción
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-2 text-black">
                  Inducción a diversos temas
                </h2>
              </div>
              {embedUrl && (
                <div className="w-full max-w-3xl mx-auto mt-6">
                  <div
                    className="relative w-full rounded-xl overflow-hidden shadow-2xl"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={embedUrl}
                      title="Video de Inducción"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-4 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 rounded-full bg-gradient-to from-cyan-50 to-blue-50 text-cyan-700 text-sm font-semibold border border-cyan-200">
                  Seguridad
                </span>
                <span className="px-4 py-2 rounded-full bg-gray-50 text-gray-700 text-sm font-medium">
                  Inducción
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span className="font-medium">{induccion.duracion} min</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Inducción General QHSE - ITELSAC
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Bienvenido a ITELSAC, empresa líder en servicios de
                telecomunicaciones y construcción de redes de fibra óptica en el
                Perú. Esta inducción cubre los aspectos fundamentales de nuestra
                Política Integrada de Gestión en Calidad, Seguridad, Salud
                Ocupacional y Medio Ambiente (QHSE). Aprenderás sobre trabajos
                de alto riesgo, manejo de materiales peligrosos, gestión de
                residuos, primeros auxilios, y las normas generales de seguridad
                que todo colaborador debe conocer y aplicar en campo.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Trabajos de alto riesgo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>EPP y PETAR</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Gestión de residuos</span>
              </div>
            </div>
          </div>

          {/* Botón descarga PDF */}
          <div className="grid grid-cols-1 gap-5">
            <button
              onClick={() => handleDescargar(induccion.linkPdf)}
              className="group flex items-center gap-4 bg-white hover:bg-gradient-to hover:from-cyan-50 hover:to-blue-50 rounded-2xl border-2 border-gray-200 hover:border-cyan-300 px-6 py-5 transition-all shadow-md hover:shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to from-cyan-100 to-blue-100 group-hover:from-cyan-200 group-hover:to-blue-200 flex items-center justify-center transition-all">
                <Download className="w-6 h-6 text-[#00C2FF]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-gray-900 text-base">
                  Descargar PDF
                </p>
                <p className="text-xs text-gray-500 mt-1">Descargar material</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-600 transition-colors" />
            </button>
          </div>

          {/* Sección examen */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

            <div className="relative flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    ¿Te sientes listo?
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    20 preguntas
                  </span>
                </div>
                <p className="text-gray-500 mb-6 leading-relaxed">
                  Realiza el examen para verificar tu comprensión del material.
                  El examen consta de 20 preguntas secuenciales que evaluarán tu
                  conocimiento sobre seguridad en el trabajo.
                </p>
                <button
                  onClick={() => router.push("/examen")}
                  className="px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 transform hover:scale-105"
                >
                  Realiza el Examen
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

export default InduccionView;
