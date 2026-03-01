import LayoutComponent from "../components/layoutComponent";
import { CheckCircle2, XCircle, Lock } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Estado = "COMPLETO" | "FALTA" | "BLOQUEADO";

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

// 4 semanas fijas por mes
const SEMANAS = (m: string) => [
  `01 - 07 ${m}`,
  `08 - 14 ${m}`,
  `15 - 21 ${m}`,
  `22 - fin ${m}`,
];

// Documentos que deben subirse cada semana (los 3 deben estar para ser COMPLETO)
// En real: verificar en DB que los 3 existen para esa brigada+semana
const WORKER_SEMANA_DOCS = [
  "Licencia / SOAT / Bitácora",
  "Control de Salud",
  "ATS - Charla 5 min",
];

// Mock: verde solo si "todos los docs de esa semana están subidos"
// Reemplazar: consultar si brigada+mes+semana tiene los 3 docs
const mockSemana = (
  brigada: string,
  semIdx: number,
  monthIndex: number,
): Estado => {
  const h = (brigada.charCodeAt(0) * 3 + semIdx * 17 + monthIndex * 7) % 10;
  // Simula que COMPLETO = todos los docs subidos
  return h > 4 ? "COMPLETO" : "FALTA";
};

const mockMensual = (brigada: string, monthIndex: number): Estado => {
  const h = (brigada.charCodeAt(1) * 5 + monthIndex * 11) % 10;
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

const MonthTable = ({
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
                  key={`header-${monthIndex}-${i}`}
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
                key={`${monthIndex}-${brigada}`}
                className={bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-100 bg-blue-50/60 whitespace-nowrap text-xs">
                  {brigada}
                </td>
                {semanas.map((_, semIdx) => {
                  const estado: Estado = locked
                    ? "BLOQUEADO"
                    : mockSemana(brigada, semIdx, monthIndex);
                  return (
                    <EstadoCell
                      key={`${monthIndex}-${brigada}-sem-${semIdx}`}
                      estado={estado}
                    />
                  );
                })}
                {(() => {
                  const estado: Estado = locked
                    ? "BLOQUEADO"
                    : mockMensual(brigada, monthIndex);
                  return (
                    <EstadoCell
                      key={`${monthIndex}-${brigada}-mensual`}
                      estado={estado}
                    />
                  );
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda de docs requeridos por semana */}
      {!locked && (
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          ✓ Completo = todos los docs subidos: {WORKER_SEMANA_DOCS.join(" · ")}
        </p>
      )}
    </div>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────

const CuadroControlView = () => (
  <LayoutComponent>
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Cuadro de Control
        </h1>
        <p className="text-gray-600">
          Registro mensual de documentos por brigada
        </p>
      </div>
      {MONTHS.map((month, i) => (
        <MonthTable key={month} monthName={month} monthIndex={i} />
      ))}
    </div>
  </LayoutComponent>
);

export default CuadroControlView;
