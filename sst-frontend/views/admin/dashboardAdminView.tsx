"use client";
import Link from "next/link";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { useAuthContext } from "@/context/AuthContext";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import { useUserAdminContext } from "@/context/UserAdminContext";
import { useDocumentoAdminContext } from "@/context/DocumentoAdminContext";
import { useExamenAdminContext } from "@/context/ExamenAdminContext";
import { useFormatoAdminContext } from "@/context/FormatoAdminContext";
import {
  Users,
  BookOpen,
  FileText,
  AlertCircle,
  Shield,
  ClipboardList,
  ChevronRight,
  BarChart2,
  Bell,
} from "lucide-react";

const DasboardAdminView = () => {
  const { user } = useAuthContext();
  const { charlas } = useCharlaAdminContext();
  const { usuarios } = useUserAdminContext();
  const { documentos } = useDocumentoAdminContext();
  const { preguntas } = useExamenAdminContext();
  const { formatos } = useFormatoAdminContext();

  // Fecha formateada
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const fechaCapitalizada =
    fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);

  // KPIs reales
  const workersActivos = usuarios.filter((u) => u.activo).length;
  const totalCharlas = charlas.length;
  const totalDocumentos = documentos.length;
  const totalPreguntas = preguntas.length;
  const totalFormatos = formatos.length;

  // Cumplimiento global: promedio de cumpl entre workers
  const workers = usuarios.filter((u) => u.tipo === "WORKER");
  const cumplimientoGlobal =
    workers.length > 0
      ? Math.round(
          workers.reduce((acc, w) => acc + (w.cumpl ?? 0), 0) / workers.length,
        )
      : 0;

  // Exámenes bloqueados (workers con examen === "Bloqueada")
  const examenBloqueados = workers.filter(
    (w) => w.examen === "Bloqueada",
  ).length;

  // Distribución de exámenes
  const examenAprobados = workers.filter((w) => w.examen === "Aprobado").length;
  const examenNoAprobado = workers.filter(
    (w) => w.examen === "No aprobado",
  ).length;
  const examenMaxVal = Math.max(
    examenAprobados,
    examenNoAprobado,
    examenBloqueados,
    1,
  );

  // Tabla: primeros 4 workers
  const workerStats = workers.slice(0, 4);

  const acccionesRapidas = [
    {
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
      label: "Nueva Charla",
      sub: "Asignar a todos los workers",
      href: "/charlas",
    },
    {
      icon: FileText,
      color: "bg-green-100 text-green-600",
      label: "Nuevo Documento",
      sub: "Publicar en la biblioteca",
      href: "/biblioteca",
    },
    {
      icon: ClipboardList,
      color: "bg-yellow-100 text-yellow-700",
      label: "Editar Examen",
      sub: "Preguntas y configuración",
      href: "/examen",
    },
    {
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      label: "Crear Usuario",
      sub: "Nuevo worker o admin",
      href: "/admin-usuarios",
    },
  ];

  const estadoSistema = [
    {
      label: "Charlas publicadas",
      val: totalCharlas,
      max: Math.max(totalCharlas, 30),
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Documentos activos",
      val: totalDocumentos,
      max: Math.max(totalDocumentos, 20),
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "Preguntas en banco",
      val: totalPreguntas,
      max: Math.max(totalPreguntas, 40),
      color: "from-indigo-400 to-indigo-600",
    },
    {
      label: "Formatos disponibles",
      val: totalFormatos,
      max: Math.max(totalFormatos, 15),
      color: "from-cyan-400 to-cyan-600",
    },
  ];

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-2">
              {fechaCapitalizada} • Gestión SST
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Sistema Activo
            </div>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KpiComponent
            title="Workers Activos"
            value={String(workersActivos)}
            percentage={
              usuarios.length > 0
                ? Math.round((workersActivos / usuarios.length) * 100)
                : 0
            }
            showProgressBar={false}
            icon={Users}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-blue-500"
          />
          <KpiComponent
            title="Charlas Publicadas"
            value={String(totalCharlas)}
            percentage={100}
            showProgressBar={false}
            icon={BookOpen}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-purple-500"
          />
          <KpiComponent
            title="Cumplimiento Global"
            value={`${cumplimientoGlobal}%`}
            percentage={cumplimientoGlobal}
            showProgressBar={true}
            progressBarColor="bg-[#003366]"
          />
          <KpiComponent
            title="Exámenes Bloqueados"
            value={String(examenBloqueados)}
            percentage={
              workers.length > 0
                ? Math.round((examenBloqueados / workers.length) * 100)
                : 0
            }
            icon={AlertCircle}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-red-500"
            showProgressBar={false}
            variant="alert"
          />
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Acciones Rápidas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-[#003366]" />
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              {acccionesRapidas.map(
                ({ icon: Icon, color, label, sub, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition group"
                  >
                    <div
                      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 group-hover:text-gray-500 transition"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>

          {/* Distribución de Exámenes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart2 size={20} className="text-[#003366]" />
              Distribución de Exámenes
            </h3>
            {workers.length === 0 ? (
              <p className="text-sm text-gray-400">
                No hay workers registrados
              </p>
            ) : (
              <div className="space-y-5">
                {[
                  {
                    label: "Aprobado",
                    count: examenAprobados,
                    color: "from-green-400 to-green-500",
                    badge: "bg-green-100 text-green-700",
                  },
                  {
                    label: "No aprobado",
                    count: examenNoAprobado,
                    color: "from-yellow-400 to-yellow-500",
                    badge: "bg-yellow-100 text-yellow-700",
                  },
                  {
                    label: "Bloqueada",
                    count: examenBloqueados,
                    color: "from-red-400 to-red-500",
                    badge: "bg-red-100 text-red-700",
                  },
                ].map(({ label, count, color, badge }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badge}`}
                      >
                        {label}
                      </span>
                      <span className="text-sm font-bold text-gray-800">
                        {count}{" "}
                        <span className="text-gray-400 font-normal">
                          / {workers.length}
                        </span>
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                        style={{
                          width: `${examenMaxVal > 0 ? (count / examenMaxVal) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {/* Resumen numérico */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xl font-bold text-green-600">
                      {examenAprobados}
                    </p>
                    <p className="text-xs text-gray-400">Aprobaron</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-yellow-500">
                      {examenNoAprobado}
                    </p>
                    <p className="text-xs text-gray-400">No aprobaron</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-500">
                      {examenBloqueados}
                    </p>
                    <p className="text-xs text-gray-400">Bloqueados</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Estado del Sistema */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-[#003366]" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              {estadoSistema.map(({ label, val, max, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {val}/{max}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${color} rounded-full`}
                      style={{ width: `${max > 0 ? (val / max) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {examenBloqueados > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    Atención requerida
                  </span>
                </div>
                <p className="text-xs text-amber-600">
                  {examenBloqueados} worker
                  {examenBloqueados > 1 ? "s llevan" : " lleva"} el examen
                  bloqueado. Considera revisar su situación.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Workers Table ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-[#003366]" />
              Progreso de Workers
            </h3>
            <Link
              href="/admin-usuarios"
              className="text-sm text-[#003366] font-medium hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left pb-3 font-semibold">Trabajador</th>
                  <th className="text-left pb-3 font-semibold">Charlas</th>
                  <th className="text-left pb-3 font-semibold">Examen</th>
                  <th className="text-left pb-3 font-semibold">Cumplimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workerStats.length > 0 ? (
                  workerStats.map((w) => (
                    <tr key={w.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 font-medium text-gray-900">
                        {w.nombre} {w.apellido}
                      </td>
                      <td className="py-3 text-gray-600">{w.charlas}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            w.examen === "Aprobado"
                              ? "bg-green-100 text-green-700"
                              : w.examen === "Bloqueada"
                                ? "bg-red-100 text-red-700"
                                : w.examen === "No aprobado"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {w.examen}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full rounded-full ${
                                w.cumpl >= 80
                                  ? "bg-green-500"
                                  : w.cumpl >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${w.cumpl}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {w.cumpl}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-gray-400 text-sm"
                    >
                      No hay workers registrados aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default DasboardAdminView;
