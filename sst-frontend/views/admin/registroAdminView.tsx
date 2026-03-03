import { useState } from "react";
import LayoutComponent from "../../components/layoutComponent";
import ArchivoModal from "@/components/modals/registro/archivoModal";
import { useAuthContext } from "@/context/AuthContext";
import {
  ChevronLeft,
  CalendarDays,
  Table2,
  Lock,
  Link2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

interface WeekData {
  label: string;
  startDay: number;
}

interface MonthData {
  name: string;
  monthIndex: number;
  weeks: WeekData[];
}

const MONTHS: MonthData[] = [
  {
    name: "Enero",
    monthIndex: 0,
    weeks: [
      { label: "01 al 07 de Enero", startDay: 1 },
      { label: "08 al 14 de Enero", startDay: 8 },
      { label: "15 al 21 de Enero", startDay: 15 },
      { label: "22 al 31 de Enero", startDay: 22 },
    ],
  },
  {
    name: "Febrero",
    monthIndex: 1,
    weeks: [
      { label: "01 al 07 de Febrero", startDay: 1 },
      { label: "08 al 14 de Febrero", startDay: 8 },
      { label: "15 al 21 de Febrero", startDay: 15 },
      { label: "22 al 28 de Febrero", startDay: 22 },
    ],
  },
  {
    name: "Marzo",
    monthIndex: 2,
    weeks: [
      { label: "01 al 07 de Marzo", startDay: 1 },
      { label: "08 al 14 de Marzo", startDay: 8 },
      { label: "15 al 21 de Marzo", startDay: 15 },
      { label: "22 al 31 de Marzo", startDay: 22 },
    ],
  },
  {
    name: "Abril",
    monthIndex: 3,
    weeks: [
      { label: "01 al 07 de Abril", startDay: 1 },
      { label: "08 al 14 de Abril", startDay: 8 },
      { label: "15 al 21 de Abril", startDay: 15 },
      { label: "22 al 30 de Abril", startDay: 22 },
    ],
  },
  {
    name: "Mayo",
    monthIndex: 4,
    weeks: [
      { label: "01 al 07 de Mayo", startDay: 1 },
      { label: "08 al 14 de Mayo", startDay: 8 },
      { label: "15 al 21 de Mayo", startDay: 15 },
      { label: "22 al 31 de Mayo", startDay: 22 },
    ],
  },
  {
    name: "Junio",
    monthIndex: 5,
    weeks: [
      { label: "01 al 07 de Junio", startDay: 1 },
      { label: "08 al 14 de Junio", startDay: 8 },
      { label: "15 al 21 de Junio", startDay: 15 },
      { label: "22 al 30 de Junio", startDay: 22 },
    ],
  },
  {
    name: "Julio",
    monthIndex: 6,
    weeks: [
      { label: "01 al 07 de Julio", startDay: 1 },
      { label: "08 al 14 de Julio", startDay: 8 },
      { label: "15 al 21 de Julio", startDay: 15 },
      { label: "22 al 31 de Julio", startDay: 22 },
    ],
  },
  {
    name: "Agosto",
    monthIndex: 7,
    weeks: [
      { label: "01 al 07 de Agosto", startDay: 1 },
      { label: "08 al 14 de Agosto", startDay: 8 },
      { label: "15 al 21 de Agosto", startDay: 15 },
      { label: "22 al 31 de Agosto", startDay: 22 },
    ],
  },
  {
    name: "Septiembre",
    monthIndex: 8,
    weeks: [
      { label: "01 al 07 de Septiembre", startDay: 1 },
      { label: "08 al 14 de Septiembre", startDay: 8 },
      { label: "15 al 21 de Septiembre", startDay: 15 },
      { label: "22 al 30 de Septiembre", startDay: 22 },
    ],
  },
  {
    name: "Octubre",
    monthIndex: 9,
    weeks: [
      { label: "01 al 07 de Octubre", startDay: 1 },
      { label: "08 al 14 de Octubre", startDay: 8 },
      { label: "15 al 21 de Octubre", startDay: 15 },
      { label: "22 al 31 de Octubre", startDay: 22 },
    ],
  },
  {
    name: "Noviembre",
    monthIndex: 10,
    weeks: [
      { label: "01 al 07 de Noviembre", startDay: 1 },
      { label: "08 al 14 de Noviembre", startDay: 8 },
      { label: "15 al 21 de Noviembre", startDay: 15 },
      { label: "22 al 30 de Noviembre", startDay: 22 },
    ],
  },
  {
    name: "Diciembre",
    monthIndex: 11,
    weeks: [
      { label: "01 al 07 de Diciembre", startDay: 1 },
      { label: "08 al 14 de Diciembre", startDay: 8 },
      { label: "15 al 21 de Diciembre", startDay: 15 },
      { label: "22 al 31 de Diciembre", startDay: 22 },
    ],
  },
];

const today = new Date();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

const isMonthLocked = (monthIndex: number): boolean =>
  monthIndex > currentMonth;
const isWeekLocked = (monthIndex: number, startDay: number): boolean => {
  if (monthIndex > currentMonth) return true;
  if (monthIndex < currentMonth) return false;
  return startDay > currentDay;
};

const RegistroAdminView = () => {
  const { user } = useAuthContext();

  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const handleWeekClick = (label: string, locked: boolean) => {
    if (locked) return;
    setSelectedWeek(label);
    setModalOpen(true);
  };

  const handleMonthClick = (month: MonthData) => {
    if (isMonthLocked(month.monthIndex)) return;
    setSelectedMonth(month);
  };

  // Capacitación mensual admin — abre link directo
  // TODO: fetch link real de DB para este mes
  const handleCapacitacion = () => {
    window.open("#", "_blank");
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* — NIVEL 1: Grid de meses — */}
        {!selectedMonth && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Registro Admin
              </h1>
              <p className="text-gray-600">
                Gestiona los documentos y configura los links por semana
              </p>
            </div>

            {/* Banners en fila */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Banner: Cuadro de Control */}
              <div className="relative flex-1 bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]" />
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-300 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                        <Table2 size={18} className="text-[#003366]" />
                      </div>
                      <span className="text-[#003366] font-semibold text-xs uppercase tracking-wider">
                        CUADRO DE CONTROL
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-black mb-1">
                      ¿Ya subiste todos los documentos?
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Revisa el progreso del equipo
                    </p>
                  </div>
                  <Link
                    href="/registro/cuadro-control"
                    className="self-start bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                  >
                    Ver Cuadro
                  </Link>
                </div>
              </div>

              {/* Banner: Gestionar Links */}
              <div className="relative flex-1 bg-gradient-to from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500 opacity-20 rounded-full blur-[90px]" />
                <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                        <Link2 size={18} className="text-white" />
                      </div>
                      <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">
                        GESTIÓN DE LINKS
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Editar links por semana
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Cada semana tiene sus propios links de carga. Configúralos
                      aquí.
                    </p>
                  </div>
                  <Link
                    href="/registro/gestionar-links"
                    className="self-start bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105"
                  >
                    <Link2 size={15} />
                    Gestionar Links
                  </Link>
                </div>
              </div>
            </div>

            {/* Grid meses */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
              {MONTHS.map((month) => {
                const locked = isMonthLocked(month.monthIndex);
                return (
                  <button
                    key={month.name}
                    onClick={() => handleMonthClick(month)}
                    disabled={locked}
                    className={`rounded-2xl border shadow-sm transition-all duration-200 p-6 flex flex-col items-center gap-3 group
                      ${locked ? "bg-gray-200 border-gray-100 cursor-not-allowed opacity-40" : "bg-white border-gray-100 hover:shadow-md hover:border-cyan-300 cursor-pointer"}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${locked ? "bg-gray-200" : "bg-cyan-50 group-hover:bg-cyan-500"}`}
                    >
                      {locked ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : (
                        <CalendarDays
                          size={20}
                          className="text-cyan-500 group-hover:text-white transition-colors"
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold ${locked ? "text-gray-500" : "text-gray-800 group-hover:text-gray-900"}`}
                    >
                      {month.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {locked
                        ? "No disponible"
                        : `${month.weeks.length} semanas`}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* — NIVEL 2: Semanas del mes seleccionado — */}
        {selectedMonth && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setSelectedMonth(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
              >
                <ChevronLeft size={16} />
                Volver a meses
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedMonth.name}
              </h1>
              <p className="text-gray-600">
                Selecciona la semana — cada una tiene sus propios links
                configurados
              </p>
            </div>

            {/* Admin no tiene capacitación mensual — eso es solo de worker */}

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Documentos semanales
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedMonth.weeks.map((week) => {
                const locked = isWeekLocked(
                  selectedMonth.monthIndex,
                  week.startDay,
                );
                return (
                  <button
                    key={week.label}
                    onClick={() => handleWeekClick(week.label, locked)}
                    disabled={locked}
                    className={`rounded-2xl border shadow-sm transition-all duration-200 p-6 flex flex-col items-center gap-3 group
                      ${locked ? "bg-gray-200 border-gray-100 cursor-not-allowed opacity-40" : "bg-white border-gray-100 hover:shadow-md hover:border-cyan-300 cursor-pointer"}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${locked ? "bg-gray-200" : "bg-cyan-50 group-hover:bg-cyan-500"}`}
                    >
                      {locked ? (
                        <Lock size={16} className="text-gray-500" />
                      ) : (
                        <CalendarDays
                          size={20}
                          className="text-cyan-500 group-hover:text-white transition-colors"
                        />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold text-center leading-snug ${locked ? "text-gray-500" : "text-gray-800"}`}
                    >
                      {week.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal — user.rol es ADMIN entonces ArchivoModal mostrará los docs de admin automáticamente */}
      <ArchivoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        weekLabel={selectedWeek ?? ""}
        monthName={selectedMonth?.name ?? ""}
        brigada={user?.sede ?? ""}
      />
    </LayoutComponent>
  );
};

export default RegistroAdminView;
