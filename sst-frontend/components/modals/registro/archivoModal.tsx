import { useRef, useState, useEffect } from "react";
import {
  X,
  CreditCard,
  HeartPulse,
  ClipboardList,
  ShieldCheck,
  Truck,
  Users,
  FileSearch,
  Activity,
  FileText,
  GraduationCap,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { uploadDriveFileRequest } from "@/lib/api/drive";

interface ArchivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekLabel?: string;
  monthName?: string;
  brigada?: string;
  // Si se pasa tipoFijo, el modal abre el file picker directamente sin mostrar el grid
  tipoFijo?: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface DocOption {
  label: string;
  icon: React.ElementType;
  color: string;
}

const workerOptions: DocOption[] = [
  { label: "Licencia / SOAT / Bitácora", icon: CreditCard, color: "indigo" },
  { label: "Control de Salud Diario", icon: HeartPulse, color: "emerald" },
  { label: "ATS - Charla 5 min", icon: ClipboardList, color: "red" },
];

const adminOptions: DocOption[] = [
  { label: "Triaje", icon: Activity, color: "cyan" },
  { label: "Cargo de EPPs", icon: ShieldCheck, color: "blue" },
  { label: "SCTR", icon: FileSearch, color: "purple" },
  { label: "Listado de Personal", icon: Users, color: "orange" },
  { label: "Listado de Vehículos", icon: Truck, color: "slate" },
  { label: "Vigilancia COVID", icon: FileText, color: "pink" },
];

const COLOR_MAP: Record<
  string,
  { text: string; iconBg: string; border: string; bg: string; hover: string }
> = {
  indigo: {
    text: "text-indigo-600",
    iconBg: "bg-indigo-100",
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    hover: "hover:bg-indigo-100",
  },
  emerald: {
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    hover: "hover:bg-emerald-100",
  },
  red: {
    text: "text-red-600",
    iconBg: "bg-red-100",
    border: "border-red-200",
    bg: "bg-red-50",
    hover: "hover:bg-red-100",
  },
  cyan: {
    text: "text-cyan-600",
    iconBg: "bg-cyan-100",
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    hover: "hover:bg-cyan-100",
  },
  blue: {
    text: "text-blue-600",
    iconBg: "bg-blue-100",
    border: "border-blue-200",
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
  },
  purple: {
    text: "text-purple-600",
    iconBg: "bg-purple-100",
    border: "border-purple-200",
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
  },
  orange: {
    text: "text-orange-600",
    iconBg: "bg-orange-100",
    border: "border-orange-200",
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
  },
  slate: {
    text: "text-slate-600",
    iconBg: "bg-slate-100",
    border: "border-slate-200",
    bg: "bg-slate-50",
    hover: "hover:bg-slate-100",
  },
  pink: {
    text: "text-pink-600",
    iconBg: "bg-pink-100",
    border: "border-pink-200",
    bg: "bg-pink-50",
    hover: "hover:bg-pink-100",
  },
  amber: {
    text: "text-amber-600",
    iconBg: "bg-amber-100",
    border: "border-amber-200",
    bg: "bg-amber-50",
    hover: "hover:bg-amber-100",
  },
};

const ArchivoModal = ({
  isOpen,
  onClose,
  weekLabel = "",
  monthName = "",
  brigada = "",
  tipoFijo,
}: ArchivoModalProps) => {
  const { user } = useAuthContext();

  const [selectedDoc, setSelectedDoc] = useState<DocOption | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedLink, setUploadedLink] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.rol === "ADMIN";
  const options = isAdmin ? adminOptions : workerOptions;
  const rolLabel = isAdmin ? "ADMIN" : "WORKER";

  // Si hay tipoFijo, al abrir el modal disparamos el file picker directamente
  useEffect(() => {
    if (!isOpen || !tipoFijo) return;
    // Precargar el doc fijo y abrir el picker
    setSelectedDoc({ label: tipoFijo, icon: GraduationCap, color: "amber" });
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedLink("");
    // Pequeño delay para que el DOM esté listo
    const t = setTimeout(() => fileInputRef.current?.click(), 100);
    return () => clearTimeout(t);
  }, [isOpen, tipoFijo]);

  if (!isOpen) return null;

  const handleDocClick = (opt: DocOption) => {
    setSelectedDoc(opt);
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedLink("");
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedDoc || !user?.token) return;
    e.target.value = "";

    setUploadStatus("uploading");

    try {
      const result = await uploadDriveFileRequest(user.token, {
        file,
        rol: rolLabel,
        brigada: brigada || user?.sede || "SIN_BRIGADA",
        mes: monthName,
        semana: tipoFijo ? "" : weekLabel, // ← vacío para mensual
        tipoDoc: selectedDoc.label,
      });
      setUploadedLink(result.archivo.webViewLink);
      setUploadStatus("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al subir el archivo");
      setUploadStatus("error");
    }
  };

  const resetUpload = () => {
    setSelectedDoc(null);
    setUploadStatus("idle");
    setErrorMsg("");
    setUploadedLink("");
  };

  const handleClose = () => {
    resetUpload();
    onClose();
  };

  // Título del header
  const headerTitle = tipoFijo
    ? "Capacitación Mensual"
    : `Panel de Carga ${isAdmin ? "(Admin)" : "(Worker)"}`;

  const headerSubtitle = tipoFijo
    ? `${monthName} — Subir documento de capacitación`
    : weekLabel;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        style={{ position: "fixed", top: -9999, left: -9999, opacity: 0 }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
      />

      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex justify-between items-start px-6 py-5 ${tipoFijo ? "bg-amber-500" : "bg-[#003366]"}`}
          >
            <div>
              <h2 className="text-lg font-bold text-white">{headerTitle}</h2>
              {headerSubtitle && (
                <p className="text-xs text-white/70 mt-1">{headerSubtitle}</p>
              )}
            </div>
            <button
              className="text-white bg-white/10 hover:bg-white/20 rounded-lg p-1.5 transition-colors"
              onClick={handleClose}
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            {/* Subiendo */}
            {uploadStatus === "uploading" && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2
                  size={36}
                  className={`animate-spin ${tipoFijo ? "text-amber-500" : "text-cyan-500"}`}
                />
                <p className="text-sm font-semibold text-gray-700">
                  Subiendo{" "}
                  <span
                    className={tipoFijo ? "text-amber-600" : "text-cyan-600"}
                  >
                    {selectedDoc?.label}
                  </span>
                  ...
                </p>
                <p className="text-xs text-gray-400">No cierres esta ventana</p>
              </div>
            )}

            {/* Éxito */}
            {uploadStatus === "success" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">
                    ¡Archivo subido correctamente!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedDoc?.label} — {tipoFijo ? monthName : weekLabel}
                  </p>
                </div>
                {uploadedLink && (
                  <a
                    href={uploadedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-600 hover:underline"
                  >
                    Ver en Drive →
                  </a>
                )}
                <div className="flex gap-3 mt-2">
                  {!tipoFijo && (
                    <button
                      onClick={resetUpload}
                      className="px-4 py-2 text-sm font-semibold bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-xl hover:bg-cyan-100 transition-colors"
                    >
                      Subir otro documento
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {uploadStatus === "error" && (
              <div className="flex flex-col items-center gap-4 py-6">
                <AlertCircle size={40} className="text-red-400" />
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">
                    Error al subir
                  </p>
                  <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
                </div>
                <button
                  onClick={resetUpload}
                  className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            )}

            {/* Idle — solo se muestra si NO hay tipoFijo */}
            {uploadStatus === "idle" && !tipoFijo && (
              <>
                <p className="text-sm text-gray-500 mb-5">
                  Selecciona el tipo de documento a subir:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {options.map((opt) => {
                    const Icon = opt.icon;
                    const c = COLOR_MAP[opt.color];
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleDocClick(opt)}
                        className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center`}
                        >
                          <Icon size={20} className={c.text} />
                        </div>
                        <span
                          className={`text-[11px] font-bold text-center leading-tight ${c.text}`}
                        >
                          {opt.label}
                        </span>
                        <div
                          className={`flex items-center gap-1 text-[10px] ${c.text} opacity-70`}
                        >
                          <Upload size={10} />
                          <span>Subir archivo</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Idle con tipoFijo — muestra un indicador de espera del picker */}
            {uploadStatus === "idle" && tipoFijo && (
              <div className="flex flex-col items-center gap-3 py-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                  <GraduationCap size={32} className="text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-gray-700 text-center">
                  Selecciona el archivo de capacitación
                </p>
                <p className="text-xs text-gray-400 text-center">
                  Se abrirá el selector de archivos automáticamente
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  <Upload size={15} />
                  Seleccionar archivo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArchivoModal;
