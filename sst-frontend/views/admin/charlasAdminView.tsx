"use client";

import { useState, useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import EditCharlaModal, {
  CharlaFormData,
} from "@/components/modals/editCharlaModal";

import {
  FileText,
  CheckCircle2,
  Clock,
  File,
  Search,
  Pencil,
  Users,
} from "lucide-react";

interface Charla {
  id: number;
  nombre: string;
  enlace: string;
  fechaCharla: string; // "YYYY-MM-DD"
}

const charlasMock: Charla[] = [
  {
    id: 1,
    nombre: "Uso Correcto de EPP en Altura",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-01-08",
  },
  {
    id: 2,
    nombre: "Riesgos Eléctricos Básicos",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-01-22",
  },
  {
    id: 3,
    nombre: "Ergonomía en el Trabajo",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-02-05",
  },
  {
    id: 4,
    nombre: "Primeros Auxilios Básicos",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-02-19",
  },
  {
    id: 5,
    nombre: "Manejo de Residuos Peligrosos",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-03-12",
  },
  {
    id: 6,
    nombre: "Prevención de Incendios",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-03-26",
  },
  {
    id: 7,
    nombre: "Señalización de Seguridad",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-04-09",
  },
  {
    id: 8,
    nombre: "Manejo de Cargas Pesadas",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-04-23",
  },
  {
    id: 9,
    nombre: "Equipos de Protección Auditiva",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-05-07",
  },
  {
    id: 10,
    nombre: "Control de Derrames Químicos",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-05-21",
  },
  {
    id: 11,
    nombre: "Seguridad Vial en Planta",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-06-04",
  },
  {
    id: 12,
    nombre: "Riesgos Biológicos en el Trabajo",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-06-18",
  },
  {
    id: 13,
    nombre: "Trabajos en Espacios Confinados",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-07-02",
  },
  {
    id: 14,
    nombre: "Estrés Laboral y Bienestar",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-07-16",
  },
  {
    id: 15,
    nombre: "Uso de Extintores",
    enlace: "https://drive.google.com",
    fechaCharla: "2025-08-06",
  },
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const CharlasAdminView = () => {
  const [charlas, setCharlas] = useState<Charla[]>(charlasMock);
  const [mesActivo, setMesActivo] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [charlaEditando, setCharlaEditando] = useState<Charla | null>(null);

  const mesesConCharlas = useMemo(() => {
    const set = new Set<number>();
    charlas.forEach((c) => set.add(new Date(c.fechaCharla).getMonth()));
    return set;
  }, [charlas]);

  const charlasFiltradas = useMemo(() => {
    return charlas.filter((c) => {
      const coincideMes =
        mesActivo === null || new Date(c.fechaCharla).getMonth() === mesActivo;
      const coincideBusqueda = c.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      return coincideMes && coincideBusqueda;
    });
  }, [charlas, mesActivo, busqueda]);

  const handleEditarClick = (charla: Charla) => {
    setCharlaEditando(charla);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCharlaEditando(null);
  };

  const handleSave = (data: CharlaFormData) => {
    if (!charlaEditando) return;
    setCharlas((prev) =>
      prev.map((c) => (c.id === charlaEditando.id ? { ...c, ...data } : c)),
    );
    handleCloseModal();
  };

  return (
    <LayoutComponent>
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#003366] flex items-center justify-center shadow-lg">
              <File className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#022B54]">
                Charlas de Seguridad
              </h1>
              <p className="text-gray-500 text-base mt-1">
                Gestión de capacitaciones anuales
              </p>
            </div>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiComponent
            title="Total Charlas"
            value={charlas.length}
            showProgressBar={false}
            showIcon
            icon={File}
            iconColor="text-cyan-500"
          />
          <KpiComponent
            title="Este Mes"
            value={
              charlas.filter(
                (c) =>
                  new Date(c.fechaCharla).getMonth() === new Date().getMonth(),
              ).length
            }
            showProgressBar={false}
            showIcon
            icon={Clock}
            iconColor="text-blue-500"
          />
          <KpiComponent
            title="Workers Asignados"
            value="42"
            showProgressBar={false}
            showIcon
            icon={Users}
            iconColor="text-emerald-500"
          />
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar charla..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Mes
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setMesActivo(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  mesActivo === null
                    ? "bg-[#003366] text-white border-[#003366]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                Todos
              </button>
              {MESES.map((mes, idx) => {
                const tieneCharlas = mesesConCharlas.has(idx);
                const activo = mesActivo === idx;
                return (
                  <button
                    key={mes}
                    disabled={!tieneCharlas}
                    onClick={() => setMesActivo(idx)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      !tieneCharlas
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : activo
                          ? "bg-[#003366] text-white border-[#003366]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-cyan-400 hover:text-cyan-600"
                    }`}
                  >
                    {mes.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Lista de charlas ── */}
        <div className="space-y-4">
          {charlasFiltradas.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <File className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">
                No hay charlas para los filtros seleccionados
              </p>
            </div>
          ) : (
            charlasFiltradas.map((charla) => {
              const fechaLabel = new Date(
                charla.fechaCharla,
              ).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "long",
              });

              return (
                <div
                  key={charla.id}
                  className="group bg-white rounded-2xl shadow-sm border-2 border-gray-100 hover:border-cyan-300 px-6 py-5 flex items-center justify-between gap-6 transition-all hover:shadow-md"
                >
                  {/* Icono */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 bg-blue-100 text-[#003366] group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>📅 {fechaLabel}</span>
                      <a
                        href={charla.enlace}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:underline truncate max-w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver en Drive →
                      </a>
                    </div>
                  </div>

                  {/* Botón editar */}
                  <button
                    onClick={() => handleEditarClick(charla)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-[#003366] text-white hover:bg-[#004080] shadow transition-all hover:scale-105 whitespace-nowrap"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer count */}
        {charlasFiltradas.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            Mostrando {charlasFiltradas.length} de {charlas.length} charlas
          </p>
        )}
      </div>

      {/* ── Modal ── */}
      <EditCharlaModal
        open={modalOpen}
        charla={
          charlaEditando
            ? {
                nombre: charlaEditando.nombre,
                enlace: charlaEditando.enlace,
              }
            : null
        }
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </LayoutComponent>
  );
};

export default CharlasAdminView;
