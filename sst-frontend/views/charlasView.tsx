"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { PlayCircle, CheckCircle2, Clock, Video } from "lucide-react";

type CharlaStatus = "no_iniciada" | "completada";

interface Charla {
  id: number;
  titulo: string;
  categoria: string;
  duracionMin: number;
  estado: CharlaStatus;
  progreso: number; 
}

const charlasMock: Charla[] = [
  {
    id: 1,
    titulo: "Uso Correcto de EPP en Altura",
    categoria: "Seguridad",
    duracionMin: 5,
    estado: "no_iniciada",
    progreso: 0,
  },
  {
    id: 2,
    titulo: "Riesgos Eléctricos Básicos",
    categoria: "Riesgos",
    duracionMin: 5,
    estado: "completada",
    progreso: 100,
  },
  {
    id: 3,
    titulo: "Ergonomía en el Trabajo",
    categoria: "Salud",
    duracionMin: 5,
    estado: "completada",
    progreso: 100,
  },
  {
    id: 4,
    titulo: "Primeros Auxilios Básicos",
    categoria: "Emergencias",
    duracionMin: 5,
    estado: "no_iniciada",
    progreso: 60,
  },
];

const CharlasView = () => {
  const [selectedCharla, setSelectedCharla] = useState<Charla | null>(null);
  const [charlas, setCharlas] = useState<Charla[]>(charlasMock);

  const totalCharlas = charlas.length;
  const completadas = charlas.filter((c) => c.estado === "completada").length;
  const progresoGlobal = Math.round(
    (charlas.reduce((acc, c) => acc + c.progreso, 0) / (totalCharlas * 100)) *
      100
  );

  const handleOpenCharla = (charla: Charla) => {
    setSelectedCharla(charla);
  };

  const handleQuizCompleted = (charlaId: number) => {
    setCharlas((prev) =>
      prev.map((c) =>
        c.id === charlaId ? { ...c, estado: "completada", progreso: 100 } : c
      )
    );
    setSelectedCharla((prev) =>
      prev && prev.id === charlaId ? { ...prev, estado: "completada", progreso: 100 } : prev
    );
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-6xl mx-auto py-6 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-[#022B54] mb-1">
              Charlas de 5 Minutos
            </h1>
            <p className="text-gray-600">
              Capacitaciones cortas y efectivas para tu seguridad
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiComponent
              title="Total Charlas"
              value={totalCharlas}
              showProgressBar={false}
              showIcon
              icon={Video}
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

          {/* Lista de charlas o detalle */}
          {!selectedCharla ? (
            <div className="space-y-4">
              {charlas.map((charla) => {
                const isCompletada = charla.estado === "completada";
                const isEnCurso =
                  charla.progreso > 0 && charla.progreso < 100;

                const iconBg = isCompletada
                  ? "bg-emerald-100 text-emerald-500"
                  : "bg-cyan-100 text-cyan-500";

                const buttonLabel = isCompletada
                  ? "Revisar"
                  : isEnCurso
                  ? "Continuar"
                  : "Comenzar";

                return (
                  <div
                    key={charla.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between gap-6"
                  >
                    {/* Icono y texto */}
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
                      >
                        {isCompletada ? (
                          <CheckCircle2 className="w-7 h-7" />
                        ) : (
                          <PlayCircle className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {charla.titulo}
                          </h2>
                          <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-medium">
                            {charla.categoria}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{charla.duracionMin} min</span>
                        </div>
                        {charla.progreso > 0 && (
                          <div className="mt-2 w-40">
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-1.5 bg-[#003366] rounded-full"
                                style={{ width: `${charla.progreso}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {charla.progreso}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botón */}
                    <button
                      onClick={() => handleOpenCharla(charla)}
                      className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm shadow-sm transition-colors"
                    >
                      {buttonLabel}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <CharlaDetalle
              charla={selectedCharla}
              onBack={() => setSelectedCharla(null)}
              onQuizCompleted={handleQuizCompleted}
            />
          )}
        </div>
      </div>
    </LayoutComponent>
  );
};

interface CharlaDetalleProps {
  charla: Charla;
  onBack: () => void;
  onQuizCompleted: (charlaId: number) => void;
}

const CharlaDetalle: React.FC<CharlaDetalleProps> = ({
  charla,
  onBack,
  onQuizCompleted,
}) => {
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSubmitQuiz = () => {
    if (!selectedOption) return;
    setQuizAnswered(true);
    onQuizCompleted(charla.id);
  };

  const progreso = quizAnswered || charla.estado === "completada" ? 100 : 75;
  const videoCompletado = quizAnswered || charla.estado === "completada";

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-medium"
      >
        ← Volver a Charlas
      </button>

      {/* Progreso charla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progreso de la charla</span>
          <span className="text-sm font-semibold text-[#003366]">
            {progreso}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-[#003366] rounded-full"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Video / tarjeta principal */}
      <div className="bg-[#003366] rounded-2xl p-10 flex flex-col items-center justify-center text-center text-white space-y-3">
        <div className="w-16 h-16 rounded-full bg-white bg-opacity-10 flex items-center justify-center">
          {videoCompletado ? (
            <CheckCircle2 className="w-9 h-9 text-emerald-400" />
          ) : (
            <PlayCircle className="w-9 h-9 text-cyan-300" />
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide opacity-75">
            Video de Capacitación
          </p>
          <h2 className="text-2xl font-semibold mt-1 mb-1">
            {charla.titulo}
          </h2>
          <p className="text-sm opacity-80">{charla.duracionMin} minutos</p>
        </div>
        <a
          href="https://drive.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center px-6 py-2.5 rounded-full bg-white text-[#003366] font-semibold text-sm hover:bg-cyan-50 transition-colors"
        >
          Ver video en Drive
        </a>
      </div>

      {/* Información resumida */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold">
            {charla.categoria}
          </span>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{charla.duracionMin} min</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Uso Correcto de EPP en Altura
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Los trabajos en altura representan uno de los principales riesgos en
          la industria de la construcción y mantenimiento. El uso correcto del
          Equipo de Protección Personal (EPP) puede prevenir accidentes graves
          e incluso fatales. En esta charla aprenderás cómo seleccionar,
          ajustar y verificar tu arnés de cuerpo completo, así como las
          inspecciones previas y posteriores al uso.
        </p>
      </div>

      {/* Quiz */}
      <div className="bg-[#F0FAFF] rounded-2xl border border-cyan-100 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Quiz de Comprensión
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          ¿Cuál es la vida útil máxima de un arnés de cuerpo completo?
        </p>

        <div className="space-y-3">
          {["2 años", "5 años", "10 años", "Indefinida si está en buen estado"].map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  selectedOption === option
                    ? "border-cyan-500 bg-white shadow-sm"
                    : "border-transparent bg-white hover:border-cyan-200"
                }`}
              >
                {option}
              </button>
            )
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSubmitQuiz}
            disabled={!selectedOption || quizAnswered}
            className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors"
          >
            {quizAnswered ? "Quiz completado" : "Enviar respuestas"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharlasView;