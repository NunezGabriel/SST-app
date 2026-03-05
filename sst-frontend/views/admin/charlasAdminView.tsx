"use client";

import { useState, useMemo, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import EditCharlaModal, {
  CharlaFormData,
} from "@/components/modals/charla/editCharlaModal";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import { useUserAdminContext } from "@/context/UserAdminContext";
import type { Charla } from "@/lib/api/charlas";

import {
  FileText,
  CheckCircle2,
  Clock,
  File,
  Search,
  Pencil,
  Users,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

const CharlasAdminView = () => {
  const { usuarios } = useUserAdminContext();
  const workersActivos = usuarios.filter((u) => u.activo).length;
  const {
    charlas,
    isLoading,
    error,
    createCharla,
    updateCharla,
    deleteCharla,
  } = useCharlaAdminContext();
  const [mesActivo, setMesActivo] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [charlaEditando, setCharlaEditando] = useState<Charla | null>(null);

  // Obtener fecha de hoy (sin hora)
  const getFechaHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
  };

  // Normalizar fecha: extrae siempre los primeros 10 chars (YYYY-MM-DD)
  // de cualquier formato ISO o date-only, y construye una fecha LOCAL.
  // Esto evita el desfase de zona horaria en getMonth/getDate/comparaciones.
  const normalizarFecha = (fechaString: string): Date => {
    const soloFecha = fechaString.substring(0, 10); // "YYYY-MM-DD"
    const [year, month, day] = soloFecha.split('-').map(Number);
    return new Date(year, month - 1, day); // mes 0-indexed, hora 00:00 local
  };

  const mesesConCharlas = useMemo(() => {
    const set = new Set<number>();
    charlas.forEach((c) => {
      const fecha = normalizarFecha(c.fechaCharla);
      set.add(fecha.getMonth());
    });
    return set;
  }, [charlas]);

  // Separar charlas en disponibles (hasta hoy) y futuras (desde mañana)
  const { charlasDisponibles, charlasFuturas } = useMemo(() => {
    const hoy = getFechaHoy();
    const disponibles: Charla[] = [];
    const futuras: Charla[] = [];

    charlas.forEach((c) => {
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
  }, [charlas, mesActivo, busqueda]);

  // Combinar ambas listas: disponibles primero, luego futuras
  const todasLasCharlas = [...charlasDisponibles, ...charlasFuturas];

  // Paginación
  const totalPaginas = Math.ceil(todasLasCharlas.length / ITEMS_POR_PAGINA);
  const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const fin = inicio + ITEMS_POR_PAGINA;
  const charlasFiltradas = todasLasCharlas.slice(inicio, fin);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [mesActivo, busqueda]);

  const handleEditarClick = (charla: Charla) => {
    setCharlaEditando(charla);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCharlaEditando(null);
  };

  const handleSave = async (data: CharlaFormData) => {
    if (!charlaEditando) return;
    try {
      // El modal solo envía nombre y enlace, pero necesitamos mantener fechaCharla y etiqueta
      await updateCharla(charlaEditando.id, {
        nombre: data.nombre,
        enlace: data.enlace,
        fechaCharla: charlaEditando.fechaCharla,
        etiqueta: charlaEditando.etiqueta || null,
      });
      handleCloseModal();
    } catch (err: any) {
      alert(err.message || "Error al guardar cambios");
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
              charlas.filter((c) => {
                const soloFecha = c.fechaCharla.substring(0, 10);
                const [y, m] = soloFecha.split('-').map(Number);
                return m - 1 === new Date().getMonth();
              }).length
            }
            showProgressBar={false}
            showIcon
            icon={Clock}
            iconColor="text-blue-500"
          />
          <KpiComponent
            title="Workers Asignados"
            value={String(workersActivos)}
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
            <>
              {/* Separador si hay charlas disponibles y futuras */}
              {charlasDisponibles.length > 0 && charlasFuturas.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-sm font-semibold text-gray-500 mb-4">
                    Charlas Disponibles
                  </h2>
                </div>
              )}

              {charlasFiltradas.map((charla) => {
                // Determinar si está en la sección de disponibles o futuras
                const esDisponible = charlasDisponibles.includes(charla);
                const indiceEnLista = charlasFiltradas.indexOf(charla);
                const esPrimeraFutura =
                  !esDisponible && indiceEnLista === charlasDisponibles.length;

                const fechaObj = normalizarFecha(charla.fechaCharla);
                const fechaLabel = fechaObj.toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                });

                const esFutura = (() => {
                  const fecha = normalizarFecha(charla.fechaCharla);
                  const hoy = getFechaHoy();
                  return fecha > hoy;
                })();

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
                    <div
                      className={`group rounded-2xl shadow-sm border-2 px-6 py-5 flex items-center justify-between gap-6 transition-all ${
                        esFutura
                          ? "bg-gray-50 border-gray-200 opacity-75"
                          : "bg-white border-gray-100 hover:border-cyan-300 hover:shadow-md"
                      }`}
                    >
                      {/* Icono */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform ${
                          esFutura
                            ? "bg-gray-200 text-gray-400"
                            : "bg-blue-100 text-[#003366]"
                        }`}
                      >
                        <FileText className="w-6 h-6" />
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
                          {esFutura && (
                            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 text-xs font-semibold">
                              Próximamente
                            </span>
                          )}
                        </div>
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

                      {/* Botones */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditarClick(charla)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-[#003366] text-white hover:bg-[#004080] shadow transition-all hover:scale-105 whitespace-nowrap"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                      </div>
                    </div>
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
