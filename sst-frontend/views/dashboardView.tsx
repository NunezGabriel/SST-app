"use client";

import LayoutComponent from "@/components/layoutComponent";
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

        <div className="bg-linear-to-r from-[#003366] to-[#004d80] rounded-2xl p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-cyan-400 p-2 rounded-full">
                  <MessageSquare size={20} className="text-[#003366]" />
                </div>
                <span className="text-cyan-400 font-semibold text-sm">
                  CHARLA DEL DÍA
                </span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={16} className="text-cyan-400" />
                <span className="text-sm">5 min</span>
                <span className="bg-cyan-400 bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium">
                  Seguridad
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">
                Uso Correcto de EPP en Altura
              </h2>
              <p className="text-gray-200 text-lg">
                Aprende las mejores prácticas para trabajos en alturas y el uso
                adecuado del equipo de protección personal.
              </p>
            </div>
            <button className="bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap ml-6">
              <Play size={18} fill="currentColor" />
              Comenzar Ahora
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Charlas Completadas
            </h3>
            <div className="flex justify-between items-end mb-3">
              <span className="text-3xl font-bold text-gray-900">24/30</span>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                80%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#003366] h-2 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Cumplimiento
            </h3>
            <div className="flex justify-between items-end mb-3">
              <span className="text-3xl font-bold text-gray-900">85%</span>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                85%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#003366] h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
            <div className="absolute top-4 right-4 text-red-500">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Alertas Pendientes
            </h3>
            <span className="text-3xl font-bold text-gray-900">3</span>
          </div>
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
