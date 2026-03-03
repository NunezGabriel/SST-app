import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  ChevronLeft,
  CalendarDays,
  Users,
  ShieldCheck,
  GraduationCap,
  Link2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import EditArchivoModal from "@/components/modals/registro/editArchivoModal";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Rol = "WORKER" | "ADMIN";

interface WeekData {
  label: string;
  startDay: number;
}

interface MonthData {
  name: string;
  monthIndex: number;
  weeks: WeekData[];
}

// ─── Datos ────────────────────────────────────────────────────────────────────

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

const ROL_CONFIG: Record<
  Rol,
  {
    label: string;
    desc: string;
    icon: typeof Users;
    accent: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  WORKER: {
    label: "Worker",
    desc: "Links para documentos del trabajador",
    icon: Users,
    accent: "hover:border-cyan-300 hover:shadow-md",
    iconBg: "bg-cyan-50 group-hover:bg-cyan-500",
    iconColor: "text-cyan-500 group-hover:text-white",
  },
  ADMIN: {
    label: "Admin",
    desc: "Links para documentos administrativos",
    icon: ShieldCheck,
    accent: "hover:border-purple-300 hover:shadow-md",
    iconBg: "bg-purple-50 group-hover:bg-purple-500",
    iconColor: "text-purple-500 group-hover:text-white",
  },
};

// ─── Sub-componente: edición de link de capacitación mensual ─────────────────

const CapacitacionMensualEditor = ({ monthName }: { monthName: string }) => {
  const [link, setLink] = useState(""); // TODO: fetch de DB
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const startEdit = () => {
    setEditing(true);
    setDraft(link);
  };
  const cancel = () => setEditing(false);
  const confirm = () => {
    setLink(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">
        Documento mensual — {monthName}
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 max-w-2xl">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <GraduationCap size={18} className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-amber-700 mb-1">
            Capacitación Mensual
          </p>
          {editing ? (
            <input
              autoFocus
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirm();
                if (e.key === "Escape") cancel();
              }}
              placeholder="https://docs.google.com/..."
              className="w-full text-sm border border-amber-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-white"
            />
          ) : (
            <p
              className={`text-sm truncate ${link ? "text-gray-600" : "text-amber-300 italic"}`}
            >
              {link || "Sin link configurado"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {editing ? (
            <>
              <button
                onClick={confirm}
                className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
              >
                <Check size={15} className="text-emerald-600" />
              </button>
              <button
                onClick={cancel}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={15} className="text-gray-500" />
              </button>
            </>
          ) : (
            <button
              onClick={startEdit}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${saved ? "bg-emerald-100" : "bg-amber-100 hover:bg-amber-200"}`}
            >
              {saved ? (
                <Check size={15} className="text-emerald-600" />
              ) : (
                <Pencil size={14} className="text-amber-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────

type Step = "rol" | "mes" | "semana" | "editar";

const GestionarCarpetaView = () => {
  const [step, setStep] = useState<Step>("rol");
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeekData | null>(null);

  const goToRol = () => {
    setStep("rol");
    setSelectedRol(null);
    setSelectedMonth(null);
    setSelectedWeek(null);
  };
  const goToMes = () => {
    setStep("mes");
    setSelectedMonth(null);
    setSelectedWeek(null);
  };
  const goToSemana = () => {
    setStep("semana");
    setSelectedWeek(null);
  };

  const handleSelectRol = (rol: Rol) => {
    setSelectedRol(rol);
    setStep("mes");
  };
  const handleSelectMonth = (month: MonthData) => {
    setSelectedMonth(month);
    setStep("semana");
  };
  const handleSelectWeek = (week: WeekData) => {
    setSelectedWeek(week);
    setStep("editar");
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        {/* Header + Breadcrumb */}
        <div className="mb-8">
          {step !== "rol" && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 flex-wrap">
              <button
                onClick={goToRol}
                className="hover:text-gray-700 transition-colors"
              >
                Gestionar Carpetas
              </button>
              {selectedRol && (
                <>
                  <span>/</span>
                  <button
                    onClick={goToMes}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {ROL_CONFIG[selectedRol].label}
                  </button>
                </>
              )}
              {selectedMonth && (
                <>
                  <span>/</span>
                  <button
                    onClick={goToSemana}
                    className="hover:text-gray-700 transition-colors"
                  >
                    {selectedMonth.name}
                  </button>
                </>
              )}
              {selectedWeek && (
                <>
                  <span>/</span>
                  <span className="text-gray-600 font-medium">
                    {selectedWeek.label}
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            {step !== "rol" && (
              <button
                onClick={
                  step === "mes"
                    ? goToRol
                    : step === "semana"
                      ? goToMes
                      : goToSemana
                }
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ChevronLeft size={16} />
                Volver
              </button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {step === "rol" && "Gestionar Links"}
                {step === "mes" && `Links — ${ROL_CONFIG[selectedRol!].label}`}
                {step === "semana" && selectedMonth?.name}
                {step === "editar" && selectedWeek?.label}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {step === "rol" &&
                  "Selecciona el tipo de usuario cuyos links deseas gestionar"}
                {step === "mes" && "Selecciona el mes"}
                {step === "semana" &&
                  "Edita el link mensual o selecciona una semana"}
                {step === "editar" &&
                  `Editando links de ${ROL_CONFIG[selectedRol!].label.toLowerCase()} · ${selectedMonth?.name}`}
              </p>
            </div>
          </div>
        </div>

        {/* ── PASO 1: Elegir Rol ── */}
        {step === "rol" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            {(["WORKER", "ADMIN"] as Rol[]).map((rol) => {
              const cfg = ROL_CONFIG[rol];
              const Icon = cfg.icon;
              return (
                <button
                  key={rol}
                  onClick={() => handleSelectRol(rol)}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${cfg.accent} transition-all duration-200 p-8 flex flex-col items-center gap-4 group cursor-pointer`}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${cfg.iconBg}`}
                  >
                    <Icon
                      size={24}
                      className={`transition-colors ${cfg.iconColor}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">
                      {cfg.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{cfg.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── PASO 2: Elegir Mes ── */}
        {step === "mes" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {MONTHS.map((month) => (
              <button
                key={month.name}
                onClick={() => handleSelectMonth(month)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 p-6 flex flex-col items-center gap-3 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-50 group-hover:bg-cyan-500 flex items-center justify-center transition-colors">
                  <CalendarDays
                    size={20}
                    className="text-cyan-500 group-hover:text-white transition-colors"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900">
                  {month.name}
                </span>
                <span className="text-xs text-gray-400">
                  {month.weeks.length} semanas
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── PASO 3: Link mensual + Semanas ── */}
        {step === "semana" && selectedMonth && selectedRol === "WORKER" && (
          <>
            {/* Capacitación mensual — solo para WORKER */}
            <CapacitacionMensualEditor monthName={selectedMonth.name} />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Links semanales
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedMonth.weeks.map((week) => (
                <button
                  key={week.label}
                  onClick={() => handleSelectWeek(week)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 p-6 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-50 group-hover:bg-cyan-500 flex items-center justify-center transition-colors">
                    <CalendarDays
                      size={20}
                      className="text-cyan-500 group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 text-center leading-snug">
                    {week.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* PASO 3 para ADMIN — sin capacitación mensual */}
        {step === "semana" && selectedMonth && selectedRol === "ADMIN" && (
          <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Links semanales
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedMonth.weeks.map((week) => (
                <button
                  key={week.label}
                  onClick={() => handleSelectWeek(week)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all duration-200 p-6 flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-cyan-50 group-hover:bg-cyan-500 flex items-center justify-center transition-colors">
                    <CalendarDays
                      size={20}
                      className="text-cyan-500 group-hover:text-white transition-colors"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 text-center leading-snug">
                    {week.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── PASO 4: Editar links semanales ── */}
        {step === "editar" && selectedRol && selectedMonth && selectedWeek && (
          <EditArchivoModal
            rol={selectedRol}
            weekLabel={selectedWeek.label}
            monthName={selectedMonth.name}
          />
        )}
      </div>
    </LayoutComponent>
  );
};

export default GestionarCarpetaView;
