"use client";

import { useState, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { useAuthContext } from "@/context/AuthContext";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Loader2,
  Users,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:8080";

type Estado = "COMPLETO" | "FALTA" | "BLOQUEADO" | "CARGANDO";
type Vista = "WORKER" | "ADMIN";

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
  `01 al 07 de ${m}`,
  `08 al 14 de ${m}`,
  `15 al 21 de ${m}`,
  `22 al 31 de ${m}`,
];
const WORKER_DOCS = [
  "Licencia / SOAT / Bitácora",
  "Control de Salud Diario",
  "ATS - Charla 5 min",
];
const ADMIN_DOCS = [
  "Triaje",
  "Cargo de EPPs",
  "SCTR",
  "Listado de Personal",
  "Listado de Vehículos",
  "Vigilancia COVID",
];

const today = new Date();
const currentMonth = today.getMonth();

// ─── Celda ────────────────────────────────────────────────────────────────────
const EstadoCell = ({ estado }: { estado: Estado }) => {
  if (estado === "BLOQUEADO")
    return (
      <td className="px-3 py-3 text-center border border-gray-100 bg-gray-50/80 w-28">
        <Lock size={13} className="text-gray-300 mx-auto" />
      </td>
    );
  if (estado === "CARGANDO")
    return (
      <td className="px-3 py-3 text-center border border-gray-100 w-28">
        <Loader2 size={13} className="text-gray-300 mx-auto animate-spin" />
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

// ─── Tabla genérica ───────────────────────────────────────────────────────────
const MonthTable = ({
  monthName,
  monthIndex,
  rol,
  token,
  docs,
  conMensual,
  accentClass,
}: {
  monthName: string;
  monthIndex: number;
  rol: Vista;
  token: string;
  docs: string[];
  conMensual: boolean;
  accentClass: {
    header: string;
    subheader: string;
    mensual: string;
    brigCell: string;
    badge: string;
    badgeText: string;
  };
}) => {
  const locked = monthIndex > currentMonth;
  const semanas = SEMANAS(monthName);

  const [estadoMes, setEstadoMes] = useState<Record<
    string,
    Record<string, boolean>
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locked || !token) return;
    setIsLoading(true);
    axios
      .get(`${API_URL}/api/drive/estado-mes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { mes: monthName, rol },
      })
      .then((res) => setEstadoMes(res.data.estado))
      .catch(() => setEstadoMes(null))
      .finally(() => setIsLoading(false));
  }, [monthName, rol, locked, token]);

  const getEstado = (brigada: string, key: string): Estado => {
    if (locked) return "BLOQUEADO";
    if (isLoading || !estadoMes) return "CARGANDO";
    return estadoMes[brigada]?.[key] ? "COMPLETO" : "FALTA";
  };

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
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${accentClass.badge} ${accentClass.badgeText}`}
          >
            Mes actual
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th
                className={`px-4 py-2.5 text-left font-bold text-white ${accentClass.header} border-r border-opacity-30 whitespace-nowrap min-w-[130px]`}
              >
                BRIGADA
              </th>
              {semanas.map((sem, i) => (
                <th
                  key={i}
                  className={`px-3 py-2.5 text-center font-semibold text-white ${accentClass.subheader} border-r border-opacity-20 whitespace-nowrap w-28 text-[10px] leading-tight`}
                >
                  {sem}
                </th>
              ))}
              {conMensual && (
                <th
                  className={`px-3 py-2.5 text-center font-semibold text-white ${accentClass.mensual} whitespace-nowrap w-28 text-[10px] leading-tight`}
                >
                  Capacitación
                  <br />
                  Mensual
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {BRIGADAS.map((brigada, bIdx) => (
              <tr
                key={brigada}
                className={bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td
                  className={`px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-100 ${accentClass.brigCell} whitespace-nowrap text-xs`}
                >
                  {brigada}
                </td>
                {semanas.map((sem) => (
                  <EstadoCell key={sem} estado={getEstado(brigada, sem)} />
                ))}
                {conMensual && (
                  <EstadoCell estado={getEstado(brigada, "mensual")} />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!locked && (
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          ✓ Completo = {docs.join(" · ")}
        </p>
      )}
    </div>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────
const CuadroControlAdminView = () => {
  const { user } = useAuthContext();
  const [vista, setVista] = useState<Vista>("WORKER");

  const workerAccent = {
    header: "bg-[#003366]",
    subheader: "bg-[#1a4d8f]",
    mensual: "bg-[#0f3460]",
    brigCell: "bg-blue-50/60",
    badge: "bg-cyan-100",
    badgeText: "text-cyan-600",
  };
  const adminAccent = {
    header: "bg-[#3b0764]",
    subheader: "bg-[#5b21b6]",
    mensual: "bg-[#3b0764]",
    brigCell: "bg-purple-50/60",
    badge: "bg-purple-100",
    badgeText: "text-purple-600",
  };

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
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${vista === "WORKER" ? "bg-[#003366] text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <Users size={15} /> Workers
          </button>
          <button
            onClick={() => setVista("ADMIN")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${vista === "ADMIN" ? "bg-[#3b0764] text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
          >
            <ShieldCheck size={15} /> Admin
          </button>
        </div>

        {/* Tablas */}
        {MONTHS.map((month, i) => (
          <MonthTable
            key={`${vista}-${month}`}
            monthName={month}
            monthIndex={i}
            rol={vista}
            token={user?.token ?? ""}
            docs={vista === "WORKER" ? WORKER_DOCS : ADMIN_DOCS}
            conMensual={vista === "WORKER"}
            accentClass={vista === "WORKER" ? workerAccent : adminAccent}
          />
        ))}
      </div>
    </LayoutComponent>
  );
};

export default CuadroControlAdminView;
