import { useState } from "react";
import LayoutComponent from "../components/layoutComponent";
import ArchivoModal from "@/components/modals/registro/archivoModal";
import { useAuthContext } from "@/context/AuthContext";
import {
  ChevronLeft,
  CalendarDays,
  Table2,
  Lock,
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
const isMonthLocked = (i: number) => i > currentMonth;
const isWeekLocked = (i: number, d: number) => {
  if (i > currentMonth) return true;
  if (i < currentMonth) return false;
  return d > currentDay;
};

// Nombre del tipoDoc que se usará como carpeta en Drive para la capacitación mensual
const TIPO_CAPACITACION = "Capacitación Mensual";

const RegistroView = () => {
  const { user } = useAuthContext();

  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [modalTipoFijo, setModalTipoFijo] = useState<string | undefined>(
    undefined,
  );

  const handleWeekClick = (label: string, locked: boolean) => {
    if (locked) return;
    setSelectedWeek(label);
    setModalTipoFijo(undefined); // modal normal con grid de opciones
    setModalOpen(true);
  };

  const handleMonthClick = (month: MonthData) => {
    if (isMonthLocked(month.monthIndex)) return;
    setSelectedMonth(month);
  };

  // Botón de capacitación mensual → abre el modal directo al file picker
  const handleCapacitacion = () => {
    setSelectedWeek(null);
    setModalTipoFijo(TIPO_CAPACITACION);
    setModalOpen(true);
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* — NIVEL 1: Grid de meses — */}
        {!selectedMonth && (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Registro de Documentos
              </h1>
              <p className="text-gray-600">
                Selecciona el mes al que deseas subir documentos
              </p>
            </div>

            <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 md:p-12 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]" />
              <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]" />
              <div className="relative z-10 gap-5 flex-col flex md:flex-row justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-300 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                      <Table2 size={20} className="text-[#003366]" />
                    </div>
                    <span className="text-[#003366] font-semibold text-sm uppercase tracking-wider">
                      CUADRO DE CONTROL
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-black">
                    ¿Ya subiste todos los documentos de este mes?
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Revisa tu progreso en el Cuadro de Control
                  </p>
                </div>
                <Link
                  href="/registro/cuadro-control"
                  className="bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-6 py-3 rounded-full flex items-center gap-2 whitespace-nowrap ml-6 shadow-lg transition-all hover:scale-105"
                >
                  Ver Cuadro
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
              {MONTHS.map((month) => {
                const locked = isMonthLocked(month.monthIndex);
                return (
                  <button
                    key={month.name}
                    onClick={() => handleMonthClick(month)}
                    disabled={locked}
                    className={`rounded-2xl border shadow-sm transition-all duration-200 p-6 flex flex-col items-center gap-3 group ${locked ? "bg-gray-200 border-gray-100 cursor-not-allowed opacity-40" : "bg-white border-gray-100 hover:shadow-md hover:border-cyan-300 cursor-pointer"}`}
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

        {/* — NIVEL 2: Semanas + Capacitación mensual — */}
        {selectedMonth && (
          <>
            <div className="mb-8">
              <button
                onClick={() => setSelectedMonth(null)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-5"
              >
                <ChevronLeft size={16} /> Volver a meses
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedMonth.name}
              </h1>
              <p className="text-gray-600">
                Selecciona la semana para subir los documentos
              </p>
            </div>

            {/* Capacitación mensual — ahora abre el modal con tipoFijo */}
            <div className="mb-6">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">
                Documento mensual
              </p>
              <button
                onClick={handleCapacitacion}
                className="bg-amber-50 border border-amber-200 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 hover:bg-amber-100 transition-all duration-200 p-5 flex items-center gap-4 group w-full sm:w-auto"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-500 flex items-center justify-center transition-colors shrink-0">
                  <GraduationCap
                    size={20}
                    className="text-amber-500 group-hover:text-white transition-colors"
                  />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-amber-700">
                    Subir Capacitación Mensual
                  </p>
                  <p className="text-xs text-amber-400 mt-0.5">
                    {selectedMonth.name} — Click para seleccionar archivo
                  </p>
                </div>
              </button>
            </div>

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
                    className={`rounded-2xl border shadow-sm transition-all duration-200 p-6 flex flex-col items-center gap-3 group ${locked ? "bg-gray-200 border-gray-100 cursor-not-allowed opacity-40" : "bg-white border-gray-100 hover:shadow-md hover:border-cyan-300 cursor-pointer"}`}
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

      {/* Modal — tipoFijo activa el modo capacitación directa */}
      <ArchivoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        weekLabel={selectedWeek ?? ""}
        monthName={selectedMonth?.name ?? ""}
        brigada={user?.sede ?? ""}
        tipoFijo={modalTipoFijo}
      />
    </LayoutComponent>
  );
};

export default RegistroView;
