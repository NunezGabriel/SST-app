"use client";

import { useState, useEffect } from "react";
import LayoutComponent from "../components/layoutComponent";
import { useAuthContext } from "@/context/AuthContext";
import { CheckCircle2, XCircle, Lock, Loader2, Share2, ExternalLink } from "lucide-react";
import axios from "axios";
import { getSedesRequest, type Sede } from "@/lib/api/sedes";

const API_URL = "http://localhost:8080";

type Estado = "COMPLETO" | "FALTA" | "BLOQUEADO" | "CARGANDO";

const MONTHS      = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const SEMANAS     = (m: string) => [`01 al 07 de ${m}`,`08 al 14 de ${m}`,`15 al 21 de ${m}`,`22 al 31 de ${m}`];
const WORKER_DOCS = ["Licencia / SOAT / Bitácora","Control de Salud Diario","ATS - Charla 5 min"];

const today        = new Date();
const currentMonth = today.getMonth();

// ─── Celda ────────────────────────────────────────────────────────────────────
const EstadoCell = ({ estado }: { estado: Estado }) => {
  if (estado === "BLOQUEADO") return (
    <td className="px-3 py-3 text-center border border-gray-100 bg-gray-50/80 w-28">
      <Lock size={13} className="text-gray-300 mx-auto" />
    </td>
  );
  if (estado === "CARGANDO") return (
    <td className="px-3 py-3 text-center border border-gray-100 w-28">
      <Loader2 size={13} className="text-gray-300 mx-auto animate-spin" />
    </td>
  );
  if (estado === "COMPLETO") return (
    <td className="px-3 py-3 text-center border border-gray-100 bg-emerald-50 w-28">
      <div className="flex flex-col items-center gap-0.5">
        <CheckCircle2 size={16} className="text-emerald-500" />
        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Completo</span>
      </div>
    </td>
  );
  return (
    <td className="px-3 py-3 text-center border border-gray-100 bg-red-50 w-28">
      <div className="flex flex-col items-center gap-0.5">
        <XCircle size={16} className="text-red-400" />
        <span className="text-[9px] font-bold text-red-500 uppercase tracking-wide">Falta</span>
      </div>
    </td>
  );
};

// ─── Botón compartir ──────────────────────────────────────────────────────────
const ShareButton = ({ monthName, token }: { monthName: string; token: string }) => {
  const [loading, setLoading] = useState(false);
  const [link,    setLink]    = useState<string | null>(null);
  const [error,   setError]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  const fetchLink = async (): Promise<string | null> => {
    if (link) return link;
    setLoading(true); setError(false);
    try {
      const res = await axios.get(`${API_URL}/api/drive/link-mes`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { rol: "WORKER", mes: monthName },
      });
      setLink(res.data.link);
      return res.data.link;
    } catch {
      setError(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = await fetchLink();
    if (url) window.open(url, "_blank");
  };

  const handleCopy = async () => {
    const url = await fetchLink();
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={handleShare} disabled={loading}
        title={error ? "Carpeta no encontrada" : "Abrir carpeta del mes en Drive"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          error ? "bg-red-50 text-red-400 border border-red-200"
                : "bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border border-cyan-200 hover:border-cyan-300"
        }`}
      >
        {loading ? <Loader2 size={12} className="animate-spin" />
          : error  ? <XCircle size={12} />
          : link   ? <ExternalLink size={12} />
          :           <Share2 size={12} />}
        {error ? "No encontrada" : "Acceso a Drive"}
      </button>
      {!error && (
        <button onClick={handleCopy} disabled={loading}
          title="Copiar link del mes"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            copied
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200 hover:border-gray-300"
          }`}
        >
          {copied ? <CheckCircle2 size={12} /> : <Share2 size={12} />}
          {copied ? "¡Copiado!" : "Copiar link"}
        </button>
      )}
    </div>
  );
};

// ─── Tabla por mes ────────────────────────────────────────────────────────────
const MonthTable = ({ monthName, monthIndex, token, sedes }: {
  monthName: string; monthIndex: number; token: string; sedes: Sede[];
}) => {
  const locked  = monthIndex > currentMonth;
  const semanas = SEMANAS(monthName);

  const [estadoMes, setEstadoMes] = useState<Record<string, Record<string, boolean>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locked || !token) return;
    setIsLoading(true);
    axios.get(`${API_URL}/api/drive/estado-mes`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { mes: monthName, rol: "WORKER" },
    })
      .then((res) => setEstadoMes(res.data.estado))
      .catch(() => setEstadoMes(null))
      .finally(() => setIsLoading(false));
  }, [monthName, locked, token]);

  const getEstado = (sedNombre: string, key: string): Estado => {
    if (locked) return "BLOQUEADO";
    // Capacitación mensual bloqueada en Enero (0) y Febrero (1)
    if (key === "mensual" && (monthIndex === 0 || monthIndex === 1)) return "BLOQUEADO";
    if (isLoading || !estadoMes) return "CARGANDO";
    return estadoMes[sedNombre.toUpperCase()]?.[key] ? "COMPLETO" : "FALTA";
  };

  if (sedes.length === 0) return null;

  return (
    <div className={`mb-8 ${locked ? "opacity-40 pointer-events-none select-none" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {locked && <Lock size={12} className="text-gray-400" />}
          <h2 className={`text-xs font-bold uppercase tracking-widest ${locked ? "text-gray-400" : "text-gray-600"}`}>
            {monthName} {today.getFullYear()}
          </h2>
          {!locked && monthIndex === currentMonth && (
            <span className="text-[10px] bg-cyan-100 text-cyan-600 font-bold px-2 py-0.5 rounded-full">Mes actual</span>
          )}
        </div>
        {!locked && <ShareButton monthName={monthName} token={token} />}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2.5 text-left font-bold text-white bg-[#003366] border-r border-blue-900 whitespace-nowrap min-w-[130px]">SEDE</th>
              {semanas.map((sem, i) => (
                <th key={i} className="px-3 py-2.5 text-center font-semibold text-white bg-[#1a4d8f] border-r border-blue-800 whitespace-nowrap w-28 text-[10px] leading-tight">
                  {sem}
                </th>
              ))}
              <th className="px-3 py-2.5 text-center font-semibold text-white bg-[#0f3460] whitespace-nowrap w-28 text-[10px] leading-tight">
                Capacitación<br />Mensual
              </th>
            </tr>
          </thead>
          <tbody>
            {sedes.map((sede, bIdx) => (
              <tr key={sede.id} className={bIdx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                <td className="px-4 py-2.5 font-semibold text-gray-700 border-r border-gray-100 bg-blue-50/60 whitespace-nowrap text-xs">
                  {sede.nombre}
                </td>
                {semanas.map((sem) => (
                  <EstadoCell key={sem} estado={getEstado(sede.nombre, sem)} />
                ))}
                <EstadoCell estado={getEstado(sede.nombre, "mensual")} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!locked && (
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          ✓ Completo = todos los docs subidos: {WORKER_DOCS.join(" · ")}
        </p>
      )}
    </div>
  );
};

// ─── View ─────────────────────────────────────────────────────────────────────
const CuadroControlView = () => {
  const { user } = useAuthContext();
  const [sedes,        setSedes]        = useState<Sede[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    getSedesRequest(user.token)
      .then(setSedes)
      .catch(() => setSedes([]))
      .finally(() => setLoadingSedes(false));
  }, [user?.token]);

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cuadro de Control</h1>
          <p className="text-gray-600">Registro mensual de documentos por sede</p>
        </div>

        {loadingSedes ? (
          <div className="flex items-center gap-2 text-gray-400 text-sm py-8">
            <Loader2 size={16} className="animate-spin" /> Cargando sedes...
          </div>
        ) : (
          MONTHS.map((month, i) => (
            <MonthTable key={month} monthName={month} monthIndex={i} token={user?.token ?? ""} sedes={sedes} />
          ))
        )}
      </div>
    </LayoutComponent>
  );
};

export default CuadroControlView;