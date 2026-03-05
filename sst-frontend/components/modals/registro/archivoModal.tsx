import { useRef, useState, useEffect } from "react";
import {
  X, CreditCard, HeartPulse, ClipboardList,
  ShieldCheck, Truck, Users, FileSearch, Activity, FileText,
  GraduationCap, Upload, CheckCircle2, Loader2, AlertCircle,
  ExternalLink, RefreshCw, Trash2,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import {
  uploadDriveFileRequest,
  getFilesByRouteRequest,
  deleteDriveItemRequest,
  DriveFile,
} from "@/lib/api/drive";

interface ArchivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel?: string;
  monthName?: string;
  brigada?: string;
  tipoFijo?: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface DocOption { label: string; icon: React.ElementType; color: string; }

const workerOptions: DocOption[] = [
  { label: "Licencia / SOAT / Bitácora", icon: CreditCard,    color: "indigo"  },
  { label: "Control de Salud Diario",    icon: HeartPulse,    color: "emerald" },
  { label: "ATS - Charla 5 min",         icon: ClipboardList, color: "red"     },
];

const adminOptions: DocOption[] = [
  { label: "Triaje",               icon: Activity,    color: "cyan"   },
  { label: "Cargo de EPPs",        icon: ShieldCheck, color: "blue"   },
  { label: "SCTR",                 icon: FileSearch,  color: "purple" },
  { label: "Listado de Personal",  icon: Users,       color: "orange" },
  { label: "Listado de Vehículos", icon: Truck,       color: "slate"  },
  { label: "Vigilancia COVID",     icon: FileText,    color: "pink"   },
];

const COLOR_MAP: Record<string, { text: string; iconBg: string; border: string; bg: string; hover: string }> = {
  indigo:  { text: "text-indigo-600",  iconBg: "bg-indigo-100",  border: "border-indigo-200",  bg: "bg-indigo-50",  hover: "hover:bg-indigo-100"  },
  emerald: { text: "text-emerald-600", iconBg: "bg-emerald-100", border: "border-emerald-200", bg: "bg-emerald-50", hover: "hover:bg-emerald-100" },
  red:     { text: "text-red-600",     iconBg: "bg-red-100",     border: "border-red-200",     bg: "bg-red-50",     hover: "hover:bg-red-100"     },
  cyan:    { text: "text-cyan-600",    iconBg: "bg-cyan-100",    border: "border-cyan-200",    bg: "bg-cyan-50",    hover: "hover:bg-cyan-100"    },
  blue:    { text: "text-blue-600",    iconBg: "bg-blue-100",    border: "border-blue-200",    bg: "bg-blue-50",    hover: "hover:bg-blue-100"    },
  purple:  { text: "text-purple-600",  iconBg: "bg-purple-100",  border: "border-purple-200",  bg: "bg-purple-50",  hover: "hover:bg-purple-100"  },
  orange:  { text: "text-orange-600",  iconBg: "bg-orange-100",  border: "border-orange-200",  bg: "bg-orange-50",  hover: "hover:bg-orange-100"  },
  slate:   { text: "text-slate-600",   iconBg: "bg-slate-100",   border: "border-slate-200",   bg: "bg-slate-50",   hover: "hover:bg-slate-100"   },
  pink:    { text: "text-pink-600",    iconBg: "bg-pink-100",    border: "border-pink-200",    bg: "bg-pink-50",    hover: "hover:bg-pink-100"    },
  amber:   { text: "text-amber-600",   iconBg: "bg-amber-100",   border: "border-amber-200",   bg: "bg-amber-50",   hover: "hover:bg-amber-100"   },
};

// ─── Lista de archivos con delete ─────────────────────────────────────────────
const ArchivosActuales = ({
  files,
  isLoading,
  token,
  onDeleted,
}: {
  files: DriveFile[];
  isLoading: boolean;
  token: string;
  onDeleted: (id: string) => void;
}) => {
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [confirmId,   setConfirmId]   = useState<string | null>(null);

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId);
    try {
      await deleteDriveItemRequest(token, fileId);
      onDeleted(fileId);
      setConfirmId(null);
    } catch {
      // silencioso — el usuario puede reintentar
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return (
    <div className="flex items-center gap-2 py-3 text-xs text-gray-400">
      <Loader2 size={12} className="animate-spin" /> Cargando archivos...
    </div>
  );

  if (files.length === 0) return (
    <p className="text-xs text-gray-400 italic py-2">Sin archivos subidos aún en esta carpeta</p>
  );

  return (
    <div className="flex flex-col gap-1.5">
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 group">
          {/* Nombre + link */}
          <a
            href={f.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 flex-1 min-w-0 hover:underline"
          >
            <FileText size={13} className="text-gray-400 shrink-0" />
            <span className="text-xs text-gray-600 truncate">{f.name}</span>
            <ExternalLink size={10} className="text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
          </a>

          {/* Eliminar */}
          {confirmId === f.id ? (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => handleDelete(f.id)}
                disabled={deletingId === f.id}
                className="w-6 h-6 rounded-md bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                title="Confirmar eliminación"
              >
                {deletingId === f.id
                  ? <Loader2 size={10} className="animate-spin text-white" />
                  : <CheckCircle2 size={10} className="text-white" />}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="w-6 h-6 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <X size={10} className="text-gray-600" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmId(f.id)}
              className="w-6 h-6 rounded-md bg-transparent hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0"
              title="Eliminar archivo"
            >
              <Trash2 size={11} className="text-red-400" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Modal principal ──────────────────────────────────────────────────────────
const ArchivoModal = ({
  isOpen,
  onClose,
  weekLabel = "",
  monthName = "",
  brigada = "",
  tipoFijo,
}: ArchivoModalProps) => {
  const { user } = useAuthContext();

  const [selectedDoc,   setSelectedDoc]   = useState<DocOption | null>(null);
  const [uploadStatus,  setUploadStatus]  = useState<UploadStatus>("idle");
  const [errorMsg,      setErrorMsg]      = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; link: string }[]>([]);
  const [currentFiles,  setCurrentFiles]  = useState<DriveFile[]>([]);
  const [loadingFiles,  setLoadingFiles]  = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin  = user?.rol === "ADMIN";
  const options  = isAdmin ? adminOptions : workerOptions;
  const rolLabel = isAdmin ? "ADMIN" : "WORKER";

  const routeParams = (tipoDoc: string) => ({
    rol:     rolLabel,
    brigada: brigada || user?.sede || "SIN_BRIGADA",
    mes:     monthName,
    semana:  tipoFijo ? "" : weekLabel,
    tipoDoc,
  });

  const fetchCurrentFiles = async (tipoDoc: string) => {
    if (!user?.token) return;
    setLoadingFiles(true);
    try {
      const data = await getFilesByRouteRequest(user.token, routeParams(tipoDoc));
      setCurrentFiles(data.files);
    } catch {
      setCurrentFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Al abrir con tipoFijo → cargar archivos + abrir picker
  useEffect(() => {
    if (!isOpen || !tipoFijo) return;
    const doc = { label: tipoFijo, icon: GraduationCap, color: "amber" };
    setSelectedDoc(doc);
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedFiles([]);
    fetchCurrentFiles(tipoFijo);
    const t = setTimeout(() => fileInputRef.current?.click(), 150);
    return () => clearTimeout(t);
  }, [isOpen, tipoFijo]);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSelectedDoc(null);
      setUploadStatus("idle");
      setErrorMsg("");
      setUploadedFiles([]);
      setCurrentFiles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDocClick = (opt: DocOption) => {
    setSelectedDoc(opt);
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedFiles([]);
    fetchCurrentFiles(opt.label);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0 || !selectedDoc || !user?.token) return;
    e.target.value = "";
    setUploadStatus("uploading");
    try {
      const result = await uploadDriveFileRequest(user.token, {
        files,
        ...routeParams(selectedDoc.label),
      });
      setUploadedFiles(result.archivos.map((a) => ({ name: a.name, link: a.webViewLink })));
      setUploadStatus("success");
      await fetchCurrentFiles(selectedDoc.label);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al subir los archivos");
      setUploadStatus("error");
    }
  };

  const handleFileDeleted = (deletedId: string) => {
    setCurrentFiles((prev) => prev.filter((f) => f.id !== deletedId));
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedFiles([]);
  };

  const handleClose = () => { setSelectedDoc(null); onClose(); };

  const headerTitle    = tipoFijo ? "Capacitación Mensual" : `Panel de Carga ${isAdmin ? "(Admin)" : "(Worker)"}`;
  const headerSubtitle = tipoFijo ? `${monthName} — Subir documento de capacitación` : weekLabel;
  const accentColor    = tipoFijo ? "text-amber-500" : "text-cyan-500";
  const headerBg       = tipoFijo ? "bg-amber-500" : "bg-[#003366]";

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0 }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
      />

      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={handleClose}>
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className={`flex justify-between items-start px-6 py-5 shrink-0 ${headerBg}`}>
            <div>
              <h2 className="text-lg font-bold text-white">{headerTitle}</h2>
              {headerSubtitle && <p className="text-xs text-white/70 mt-1">{headerSubtitle}</p>}
            </div>
            <button className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">

            {/* ── Subiendo ── */}
            {uploadStatus === "uploading" && (
              <div className="flex flex-col items-center gap-3 py-10">
                <Loader2 size={36} className={`animate-spin ${accentColor}`} />
                <p className="text-sm font-semibold text-gray-700">
                  Subiendo <span className={accentColor}>{selectedDoc?.label}</span>...
                </p>
                <p className="text-xs text-gray-400">No cierres esta ventana</p>
              </div>
            )}

            {/* ── Error ── */}
            {uploadStatus === "error" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-sm font-bold text-gray-800">Error al subir</p>
                <p className="text-xs text-red-500">{errorMsg}</p>
                <button onClick={resetUpload} className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors">
                  Intentar de nuevo
                </button>
              </div>
            )}

            {/* ── Éxito ── */}
            {uploadStatus === "success" && (
              <>
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <CheckCircle2 size={22} className="text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {uploadedFiles.length === 1 ? "¡Archivo subido!" : `¡${uploadedFiles.length} archivos subidos!`}
                    </p>
                    <p className="text-xs text-gray-500">{selectedDoc?.label}</p>
                  </div>
                </div>

                {/* Recién subidos */}
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Subidos ahora</p>
                  {uploadedFiles.map((f) => (
                    <a key={f.link} href={f.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <FileText size={12} className="text-emerald-400" />
                      <span className="text-xs text-emerald-700 truncate flex-1">{f.name}</span>
                      <ExternalLink size={10} className="text-emerald-400" />
                    </a>
                  ))}
                </div>

                {/* Todos los archivos */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Todos en esta carpeta</p>
                    <button onClick={() => fetchCurrentFiles(selectedDoc!.label)} className="text-gray-300 hover:text-gray-500 transition-colors" title="Actualizar">
                      <RefreshCw size={12} />
                    </button>
                  </div>
                  <ArchivosActuales files={currentFiles} isLoading={loadingFiles} token={user?.token ?? ""} onDeleted={handleFileDeleted} />
                </div>

                <div className="flex gap-3 pt-1">
                  {!tipoFijo && (
                    <button onClick={resetUpload} className="flex-1 py-2 text-sm font-semibold bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-xl hover:bg-cyan-100 transition-colors">
                      Subir más
                    </button>
                  )}
                  <button onClick={handleClose} className="flex-1 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    Cerrar
                  </button>
                </div>
              </>
            )}

            {/* ── Idle: grid de opciones (sin tipoFijo y sin doc seleccionado) ── */}
            {uploadStatus === "idle" && !tipoFijo && !selectedDoc && (
              <>
                <p className="text-sm text-gray-500">Selecciona el tipo de documento a subir:</p>
                <div className="grid grid-cols-2 gap-3">
                  {options.map((opt) => {
                    const Icon = opt.icon;
                    const c   = COLOR_MAP[opt.color];
                    return (
                      <button key={opt.label} onClick={() => handleDocClick(opt)}
                        className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                          <Icon size={20} className={c.text} />
                        </div>
                        <span className={`text-[11px] font-bold text-center leading-tight ${c.text}`}>{opt.label}</span>
                        <div className={`flex items-center gap-1 text-[10px] ${c.text} opacity-70`}>
                          <Upload size={10} /><span>Subir archivos</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Idle: doc seleccionado → mostrar archivos + botón subir ── */}
            {uploadStatus === "idle" && !tipoFijo && selectedDoc && (
              <>
                <button onClick={() => { setSelectedDoc(null); setCurrentFiles([]); }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors self-start"
                >
                  ← Volver a tipos de documento
                </button>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Archivos en {selectedDoc.label}
                    </p>
                    <button onClick={() => fetchCurrentFiles(selectedDoc.label)} className="text-gray-300 hover:text-gray-500 transition-colors">
                      <RefreshCw size={12} />
                    </button>
                  </div>
                  <ArchivosActuales files={currentFiles} isLoading={loadingFiles} token={user?.token ?? ""} onDeleted={handleFileDeleted} />
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors border ${COLOR_MAP[selectedDoc.color].border} ${COLOR_MAP[selectedDoc.color].bg} ${COLOR_MAP[selectedDoc.color].hover} ${COLOR_MAP[selectedDoc.color].text}`}
                >
                  <Upload size={15} />
                  Subir archivos a {selectedDoc.label}
                </button>
              </>
            )}

            {/* ── Idle con tipoFijo: lista de archivos + botón subir ── */}
            {uploadStatus === "idle" && tipoFijo && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Archivos subidos este mes
                    </p>
                    <button onClick={() => fetchCurrentFiles(tipoFijo)} className="text-gray-300 hover:text-gray-500 transition-colors">
                      <RefreshCw size={12} />
                    </button>
                  </div>
                  <ArchivosActuales files={currentFiles} isLoading={loadingFiles} token={user?.token ?? ""} onDeleted={handleFileDeleted} />
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={15} />
                  Seleccionar archivos
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default ArchivoModal;