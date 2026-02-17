"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { PlayCircle, CheckCircle2, Clock, Video, File, Edit3 } from "lucide-react";
import EditCharlaModal, { EditCharlaData } from "@/components/EditCharlaModal";

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


const defaultEditCharla = (charla: Charla): EditCharlaData => ({
  id: charla.id,
  titulo: charla.titulo,
  categoria: charla.categoria,
  duracionMin: charla.duracionMin,
  markdown: "## Título Principal\nEscribe el contenido en markdown...",
  videoUrl: "",
  portadaUrl: "",
  quizPregunta: "",
  quizOpciones: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
  quizCorrecta: 0,
});

const CharlasAdminView = () => {
  const [charlas, setCharlas] = useState<Charla[]>(charlasMock);
  const [editOpen, setEditOpen] = useState(false);
  const [editCharla, setEditCharla] = useState<EditCharlaData | null>(null);

  const totalCharlas = charlas.length;
  const completadas = charlas.filter((c) => c.estado === "completada").length;
  const progresoGlobal = Math.round((completadas / totalCharlas) * 100);

  const handleOpenCharla = (charla: Charla) => {
    window.open("https://drive.google.com", "_blank");
    if (charla.estado !== "completada") {
      setCharlas((prev) =>
        prev.map((c) =>
          c.id === charla.id ? { ...c, estado: "completada" } : c
        )
      );
    }
  };

  const handleEdit = (charla: Charla) => {
    setEditCharla(defaultEditCharla(charla));
    setEditOpen(true);
  };

  const handleSaveEdit = (data: EditCharlaData) => {
    setCharlas((prev) => prev.map((c) => c.id === data.id ? {
      ...c,
      titulo: data.titulo,
      categoria: data.categoria,
      duracionMin: data.duracionMin,
    } : c));
    setEditOpen(false);
  };

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const categorias = ["Todos", ...Array.from(new Set(charlasMock.map(f => f.categoria)))];

  const charlasFiltradas = charlas.filter((charla) => {
    const coincideBusqueda = charla.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === "Todos" || charla.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-gradient-to from-[#F5FAFF] via-white to-[#F0F9FF]">
        <div className="max-w-6xl mx-auto py-8 space-y-8">
          {/* Buscador y Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" stroke="#b0b8c1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <input
                type="text"
                placeholder="Buscar charla..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-base font-inter"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            {/* Filtro por categoría */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 6h16M8 12h8m-4 6h.01" stroke="#00BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-full border border-[#00BFFF] bg-white focus:outline-none focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent appearance-none cursor-pointer text-base font-inter min-w-[140px] text-[#003366] font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
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
          <div className="space-y-5 mt-4">
            {charlasFiltradas.map((charla) => {
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
                  style={{ fontFamily: 'Inter, sans-serif' }}
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

                  {/* Botón editar */}
                  <button
                    onClick={() => handleEdit(charla)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F7FA] text-[#003366] font-semibold shadow border border-cyan-100 hover:bg-[#00BFFF] hover:text-white transition mr-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    <Edit3 className="w-5 h-5" /> Editar
                  </button>

                  {/* Botón mejorado */}
                  <button
                    onClick={() => handleOpenCharla(charla)}
                    className={`px-8 py-3 rounded-full ${buttonClass} text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {buttonLabel}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EditCharlaModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        charla={editCharla}
        onSave={handleSaveEdit}
      />
    </LayoutComponent>
  );
};

export default CharlasAdminView;
