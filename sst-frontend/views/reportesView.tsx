 "use client";

import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import GraphCard from "@/components/cards/graphCard";
import { Download, Filter, Users, BookOpen, Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const estadoCharlasData = [
  { name: "Completadas", value: 80, color: "#00C2FF" },
  { name: "Pendientes", value: 20, color: "#E5F6FF" },
];

const departamentoData = [
  { name: "Producción", completadas: 28, pendientes: 2 },
  { name: "Mantenimiento", completadas: 22, pendientes: 3 },
  { name: "Logística", completadas: 24, pendientes: 4 },
  { name: "Administración", completadas: 30, pendientes: 1 },
];

const tendenciaData = [
  { name: "Oct", cumplimiento: 78 },
  { name: "Nov", cumplimiento: 82 },
  { name: "Dic", cumplimiento: 80 },
  { name: "Ene", cumplimiento: 84 },
  { name: "Feb", cumplimiento: 88 },
];

export default function ReportesView() {
  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto py-6 space-y-8">
          {/* Header y filtros */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#022B54]">
                Reportes de Control
              </h1>
              <p className="text-gray-600">
                Analiza el cumplimiento y progreso de tu equipo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Este mes</span>
              </div>
              <button className="inline-flex items-center gap-2 bg-[#00C2FF] hover:bg-[#00b0e6] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm">
                <Download className="w-4 h-4" />
                Exportar a PDF
              </button>
            </div>
          </div>

          {/* Banner de predicción */}
          <div className="bg-linear-to-r from-[#003366] to-[#004d80] rounded-2xl px-8 py-6 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300 mb-2">
                Predicción
              </p>
              <p className="text-3xl font-bold mb-1">
                85% Cumplimiento Proyectado
              </p>
              <p className="text-sm text-cyan-100">
                Basado en tendencias de los últimos 3 meses
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <span className="text-xs text-cyan-100">
                Tendencia comparada al período anterior
              </span>
              <span className="inline-flex items-center gap-2 bg-emerald-400 text-[#003366] text-sm font-semibold px-4 py-2 rounded-full">
                Tendencia Positiva +3%
              </span>
            </div>
          </div>

          {/* KPIs principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiComponent
              title="Charlas Totales"
              value={120}
              showProgressBar={false}
              showIcon
              icon={BookOpen}
              iconColor="text-[#00C2FF]"
            />
            <KpiComponent
              title="Usuarios Activos"
              value={47}
              showProgressBar={false}
              showIcon
              icon={Users}
              iconColor="text-[#a23dc5]"
            />
            <KpiComponent
              title="Tasa de Cumplimiento"
              value="85%"
              percentage={85}
              showProgressBar
            />
            <KpiComponent
              title="Días Promedio"
              value={2.5}
              showProgressBar={false}
              showIcon
              icon={Calendar}
              iconColor="text-[#f0b100]"
            />
          </div>

          {/* Gráficos principales con Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraphCard
              title="Estado de Charlas"
              subtitle="Distribución de completadas vs pendientes"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={estadoCharlasData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={4}
                  >
                    {estadoCharlasData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
              <Tooltip
                    formatter={(value?: number) => (value !== undefined ? `${value}%` : "")}
                    contentStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GraphCard>

            <GraphCard
              title="Por Departamento"
              subtitle="Completadas vs Pendientes por área"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departamentoData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completadas" fill="#00C2FF" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="pendientes" fill="#E5F6FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GraphCard>
          </div>

          {/* Tendencia y Top usuarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GraphCard
              title="Tendencia de Cumplimiento"
              subtitle="Evolución mensual del porcentaje de cumplimiento"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tendenciaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value?: number) => (value !== undefined ? `${value}%` : "")}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumplimiento"
                    stroke="#00C2FF"
                    strokeWidth={3}
                    dot={{ r: 5, strokeWidth: 2, stroke: "#ffffff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GraphCard>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#00C2FF]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Top 5 Usuarios
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Usuarios con mejor cumplimiento este mes
              </p>
              <div className="space-y-3">
                {[
                  { name: "María González", value: "30 charlas completadas", percent: 100, color: "bg-emerald-500" },
                  { name: "Carlos Rodríguez", value: "29 charlas completadas", percent: 97, color: "bg-emerald-400" },
                  { name: "Ana Martínez", value: "28 charlas completadas", percent: 93, color: "bg-sky-400" },
                  { name: "Juan Pérez", value: "27 charlas completadas", percent: 90, color: "bg-sky-400" },
                  { name: "Laura Sánchez", value: "26 charlas completadas", percent: 87, color: "bg-amber-400" },
                ].map((user, index) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between gap-3 bg-[#F8FBFF] hover:bg-[#F1F7FF] rounded-xl px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-semibold text-gray-700">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">
                        {user.percent}%
                      </span>
                      <span
                        className={`w-2 h-6 rounded-full ${user.color}`}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
