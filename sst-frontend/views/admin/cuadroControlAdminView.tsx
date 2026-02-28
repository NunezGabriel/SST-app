import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { CheckCircle2, XCircle, Lock, Users, ShieldCheck } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Estado = "COMPLETO" | "FALTA" | "BLOQUEADO";
type Vista = "WORKER" | "ADMIN";

// ─── Datos hardcodeados — reemplazar con fetch a DB ───────────────────────────

const BRIGADAS = ["CHICLAYO", "CHIMBOTE", "HUANCABAMBA", "JAÉN", "TRUJILLO"];

const MONTHS = [
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

const SEMANAS = (m: string) => [
  `01 - 07 ${m}`,
  `08 - 14 ${m}`,
  `15 - 21 ${m}`,
  `22 - fin ${m}`,
];

// Docs requeridos para COMPLETO en cada semana
const WORKER_SEMANA_DOCS = [
  "Licencia / SOAT / Bitácora",
  "Control de Salud",
  "ATS - Charla 5 min",
];
const ADMIN_SEMANA_DOCS = [
  "Triaje",
  "Cargo de EPPs",
  "SCTR",
  "Listado de Personal",
  "Listado de Vehículos",
  "Vigilancia COVID",
];

// Mock — reemplazar con fetch real
const mockW = (brigada: string, semIdx: number, mIdx: number): Estado => {
  const h = (brigada.charCodeAt(0) * 3 + semIdx * 17 + mIdx * 7) % 10;
  return h > 4 ? "COMPLETO" : "FALTA";
};
const mockWMensual = (brigada: string, mIdx: number): Estado => {
  const h = (brigada.charCodeAt(1) * 5 + mIdx * 11) % 10;
  return h > 4 ? "COMPLETO" : "FALTA";
};
const mockA = (brigada: string, semIdx: number, mIdx: number): Estado => {
  const h = (brigada.charCodeAt(0) * 11 + semIdx * 13 + mIdx * 5) % 10;
  return h > 4 ? "COMPLETO" : "FALTA";
};

// ─── UI ───────────────────────────────────────────────────────────────────────

const today = new Date();
const currentMonth = today.getMonth();

const EstadoCell = ({ estado }: { estado: Estado }) => {
  if (estado === "BLOQUEADO")
    return (
      <td className="px-3 py-3 text-center border border-gray-100 bg-gray-50/80 w-28">
        <Lock size={13} className="text-gray-300 mx-auto" />
      </td>
    );
  if (estado === "COMPLETO")
    return (
      <td className="px-3 py-3 text-center border border-gray-100 bg-emerald-50 w-28">
        <div className="flex flex-col items-center gap-0.5">
          <CheckCircle2 size={16} className="text-emerald-500" />
          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">
            Completo
          </span>
        </div>
      </td>
    );
  return (
    <td className="px-3 py-3 text-center border border-gray-100 bg-red-50 w-28">
      <div className="flex flex-col items-center gap-0.5">
        <XCircle size={16} className="text-red-400" />
        <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide">
          Falta
        </span>
      </div>
    </td>
  );
};

// ─── Tabla Worker ─────────────────────────────────────────────────────────────

const WorkerMonthTable = ({
  monthName,
  monthIndex,
}: {
  monthName: string;
  monthIndex: number;
}) => {
  const locked = monthIndex > currentMonth;
  const semanas = SEMANAS(monthName);

  return (
    <div
      className={`mb-8 ${locked ? "opacity-40 pointer-events-none select-none" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {locked && <Lock size={12} className="text-gray-400" />}
        <h2
          className={`text-xs font-bold uppercase tracking-widest ${locked ? "text-gray-400" : "text-gray-600"}`}
        >
          {monthName} {today.getFullYear()}
        </h2>
        {!locked && monthIndex === currentMonth && (
          <span className="text-[10px] bg-cyan-100 text-cyan-600 font-bold px-2 py-0.5 rounded-full">
            Mes actual
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left font-bold text-white bg-[#003366] border-r border-blue-900 whitespace-nowrap min-w-[130px]">
                BRIGADA
              </th>
              {semanas.map((sem, i) => (
                <th
                  key={`wh-${monthIndex}-${i}`}
                  className="px-3 py-2.5 text-center font-semibold text-white bg-[#1a4d8f] border-r border-blue-800 whitespace-nowrap w-28 text-[10px] leading-tight"
                >
                  {sem}
                </th>
              ))}
              <th className="px-3 py-2.5 text-center font-semibold text-white bg-[#0f3460] whitespace-nowrap w-28 text-[10px] leading-tight">
                Capacitación
                <br />
                Mensual
              </th>
            </tr>
          </thead>
          <tbody>
            {BRIGADAS.map((brigada, bIdx) => (
              <tr
                key={`w-${monthIndex}-${brigada}`}
                className={bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-100 bg-blue-50/60 whitespace-nowrap text-xs">
                  {brigada}
                </td>
                {semanas.map((_, semIdx) => (
                  <EstadoCell
                    key={`w-${monthIndex}-${brigada}-${semIdx}`}
                    estado={
                      locked ? "BLOQUEADO" : mockW(brigada, semIdx, monthIndex)
                    }
                  />
                ))}
                <EstadoCell
                  key={`w-${monthIndex}-${brigada}-m`}
                  estado={
                    locked ? "BLOQUEADO" : mockWMensual(brigada, monthIndex)
                  }
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!locked && (
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          ✓ Completo = {WORKER_SEMANA_DOCS.join(" · ")}
        </p>
      )}
    </div>
  );
};

// ─── Tabla Admin ──────────────────────────────────────────────────────────────

const AdminMonthTable = ({
  monthName,
  monthIndex,
}: {
  monthName: string;
  monthIndex: number;
}) => {
  const locked = monthIndex > currentMonth;
  const semanas = SEMANAS(monthName);

  return (
    <div
      className={`mb-8 ${locked ? "opacity-40 pointer-events-none select-none" : ""}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {locked && <Lock size={12} className="text-gray-400" />}
        <h2
          className={`text-xs font-bold uppercase tracking-widest ${locked ? "text-gray-400" : "text-gray-600"}`}
        >
          {monthName} {today.getFullYear()}
        </h2>
        {!locked && monthIndex === currentMonth && (
          <span className="text-[10px] bg-purple-100 text-purple-600 font-bold px-2 py-0.5 rounded-full">
            Mes actual
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left font-bold text-white bg-[#3b0764] border-r border-purple-900 whitespace-nowrap min-w-[130px]">
                BRIGADA
              </th>
              {semanas.map((sem, i) => (
                <th
                  key={`ah-${monthIndex}-${i}`}
                  className="px-3 py-2.5 text-center font-semibold text-white bg-[#5b21b6] border-r border-purple-800 whitespace-nowrap w-28 text-[10px] leading-tight"
                >
                  {sem}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BRIGADAS.map((brigada, bIdx) => (
              <tr
                key={`a-${monthIndex}-${brigada}`}
                className={bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-100 bg-purple-50/60 whitespace-nowrap text-xs">
                  {brigada}
                </td>
                {semanas.map((_, semIdx) => (
                  <EstadoCell
                    key={`a-${monthIndex}-${brigada}-${semIdx}`}
                    estado={
                      locked ? "BLOQUEADO" : mockA(brigada, semIdx, monthIndex)
                    }
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!locked && (
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          ✓ Completo = {ADMIN_SEMANA_DOCS.join(" · ")}
        </p>
      )}
    </div>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────

const CuadroControlAdminView = () => {
  const [vista, setVista] = useState<Vista>("WORKER");

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cuadro de Control
          </h1>
          <p className="text-gray-600">
            Vista completa de registros por brigada
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setVista("WORKER")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              vista === "WORKER"
                ? "bg-[#003366] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <Users size={15} />
            Workers
          </button>
          <button
            onClick={() => setVista("ADMIN")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              vista === "ADMIN"
                ? "bg-[#3b0764] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <ShieldCheck size={15} />
            Admin
          </button>
        </div>

        {/* Tablas */}
        {vista === "WORKER" &&
          MONTHS.map((month, i) => (
            <WorkerMonthTable
              key={`worker-${month}`}
              monthName={month}
              monthIndex={i}
            />
          ))}
        {vista === "ADMIN" &&
          MONTHS.map((month, i) => (
            <AdminMonthTable
              key={`admin-${month}`}
              monthName={month}
              monthIndex={i}
            />
          ))}
      </div>
    </LayoutComponent>
  );
};

export default CuadroControlAdminView;
