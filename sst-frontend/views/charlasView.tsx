"use client";

import { useState, useMemo, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  File,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Charla } from "@/lib/api/charlas";

// Total de charlas anuales
const TOTAL_CHARLAS_ANUALES = 365;
// Items por página
const ITEMS_POR_PAGINA = 31;

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

const CharlasView = () => {
  const { charlasUsuario, isLoading, error, marcarCompletada } =
    useCharlaAdminContext();
  const [mesActivo, setMesActivo] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  // Obtener fecha de hoy (sin hora)
  const getFechaHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  };

  // Normalizar fecha desde string YYYY-MM-DD o ISO a Date local sin hora
  const normalizarFecha = (fechaString: string): Date => {
    // Si viene en formato YYYY-MM-DD, crear fecha local directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
      const [year, month, day] = fechaString.split('-').map(Number);
      const fecha = new Date(year, month - 1, day); // month es 0-indexed
      fecha.setHours(0, 0, 0, 0);
      return fecha;
    }
    // Si viene en formato ISO, convertir y normalizar
    const fecha = new Date(fechaString);
    fecha.setHours(0, 0, 0, 0);
    return fecha;
  };

  // Función para verificar si una charla es del futuro (desde mañana)
  const esCharlaFutura = (fechaCharla: string): boolean => {
    const fecha = normalizarFecha(fechaCharla);
    const hoy = getFechaHoy();
    return fecha > hoy;
  };

  // Función para verificar si una charla puede ser completada (fecha <= fecha actual)
  const puedeCompletar = (fechaCharla: string): boolean => {
    const fecha = normalizarFecha(fechaCharla);
    const hoy = getFechaHoy();
    return fecha <= hoy;
  };

  // Meses que tienen charlas
  const mesesConCharlas = useMemo(() => {
    const set = new Set<number>();
    charlasUsuario.forEach((c) => {
      const fecha = normalizarFecha(c.fechaCharla);
      set.add(fecha.getMonth());
    });
    return set;
  }, [charlasUsuario]);

  // Separar charlas en disponibles (hasta hoy) y futuras (desde mañana)
  const { charlasDisponibles, charlasFuturas } = useMemo(() => {
    const hoy = getFechaHoy();
    const disponibles: Charla[] = [];
    const futuras: Charla[] = [];

    charlasUsuario.forEach((c) => {
      const fecha = normalizarFecha(c.fechaCharla);
      const coincideMes =
        mesActivo === null || fecha.getMonth() === mesActivo;
      const coincideBusqueda = c.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      if (coincideMes && coincideBusqueda) {
        if (fecha <= hoy) {
          disponibles.push(c);
        } else {
          futuras.push(c);
        }
      }
    });

    // Ordenar disponibles: más reciente primero (descendente)
    disponibles.sort((a, b) => {
      const fechaA = normalizarFecha(a.fechaCharla).getTime();
      const fechaB = normalizarFecha(b.fechaCharla).getTime();
      return fechaB - fechaA;
    });

    // Ordenar futuras: más próxima primero (ascendente)
    futuras.sort((a, b) => {
      const fechaA = normalizarFecha(a.fechaCharla).getTime();
      const fechaB = normalizarFecha(b.fechaCharla).getTime();
      return fechaA - fechaB;
    });

    return { charlasDisponibles: disponibles, charlasFuturas: futuras };
  }, [charlasUsuario, mesActivo, busqueda]);

  // Combinar ambas listas: disponibles primero, luego futuras
  const todasLasCharlas = [...charlasDisponibles, ...charlasFuturas];

  // Paginación
  const totalPaginas = Math.ceil(todasLasCharlas.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const charlasPaginadas = todasLasCharlas.slice(inicio, fin);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [mesActivo, busqueda]);

  // KPIs basados en 365 charlas anuales
  // Solo contar las completadas de charlas disponibles (hasta hoy)
  const totalCharlas = TOTAL_CHARLAS_ANUALES;
  const completadas = charlasDisponibles.filter(
    (c) => c.estado === "COMPLETADA"
  ).length;
  const progresoGlobal = Math.round((completadas / totalCharlas) * 100);

  const handleOpenCharla = async (charla: Charla) => {
    // Abrir enlace
    window.open(charla.enlace, "_blank");

    // Solo marcar como completada si:
    // 1. No está ya completada
    // 2. La fecha de la charla es <= fecha actual
    if (
      charla.estado !== "COMPLETADA" &&
      puedeCompletar(charla.fechaCharla)
    ) {
      try {
        await marcarCompletada(charla.id);
      } catch (err: any) {
        console.error("Error al marcar charla como completada:", err);
        alert(err.message || "Error al marcar charla como completada");
      }
    }
  };

  if (isLoading) {
    return (
      <LayoutComponent>
        <div className="text-center py-12">Cargando charlas...</div>
      </LayoutComponent>
    );
  }

  if (error) {
    return (
      <LayoutComponent>
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="max-w-5xl mx-auto py-8 space-y-8">
        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#003366] flex items-center justify-center shadow-lg">
            <File className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#022B54]">
              Charlas de 5 Minutos
            </h1>
            <p className="text-gray-500 text-base mt-1">
              Capacitaciones anuales de seguridad laboral
            </p>
          </div>
        </div>

        {/* ── KPIs ── */}
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
            title="Progreso Anual"
            value={`${progresoGlobal}%`}
            percentage={progresoGlobal}
            showProgressBar
            showIcon
            icon={Clock}
            iconColor="text-blue-500"
          />
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
          {/* Búsqueda */}
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

          {/* Meses */}
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
          {todasLasCharlas.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <File className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">
                No hay charlas para los filtros seleccionados
              </p>
            </div>
          ) : (
            <>
              {/* Separador si hay charlas disponibles y futuras */}
              {charlasDisponibles.length > 0 && charlasFuturas.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-sm font-semibold text-gray-500 mb-4">
                    Charlas Disponibles
                  </h2>
                </div>
              )}

              {/* Lista paginada */}
              {charlasPaginadas.map((charla) => {
                // Determinar si está en la sección de disponibles o futuras
                const esDisponible = charlasDisponibles.includes(charla);
                const indiceEnLista = todasLasCharlas.indexOf(charla);
                const esPrimeraFutura =
                  !esDisponible && indiceEnLista === charlasDisponibles.length;

                return (
                  <div key={charla.id}>
                    {/* Separador para primera charla futura */}
                    {esPrimeraFutura && charlasDisponibles.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <h2 className="text-sm font-semibold text-gray-500 mb-4">
                          Próximas Charlas
                        </h2>
                      </div>
                    )}
                    {(() => {
                      const isCompletada = charla.estado === "COMPLETADA";
                      const esFutura = esCharlaFutura(charla.fechaCharla);
                      const puedeCompletarCharla = puedeCompletar(
                        charla.fechaCharla
                      );
                      const fechaObj = normalizarFecha(charla.fechaCharla);
                      const fechaLabel = fechaObj.toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "long",
                      });

                      return (
                        <div
                          className={`group rounded-2xl shadow-sm border-2 px-6 py-5 flex items-center justify-between gap-6 transition-all ${
                            esFutura
                              ? "bg-gray-50 border-gray-200 opacity-75"
                              : "bg-white border-gray-100 hover:border-cyan-300 hover:shadow-md"
                          }`}
                        >
                          {/* Icono */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0 ${
                              esFutura
                                ? "bg-gray-200 text-gray-400"
                                : isCompletada
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-cyan-100 text-cyan-600"
                            }`}
                          >
                            {isCompletada ? (
                              <CheckCircle2 className="w-7 h-7" />
                            ) : (
                              <PlayCircle className="w-7 h-7" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h2
                                className={`text-base font-bold truncate ${
                                  esFutura ? "text-gray-500" : "text-gray-900"
                                }`}
                              >
                                {charla.nombre}
                              </h2>
                              {isCompletada && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                                  ✓ Completada
                                </span>
                              )}
                              {esFutura && (
                                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                                  Próximamente
                                </span>
                              )}
                            </div>
                            <div
                              className={`flex items-center gap-4 text-xs ${
                                esFutura ? "text-gray-400" : "text-gray-400"
                              }`}
                            >
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> 5 min
                              </span>
                              <span>📅 {fechaLabel}</span>
                            </div>
                          </div>

                          {/* Botón */}
                          <button
                            onClick={() => handleOpenCharla(charla)}
                            disabled={false}
                            className={`px-6 py-2.5 rounded-full font-bold text-sm text-white shadow transition-all hover:scale-105 whitespace-nowrap ${
                              esFutura
                                ? "bg-gray-400 hover:bg-gray-500"
                                : isCompletada
                                  ? "bg-emerald-500 hover:bg-emerald-600"
                                  : "bg-cyan-500 hover:bg-cyan-600"
                            }`}
                          >
                            {isCompletada
                              ? "Revisar"
                              : esFutura
                                ? "Ver"
                                : "Comenzar"}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
                disabled={paginaActual === 1}
                className={`p-2 rounded-lg border transition-all ${
                  paginaActual === 1
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-cyan-300"
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (pagina) => {
                    // Mostrar solo páginas cercanas a la actual
                    if (
                      pagina === 1 ||
                      pagina === totalPaginas ||
                      (pagina >= paginaActual - 1 && pagina <= paginaActual + 1)
                    ) {
                      return (
                        <button
                          key={pagina}
                          onClick={() => setPaginaActual(pagina)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            pagina === paginaActual
                              ? "bg-[#003366] text-white"
                              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-cyan-300"
                          }`}
                        >
                          {pagina}
                        </button>
                      );
                    } else if (
                      pagina === paginaActual - 2 ||
                      pagina === paginaActual + 2
                    ) {
                      return (
                        <span key={pagina} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                )}
              </div>

              <button
                onClick={() =>
                  setPaginaActual((p) => Math.min(totalPaginas, p + 1))
                }
                disabled={paginaActual === totalPaginas}
                className={`p-2 rounded-lg border transition-all ${
                  paginaActual === totalPaginas
                    ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-cyan-300"
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Footer count */}
          {todasLasCharlas.length > 0 && (
            <p className="text-center text-xs text-gray-400">
              Mostrando {inicio + 1}-{Math.min(fin, todasLasCharlas.length)} de{" "}
              {todasLasCharlas.length} charlas
              {charlasDisponibles.length > 0 && charlasFuturas.length > 0 && (
                <span className="ml-2">
                  ({charlasDisponibles.length} disponibles,{" "}
                  {charlasFuturas.length} próximas)
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </LayoutComponent>
  );
};

export default CharlasView;
