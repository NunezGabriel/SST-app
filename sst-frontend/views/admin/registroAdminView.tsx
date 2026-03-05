import { useState } from "react";
import LayoutComponent from "../../components/layoutComponent";
import ArchivoModal from "@/components/modals/registro/archivoModal";
import { useAuthContext } from "@/context/AuthContext";
import { CalendarDays, Table2, Lock, Link2 } from "lucide-react";
import Link from "next/link";

interface MonthData { name: string; monthIndex: number; }

const MONTHS: MonthData[] = [
  { name: "Enero",      monthIndex: 0  },
  { name: "Febrero",    monthIndex: 1  },
  { name: "Marzo",      monthIndex: 2  },
  { name: "Abril",      monthIndex: 3  },
  { name: "Mayo",       monthIndex: 4  },
  { name: "Junio",      monthIndex: 5  },
  { name: "Julio",      monthIndex: 6  },
  { name: "Agosto",     monthIndex: 7  },
  { name: "Septiembre", monthIndex: 8  },
  { name: "Octubre",    monthIndex: 9  },
  { name: "Noviembre",  monthIndex: 10 },
  { name: "Diciembre",  monthIndex: 11 },
];

const today         = new Date();
const currentMonth  = today.getMonth();
const isMonthLocked = (monthIndex: number) => monthIndex > currentMonth;

const RegistroAdminView = () => {
  const { user } = useAuthContext();

  const [modalOpen,     setModalOpen]     = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthData | null>(null);

  const handleMonthClick = (month: MonthData) => {
    if (isMonthLocked(month.monthIndex)) return;
    setSelectedMonth(month);
    setModalOpen(true);
  };

  return (
    <LayoutComponent>
      <div className="min-h-screen p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registro Admin</h1>
          <p className="text-gray-600">
            Selecciona el mes — los documentos se subirán a todas las sedes automáticamente
          </p>
        </div>

        {/* Banners */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Cuadro de Control */}
          <div className="relative flex-1 bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-300 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                    <Table2 size={18} className="text-[#003366]" />
                  </div>
                  <span className="text-[#003366] font-semibold text-xs uppercase tracking-wider">CUADRO DE CONTROL</span>
                </div>
                <h2 className="text-2xl font-bold text-black mb-1">¿Ya subiste todos los documentos?</h2>
                <p className="text-gray-500 text-sm">Revisa el progreso del equipo</p>
              </div>
              <Link href="/registro/cuadro-control" className="self-start bg-cyan-400 hover:bg-cyan-500 text-[#003366] font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105">
                Ver Cuadro
              </Link>
            </div>
          </div>

          {/* Gestionar Carpetas */}
          <div className="relative flex-1 bg-gradient-to from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-8 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500 opacity-20 rounded-full blur-[90px]" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500 bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
                    <Link2 size={18} className="text-white" />
                  </div>
                  <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wider">GESTIÓN DE CARPETAS</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Configura las Carpetas de Drive</h2>
                <p className="text-gray-400 text-sm">Explora y organiza las carpetas del equipo.</p>
              </div>
              <Link href="/registro/gestionar-carpetas" className="self-start bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105">
                <Link2 size={15} />
                Gestionar Carpetas
              </Link>
            </div>
          </div>
        </div>

        {/* Info badge */}
        <div className="mb-5 flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-100 rounded-xl w-fit">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <p className="text-xs text-purple-600 font-medium">
            Al subir un documento se copiará a todas las sedes disponibles
          </p>
        </div>

        {/* Grid de meses — click directo abre modal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MONTHS.map((month) => {
            const locked = isMonthLocked(month.monthIndex);
            return (
              <button
                key={month.name}
                onClick={() => handleMonthClick(month)}
                disabled={locked}
                className={`rounded-2xl border shadow-sm transition-all duration-200 p-6 flex flex-col items-center gap-3 group
                  ${locked
                    ? "bg-gray-200 border-gray-100 cursor-not-allowed opacity-40"
                    : "bg-white border-gray-100 hover:shadow-md hover:border-purple-300 cursor-pointer"}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                  ${locked ? "bg-gray-200" : "bg-purple-50 group-hover:bg-purple-500"}`}
                >
                  {locked
                    ? <Lock size={16} className="text-gray-500" />
                    : <CalendarDays size={20} className="text-purple-500 group-hover:text-white transition-colors" />}
                </div>
                <span className={`text-sm font-semibold ${locked ? "text-gray-500" : "text-gray-800 group-hover:text-gray-900"}`}>
                  {month.name}
                </span>
                <span className="text-xs text-gray-400">
                  {locked ? "No disponible" : "Subir documentos"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal — brigada vacía porque el service lo replica a todas las sedes */}
      <ArchivoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        weekLabel=""
        monthName={selectedMonth?.name ?? ""}
        brigada=""
      />
    </LayoutComponent>
  );
};

export default RegistroAdminView;