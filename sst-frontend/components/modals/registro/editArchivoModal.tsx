import { useState } from "react";
import {
  CreditCard,
  HeartPulse,
  GraduationCap,
  ClipboardList,
  Activity,
  ShieldCheck,
  FileSearch,
  Users,
  Truck,
  FileText,
  Link2,
  Check,
  Pencil,
  X,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Rol = "WORKER" | "ADMIN";

interface DocLink {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  link: string;
}

interface EditArchivoModalProps {
  rol: Rol;
  weekLabel: string;
  monthName: string;
}

// ─── Documentos por rol (hardcodeado — reemplazar con fetch a DB) ─────────────

const WORKER_DOCS: Omit<DocLink, "link">[] = [
  {
    id: "Bitacora",
    label: "Bitácora",
    icon: CreditCard,
    color: "indigo",
  },
  {
    id: "salud",
    label: "Control de Salud Diario",
    icon: HeartPulse,
    color: "emerald",
  },
  { id: "ats", label: "ATS - Charla 5 min", icon: ClipboardList, color: "red" },
];

const ADMIN_DOCS: Omit<DocLink, "link">[] = [
  { id: "triaje", label: "Triaje", icon: Activity, color: "cyan" },
  { id: "epps", label: "Cargo de EPPs", icon: ShieldCheck, color: "blue" },
  { id: "sctr", label: "SCTR", icon: FileSearch, color: "purple" },
  {
    id: "personal",
    label: "Listado de Personal",
    icon: Users,
    color: "orange",
  },
  {
    id: "vehiculos",
    label: "Listado de Vehículos",
    icon: Truck,
    color: "slate",
  },
  { id: "covid", label: "Vigilancia COVID", icon: FileText, color: "pink" },
];

// ─── Color map ────────────────────────────────────────────────────────────────

const COLOR_MAP: Record<
  string,
  { text: string; bg: string; border: string; light: string }
> = {
  indigo: {
    text: "text-indigo-600",
    bg: "bg-indigo-100",
    border: "border-indigo-200",
    light: "bg-indigo-50",
  },
  emerald: {
    text: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    light: "bg-emerald-50",
  },
  amber: {
    text: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    light: "bg-amber-50",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
    light: "bg-red-50",
  },
  cyan: {
    text: "text-cyan-600",
    bg: "bg-cyan-100",
    border: "border-cyan-200",
    light: "bg-cyan-50",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    light: "bg-blue-50",
  },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    border: "border-purple-200",
    light: "bg-purple-50",
  },
  orange: {
    text: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-200",
    light: "bg-orange-50",
  },
  slate: {
    text: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
    light: "bg-slate-50",
  },
  pink: {
    text: "text-pink-600",
    bg: "bg-pink-100",
    border: "border-pink-200",
    light: "bg-pink-50",
  },
};

// ─── Componente ───────────────────────────────────────────────────────────────

const EditArchivoModal = ({
  rol,
  weekLabel,
  monthName,
}: EditArchivoModalProps) => {
  const baseDocs = rol === "WORKER" ? WORKER_DOCS : ADMIN_DOCS;

  // Estado inicial de links (hardcodeado vacío — en real vendría de DB)
  const [links, setLinks] = useState<Record<string, string>>(
    Object.fromEntries(baseDocs.map((d) => [d.id, ""])),
  );
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const startEdit = (id: string) => {
    setEditing(id);
    setDraft(links[id]);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const confirmEdit = (id: string) => {
    setLinks((prev) => ({ ...prev, [id]: draft }));
    setSaved((prev) => ({ ...prev, [id]: true }));
    setEditing(null);
    setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <div className="max-w-2xl">
      {/* Contexto */}
      <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
        <Link2 size={15} className="text-gray-400" />
        <span className="text-sm text-gray-500">
          Editando links de{" "}
          <span className="font-semibold text-gray-700">
            {rol === "WORKER" ? "Worker" : "Admin"}
          </span>{" "}
          · <span className="font-semibold text-gray-700">{monthName}</span> ·{" "}
          <span className="font-semibold text-gray-700">{weekLabel}</span>
        </span>
      </div>

      {/* Lista de documentos */}
      <div className="flex flex-col gap-3">
        {baseDocs.map((doc) => {
          const Icon = doc.icon;
          const c = COLOR_MAP[doc.color];
          const currentLink = links[doc.id];
          const isEditing = editing === doc.id;
          const wasSaved = saved[doc.id];

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border ${c.border} shadow-sm p-4 transition-all duration-200`}
            >
              <div className="flex items-center gap-3">
                {/* Icono */}
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon size={18} className={c.text} />
                </div>

                {/* Info + input */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold mb-1 ${c.text}`}>
                    {doc.label}
                  </p>

                  {isEditing ? (
                    <input
                      autoFocus
                      type="url"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit(doc.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      placeholder="https://docs.google.com/..."
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                    />
                  ) : (
                    <p
                      className={`text-sm truncate ${currentLink ? "text-gray-600" : "text-gray-300 italic"}`}
                    >
                      {currentLink || "Sin link configurado"}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => confirmEdit(doc.id)}
                        className="w-8 h-8 rounded-lg bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center transition-colors"
                      >
                        <Check size={15} className="text-emerald-600" />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <X size={15} className="text-gray-500" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(doc.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                        ${wasSaved ? "bg-emerald-100" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                      {wasSaved ? (
                        <Check size={15} className="text-emerald-600" />
                      ) : (
                        <Pencil size={14} className="text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-5 text-center">
        Los cambios se guardarán en la base de datos cuando conectes el backend
      </p>
    </div>
  );
};

export default EditArchivoModal;
