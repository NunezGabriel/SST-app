"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { PlayCircle, CheckCircle2, Clock, Video, File } from "lucide-react";

type CharlaStatus = "no_iniciada" | "completada";

interface Charla {
  id: number;
  titulo: string;
  categoria: string;
  duracionMin: number;
  estado: CharlaStatus;
}

const charlasMock: Charla[] = [
  {
    id: 1,
    titulo: "Uso Correcto de EPP en Altura",
    categoria: "Seguridad",
    duracionMin: 5,
    estado: "no_iniciada",
  },
  {
    id: 2,
    titulo: "Riesgos Eléctricos Básicos",
    categoria: "Riesgos",
    duracionMin: 5,
    estado: "completada",
  },
  {
    id: 3,
    titulo: "Ergonomía en el Trabajo",
    categoria: "Salud",
    duracionMin: 5,
    estado: "completada",
  },
  {
    id: 4,
    titulo: "Primeros Auxilios Básicos",
    categoria: "Emergencias",
    duracionMin: 5,
    estado: "no_iniciada",
  },
];

const CharlasView = () => {
  const [charlas, setCharlas] = useState<Charla[]>(charlasMock);

  const totalCharlas = charlas.length;
  const completadas = charlas.filter((c) => c.estado === "completada").length;
  const progresoGlobal = Math.round((completadas / totalCharlas) * 100);

  const handleOpenCharla = (charla: Charla) => {
    // Redirigir a Drive
    window.open("https://drive.google.com", "_blank");
    
    // Marcar como completada y cambiar el icono
    if (charla.estado !== "completada") {
      setCharlas((prev) =>
        prev.map((c) =>
          c.id === charla.id ? { ...c, estado: "completada" } : c
        )
      );
    }
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-gradient-to from-[#F5FAFF] via-white to-[#F0F9FF]">
        <div className="max-w-6xl mx-auto py-8 space-y-8">
          {/* Header mejorado */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#003366] flex items-center justify-center shadow-lg">
                <File className="w-7 h-7 text-cyan-500" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#022B54] mb-2">
                  Charlas de 5 Minutos
                </h1>
                <p className="text-gray-600 text-lg">
                  Capacitaciones cortas y efectivas para tu seguridad
                </p>
              </div>
            </div>
            {/* Barra de progreso global */}
            <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progreso General Anual</span>
                <span className="text-sm font-bold text-[#003366]">{progresoGlobal}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${progresoGlobal}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiComponent
              title="Total Charlas"
              value={totalCharlas}
              showProgressBar={false}
              showIcon
              icon={File}
              iconColor="text-cyan-500"
            />
            <KpiComponent
              title="Completadas"
              value={completadas}
              showProgressBar={false}
              showIcon
              icon={CheckCircle2}
              iconColor="text-emerald-500"
            />
            <KpiComponent
              title="Progreso"
              value={`${progresoGlobal}%`}
              percentage={progresoGlobal}
              showProgressBar
              showIcon
              icon={Clock}
              iconColor="text-blue-500"
            />
          </div>

          {/* Lista de charlas mejorada */}
          <div className="space-y-5">
            {charlas.map((charla) => {
              const isCompletada = charla.estado === "completada";

              const iconBg = isCompletada
                ? "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                : "bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600";

              const buttonLabel = isCompletada ? "Revisar" : "Comenzar";
              const buttonClass = isCompletada
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-cyan-500 hover:bg-cyan-600";

              return (
                <div
                  key={charla.id}
                  className="group bg-white rounded-2xl shadow-md border-2 border-gray-100 hover:border-cyan-300 px-6 py-5 flex items-center justify-between gap-6 transition-all hover:shadow-xl"
                >
                  {/* Icono y texto */}
                  <div className="flex items-center gap-5 flex-1">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform ${iconBg}`}
                    >
                      {isCompletada ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <PlayCircle className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-900">
                          {charla.titulo}
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold border border-cyan-200">
                          {charla.categoria}
                        </span>
                        {isCompletada && (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-600" />
                          <span className="font-medium">{charla.duracionMin} minutos</span>
                        </div>
                        {isCompletada && (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="font-medium">Finalizada</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón mejorado */}
                  <button
                    onClick={() => handleOpenCharla(charla)}
                    className={`px-8 py-3 rounded-full ${buttonClass} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap`}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default CharlasView;