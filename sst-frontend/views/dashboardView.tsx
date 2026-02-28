"use client";

import Link from "next/link";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { useAuthContext } from "@/context/AuthContext";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import { useNotificacionContext } from "@/context/NotificacionContext";
import { useLogroContext } from "@/context/LogroContext";
import {
  BookOpen,
  Bell,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  MessageSquare,
} from "lucide-react";

const DashboardView = () => {
  const { user } = useAuthContext();
  const { charlasUsuario, marcarCompletada } = useCharlaAdminContext();
  const { unreadCount, reload: reloadNotificaciones } =
    useNotificacionContext();
  const { reload: reloadLogros } = useLogroContext();

  // Fecha de hoy formateada
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fechaFormateadaCapitalizada =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  // Charla del día: la primera charla cuya fechaCharla coincide con hoy y está pendiente
  const todayStr = hoy.toISOString().split("T")[0]; // "YYYY-MM-DD"
  const charlaDelDia =
    charlasUsuario.find(
      (c) => c.fechaCharla === todayStr && c.estado === "PENDIENTE",
    ) ?? null;

  // KPIs de charlas
  const totalCharlas = charlasUsuario.length;
  const completadas = charlasUsuario.filter(
    (c) => c.estado === "COMPLETADA",
  ).length;
  const cumplimientoPct =
    totalCharlas > 0 ? Math.round((completadas / totalCharlas) * 100) : 0;

  // Actividad reciente: últimas 3 charlas completadas ordenadas por fecha
  const actividadReciente = [...charlasUsuario]
    .filter((c) => c.estado === "COMPLETADA" && c.fechaCompletada)
    .sort(
      (a, b) =>
        new Date(b.fechaCompletada!).getTime() -
        new Date(a.fechaCompletada!).getTime(),
    )
    .slice(0, 3);

  const formatRelativeTime = (isoDate: string) => {
    const diff = Date.now() - new Date(isoDate).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Hace menos de 1 hora";
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
    if (days === 1) return "Ayer";
    return `Hace ${days} días`;
  };

  // ── NUEVA FUNCIÓN: Marcar charla del día como completada ──
  const handleComenzarCharla = async () => {
    if (!charlaDelDia) return;

    // Abrir el enlace
    window.open(charlaDelDia.enlace, "_blank");

    // Marcar como completada si no lo está ya
    if (charlaDelDia.estado !== "COMPLETADA") {
      try {
        await marcarCompletada(charlaDelDia.id);
        // Recargar notificaciones y logros para reflejar cambios
        await Promise.all([reloadNotificaciones(), reloadLogros()]);

        // Disparar evento para actualizar otras páginas (como el perfil)
        window.dispatchEvent(new CustomEvent("logro_desbloqueado"));
        localStorage.setItem("charlas_updated", Date.now().toString());
      } catch (err: any) {
        console.error("Error al marcar charla como completada:", err);
      }
    }
  };

  return (
    <LayoutComponent>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Bienvenido{user?.nombre ? `, ${user.nombre}` : " de vuelta"}
            </h1>
            <p className="text-gray-600 mt-2">
              {fechaFormateadaCapitalizada} • Mantén tu seguridad al día
            </p>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Sistema Activo
          </div>
        </div>

        {/* Charla del Día */}
        <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

          <div className="relative z-10 gap-5 flex-col flex md:flex-row justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-300 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                  <MessageSquare size={20} className="text-[#003366]" />
                </div>
                <span className="text-[#003366] font-semibold text-sm uppercase tracking-wider">
                  CHARLA DEL DÍA
                </span>
              </div>
              {charlaDelDia ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={16} className="text-[#003366]" />
                    <span className="text-sm text-black">5 min</span>
                    {charlaDelDia.etiqueta && (
                      <span className="bg-[#003366] bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                        {charlaDelDia.etiqueta}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-black">
                    {charlaDelDia.nombre}
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Accede aquí para realizar tu charla del día de hoy
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-3 text-black">
                    Ya completaste tu charla de hoy
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Revisa tu listado de charlas pendientes
                  </p>
                </>
              )}
            </div>
            {charlaDelDia ? (
              <button
                onClick={handleComenzarCharla}
                className="bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap ml-6 shadow-lg transition-all hover:scale-105"
              >
                <Play size={18} fill="currentColor" />
                Comenzar Ahora
              </button>
            ) : (
              <Link
                href="/charlas"
                className="bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap ml-6 shadow-lg transition-all hover:scale-105"
              >
                Ver Charlas
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiComponent
            title="Charlas Completadas"
            value={`${completadas}/${totalCharlas}`}
            percentage={cumplimientoPct}
            showProgressBar={true}
          />

          <KpiComponent
            title="Cumplimiento"
            value={`${cumplimientoPct}%`}
            percentage={cumplimientoPct}
            showProgressBar={true}
          />

          <KpiComponent
            title="Alertas Pendientes"
            value={String(unreadCount)}
            icon={AlertCircle}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-red-500"
            showProgressBar={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accesos Rápidos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-[#003366]" />
              Accesos Rápidos
            </h3>
            <div className="space-y-4">
              <Link
                href="/biblioteca"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Biblioteca de Seguridad
                  </p>
                  <p className="text-sm text-gray-500">
                    Documentos y recursos disponibles
                  </p>
                </div>
              </Link>

              <Link
                href="/alertas"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Alertas Pendientes
                  </p>
                  <p className="text-sm text-gray-500">
                    {unreadCount > 0
                      ? `${unreadCount} notificacion${unreadCount > 1 ? "es" : ""} nueva${unreadCount > 1 ? "s" : ""}`
                      : "Sin notificaciones nuevas"}
                  </p>
                </div>
              </Link>

              <Link
                href="/examen"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dar examen</p>
                  <p className="text-sm text-gray-500">
                    Realiza tu examen de inducción
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-[#003366]" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {actividadReciente.length > 0 ? (
                actividadReciente.map((charla) => (
                  <div key={charla.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <CheckCircle2 size={16} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        Charla: {charla.nombre}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(charla.fechaCompletada!)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                    <AlertCircle size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-500">
                      Aún no has completado ninguna charla
                    </p>
                    <p className="text-sm text-gray-400">¡Comienza hoy!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default DashboardView;
