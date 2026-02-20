"use client";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";

import { useState } from "react";
import {
  Users,
  BookOpen,
  Bell,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  TrendingUp,
  ClipboardList,
  PlusCircle,
  Award,
  Activity,
  ChevronRight,
  BarChart3,
  UserCheck,
  UserX,
} from "lucide-react";

const DasboardAdminView = () => {
  const [activeTab, setActiveTab] = useState("resumen");

  const recentActivity = [
    {
      type: "user",
      icon: UserCheck,
      color: "bg-blue-100 text-blue-600",
      title: "Nuevo worker registrado: Luis Gómez",
      time: "Hace 30 min",
    },
    {
      type: "charla",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
      title: "Charla creada: Manejo de Residuos Peligrosos",
      time: "Hace 2 horas",
    },
    {
      type: "examen",
      icon: CheckCircle2,
      color: "bg-green-100 text-green-600",
      title: "Carlos Ríos aprobó el examen de inducción (17/20)",
      time: "Hace 3 horas",
    },
    {
      type: "alerta",
      icon: UserX,
      color: "bg-red-100 text-red-600",
      title: "María Torres falló examen (3 intentos) — bloqueada",
      time: "Hace 5 horas",
    },
    {
      type: "doc",
      icon: FileText,
      color: "bg-yellow-100 text-yellow-600",
      title: "Documento actualizado: Procedimiento de Evacuación v2.1",
      time: "Ayer",
    },
  ];

  const workerStats = [
    { name: "Ana Flores", charlas: "28/30", examen: "Aprobado", cumpl: 96 },
    { name: "Pedro Salas", charlas: "20/30", examen: "Pendiente", cumpl: 68 },
    { name: "Luis Gómez", charlas: "5/30", examen: "No rendido", cumpl: 20 },
    { name: "María Torres", charlas: "25/30", examen: "Bloqueada", cumpl: 72 },
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
              Jueves, 19 de Febrero 2026 • Gestión SST
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
            value="42"
            percentage={95}
            showProgressBar={false}
            icon={Users}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-blue-500"
          />
          <KpiComponent
            title="Charlas Publicadas"
            value="30"
            percentage={100}
            showProgressBar={false}
            icon={BookOpen}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-purple-500"
          />
          <KpiComponent
            title="Cumplimiento Global"
            value="78%"
            percentage={78}
            showProgressBar={true}
            progressBarColor="bg-[#003366]"
          />
          <KpiComponent
            title="Exámenes Bloqueados"
            value="3"
            percentage={15}
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
              {[
                {
                  icon: BookOpen,
                  color: "bg-blue-100 text-blue-600",
                  label: "Nueva Charla",
                  sub: "Asignar a todos los workers",
                },
                {
                  icon: FileText,
                  color: "bg-green-100 text-green-600",
                  label: "Nuevo Documento",
                  sub: "Publicar en la biblioteca",
                },
                {
                  icon: ClipboardList,
                  color: "bg-yellow-100 text-yellow-700",
                  label: "Editar Examen",
                  sub: "Preguntas y configuración",
                },
                {
                  icon: Users,
                  color: "bg-purple-100 text-purple-600",
                  label: "Crear Usuario",
                  sub: "Nuevo worker o admin",
                },
                {
                  icon: Award,
                  color: "bg-pink-100 text-pink-600",
                  label: "Nuevo Logro",
                  sub: "Gamificación SST",
                },
              ].map(({ icon: Icon, color, label, sub }) => (
                <div
                  key={label}
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
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-[#003366]" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {recentActivity.map(({ icon: Icon, color, title, time }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 ${color} rounded-full flex items-center justify-center mt-0.5 shrink-0`}
                  >
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm leading-snug">
                      {title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notificaciones pendientes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-[#003366]" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Charlas publicadas",
                  val: 30,
                  max: 30,
                  color: "from-blue-400 to-blue-600",
                },
                {
                  label: "Documentos activos",
                  val: 18,
                  max: 20,
                  color: "from-purple-400 to-purple-600",
                },
                {
                  label: "Preguntas en banco",
                  val: 35,
                  max: 40,
                  color: "from-indigo-400 to-indigo-600",
                },
                {
                  label: "Formatos disponibles",
                  val: 12,
                  max: 15,
                  color: "from-cyan-400 to-cyan-600",
                },
              ].map(({ label, val, max, color }) => (
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
                      style={{ width: `${(val / max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">
                  Atención requerida
                </span>
              </div>
              <p className="text-xs text-amber-600">
                3 workers llevan más de 7 días sin completar ninguna charla.
                Considera enviar un recordatorio.
              </p>
            </div>
          </div>
        </div>

        {/* ── Workers Table ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-[#003366]" />
              Progreso de Workers
            </h3>
            <button className="text-sm text-[#003366] font-medium hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={14} />
            </button>
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
                {workerStats.map(({ name, charlas, examen, cumpl }) => (
                  <tr key={name} className="hover:bg-gray-50 transition">
                    <td className="py-3 font-medium text-gray-900">{name}</td>
                    <td className="py-3 text-gray-600">{charlas}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          examen === "Aprobado"
                            ? "bg-green-100 text-green-700"
                            : examen === "Bloqueada"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {examen}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${
                              cumpl >= 80
                                ? "bg-green-500"
                                : cumpl >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${cumpl}%` }}
                          />
                        </div>
                        <span className="text-gray-700 font-medium">
                          {cumpl}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default DasboardAdminView;
