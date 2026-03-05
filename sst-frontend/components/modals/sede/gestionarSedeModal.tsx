"use client";

import { useState, useEffect } from "react";
import {
  X, MapPin, PlusCircle, Pencil, Trash2, Save,
  Loader2, AlertTriangle, CheckCircle2, Users,
} from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import {
  Sede,
  getSedesRequest,
  createSedeRequest,
  updateSedeRequest,
  deleteSedeRequest,
  getSedeUsuariosCountRequest,
} from "@/lib/api/sedes";

interface GestionarSedesModalProps {
  open: boolean;
  onClose: () => void;
  onSedesChange?: () => void; // callback para refrescar selects en otros modales
}

type Mode = "list" | "create" | "edit" | "confirmDelete";

const GestionarSedesModal: React.FC<GestionarSedesModalProps> = ({ open, onClose, onSedesChange }) => {
  const { user } = useAuthContext();

  const [sedes,       setSedes]       = useState<Sede[]>([]);
  const [loading,     setLoading]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [success,     setSuccess]     = useState<string | null>(null);

  const [mode,        setMode]        = useState<Mode>("list");
  const [editing,     setEditing]     = useState<Sede | null>(null);
  const [nombre,      setNombre]      = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Sede | null>(null);
  const [deleteCount,  setDeleteCount]  = useState<number | null>(null);
  const [deleting,    setDeleting]    = useState(false);

  const loadSedes = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await getSedesRequest(user.token);
      setSedes(data);
    } catch {
      setError("Error al cargar sedes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) { loadSedes(); setMode("list"); setError(null); setSuccess(null); }
  }, [open]);

  if (!open) return null;

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // ── Crear ──
  const handleCreate = async () => {
    if (!nombre.trim() || !user?.token) return;
    setSaving(true); setError(null);
    try {
      const nueva = await createSedeRequest(user.token, nombre.trim());
      setSedes((prev) => [...prev, nueva].sort((a, b) => a.nombre.localeCompare(b.nombre)));
      setMode("list"); setNombre("");
      flashSuccess(`Sede "${nueva.nombre}" creada correctamente`);
      onSedesChange?.();
    } catch (e: any) {
      setError(e.response?.data?.error || "Error al crear sede");
    } finally {
      setSaving(false);
    }
  };

  // ── Editar ──
  const startEdit = (sede: Sede) => {
    setEditing(sede); setNombre(sede.nombre); setMode("edit"); setError(null);
  };

  const handleEdit = async () => {
    if (!nombre.trim() || !editing || !user?.token) return;
    setSaving(true); setError(null);
    try {
      const actualizada = await updateSedeRequest(user.token, editing.id, nombre.trim());
      setSedes((prev) => prev.map((s) => s.id === editing.id ? actualizada : s));
      setMode("list"); setEditing(null); setNombre("");
      flashSuccess(`Sede actualizada a "${actualizada.nombre}"`);
      onSedesChange?.();
    } catch (e: any) {
      setError(e.response?.data?.error || "Error al actualizar sede");
    } finally {
      setSaving(false);
    }
  };

  // ── Eliminar ──
  const startDelete = async (sede: Sede) => {
    if (!user?.token) return;
    setDeleteTarget(sede); setDeleteCount(null); setMode("confirmDelete"); setError(null);
    try {
      const count = await getSedeUsuariosCountRequest(user.token, sede.id);
      setDeleteCount(count);
    } catch {
      setDeleteCount(0);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !user?.token) return;
    setDeleting(true); setError(null);
    try {
      await deleteSedeRequest(user.token, deleteTarget.id);
      setSedes((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setMode("list"); setDeleteTarget(null);
      flashSuccess(`Sede "${deleteTarget.nombre}" eliminada`);
      onSedesChange?.();
    } catch (e: any) {
      setError(e.response?.data?.error || "Error al eliminar sede");
      setMode("list");
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => { setMode("list"); setNombre(""); setEditing(null); setDeleteTarget(null); setError(null); onClose(); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin size={18} className="text-[#003366]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Gestionar Sedes</h2>
                <p className="text-xs text-gray-400">{sedes.length} sede{sedes.length !== 1 ? "s" : ""} registrada{sedes.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
              <X size={18} />
            </button>
          </div>

          {/* Feedback */}
          {success && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
              <CheckCircle2 size={14} /> {success}
            </div>
          )}
          {error && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">

            {/* ── Lista ── */}
            {mode === "list" && (
              <>
                <button
                  onClick={() => { setMode("create"); setNombre(""); setError(null); }}
                  className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#003366] text-white text-sm font-semibold hover:bg-[#004080] transition"
                >
                  <PlusCircle size={15} /> Nueva Sede
                </button>

                {loading ? (
                  <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
                ) : sedes.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">No hay sedes registradas</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {sedes.map((sede) => (
                      <div key={sede.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 group">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-700">{sede.nombre}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => startEdit(sede)} className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition" title="Editar">
                            <Pencil size={12} className="text-blue-600" />
                          </button>
                          <button onClick={() => startDelete(sede)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition" title="Eliminar">
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Crear ── */}
            {mode === "create" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">Ingresa el nombre de la nueva sede:</p>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Ej: LIMA"
                  autoFocus
                  maxLength={100}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50"
                />
                <div className="flex gap-3">
                  <button onClick={() => { setMode("list"); setNombre(""); setError(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                  <button onClick={handleCreate} disabled={saving || !nombre.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
                    Crear Sede
                  </button>
                </div>
              </div>
            )}

            {/* ── Editar ── */}
            {mode === "edit" && editing && (
              <div className="flex flex-col gap-4">
                {/* Advertencia importante */}
                <div className="flex gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700">
                    <p className="font-bold mb-1">⚠️ Atención importante</p>
                    <p>Al renombrar una sede, los usuarios asignados a ella cambiarán de nombre de sede en el sistema. Sin embargo, <strong>las carpetas ya creadas en Google Drive conservarán el nombre anterior</strong> — los archivos no se moverán. Se crearán nuevas carpetas con el nombre actualizado para futuros uploads.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre actual</label>
                  <p className="text-sm font-bold text-gray-400 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">{editing.nombre}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Nuevo nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                    placeholder="Nuevo nombre"
                    autoFocus
                    maxLength={100}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setMode("list"); setEditing(null); setNombre(""); setError(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                  <button onClick={handleEdit} disabled={saving || !nombre.trim() || nombre === editing.nombre} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition flex items-center justify-center gap-2 disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Guardar
                  </button>
                </div>
              </div>
            )}

            {/* ── Confirmar eliminar ── */}
            {mode === "confirmDelete" && deleteTarget && (
              <div className="flex flex-col gap-4">
                {/* Advertencia */}
                <div className="flex gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-700">
                    <p className="font-bold mb-1">⚠️ Atención importante</p>
                    <p>Al eliminar esta sede, <strong>las carpetas ya creadas en Google Drive con el nombre "{deleteTarget.nombre}" permanecerán intactas</strong> — los archivos no se borran automáticamente. Solo se elimina el registro en el sistema.</p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-sm font-bold text-gray-800 mb-1">¿Eliminar "{deleteTarget.nombre}"?</p>
                  {deleteCount === null ? (
                    <div className="flex justify-center"><Loader2 size={14} className="animate-spin text-gray-400" /></div>
                  ) : deleteCount > 0 ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-red-600 font-semibold">
                      <Users size={13} />
                      {deleteCount} usuario{deleteCount !== 1 ? "s" : ""} asignado{deleteCount !== 1 ? "s" : ""} — no se puede eliminar
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Sin usuarios asignados — se puede eliminar</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setMode("list"); setDeleteTarget(null); setError(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting || deleteCount === null || deleteCount > 0}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionarSedesModal;