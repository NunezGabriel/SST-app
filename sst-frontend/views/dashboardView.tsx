"use client";

import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
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
  return (
    <LayoutComponent>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600 mt-2">
              Martes, 3 de Febrero 2026 • Mantén tu seguridad al día
            </p>
          </div>
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Sistema Activo
          </div>
        </div>

        <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-300 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                  <MessageSquare size={20} className="text-[#003366]" />
                </div>
                <span className="text-[#003366] font-semibold text-sm uppercase tracking-wider">
                  CHARLA DEL DÍA
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={16} className="text-[#003366]" />
                <span className="text-sm text-black">5 min</span>
                <span className="bg-[#003366] bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                  Seguridad
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-black">
                Uso Correcto de EPP en Altura
              </h2>
              <p className="text-gray-500 text-lg">
                Aprende las mejores prácticas para trabajos en alturas y el uso
                adecuado del equipo de protección personal.
              </p>
            </div>
            <button className="bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap ml-6 shadow-lg">
              <Play size={18} fill="currentColor" />
              Comenzar Ahora
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiComponent
            title="Charlas Completadas"
            value="24/30"
            percentage={80}
            showProgressBar={true}
          />

          <KpiComponent
            title="Cumplimiento"
            value="85%"
            percentage={85}
            showProgressBar={true}
          />

          <KpiComponent
            title="Alertas Pendientes"
            value="3"
            icon={AlertCircle}
            showIcon={true}
            iconPosition="top-right"
            iconColor="text-red-500"
            showProgressBar={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-[#003366]" />
              Accesos Rápidos
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Biblioteca de Seguridad
                  </p>
                  <p className="text-sm text-gray-500">
                    120+ recursos disponibles
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Alertas Pendientes
                  </p>
                  <p className="text-sm text-gray-500">
                    3 notificaciones nuevas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ver Reportes</p>
                  <p className="text-sm text-gray-500">
                    Análisis de cumplimiento
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-[#003366]" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Charla: Riesgos Eléctricos
                  </p>
                  <p className="text-sm text-gray-500">Hace 2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Alerta: Inspección EPP
                  </p>
                  <p className="text-sm text-gray-500">Hace 4 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle2 size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    Lectura: Procedimiento de Emergencia
                  </p>
                  <p className="text-sm text-gray-500">Ayer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default DashboardView;
