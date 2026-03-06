"use client";

import { useEffect, useState } from "react";
import { X, User, Mail, Lock, CreditCard, Save, ChevronDown, Phone, MapPin, Loader2 } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { getSedesRequest, Sede } from "@/lib/api/sedes";

export type TipoUsuario = "WORKER" | "ADMIN";

export interface UserFormData {
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  contrasena: string;
  tipo: TipoUsuario;
  telefono?: string;
  idSede: number;   // ← FK numérica (antes era sede: string)
}

interface EditUserModalProps {
  open: boolean;
  usuario: (Omit<UserFormData, "contrasena"> & { id: number; telefono?: string }) | null;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  refreshSedes?: number;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, usuario, onClose, onSave, refreshSedes }) => {
  const { user } = useAuthContext();

  const [form, setForm] = useState<UserFormData>({
    nombre: "", apellido: "", dni: "", correo: "", contrasena: "",
    tipo: "WORKER", telefono: "", idSede: 0,
  });
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(false);

  // Cargar sedes cuando abre
  useEffect(() => {
    if (!open || !user?.token) return;
    setLoadingSedes(true);
    getSedesRequest(user.token)
      .then(setSedes)
      .catch(() => setSedes([]))
      .finally(() => setLoadingSedes(false));
  }, [open, refreshSedes, user?.token]);

  // Rellenar form cuando cambia usuario
  useEffect(() => {
    if (usuario) {
      setForm({
        nombre:    usuario.nombre,
        apellido:  usuario.apellido,
        dni:       usuario.dni,
        correo:    usuario.correo,
        contrasena: "",
        tipo:      usuario.tipo,
        telefono:  usuario.telefono ?? "",
        idSede:    usuario.idSede,
      });
    }
  }, [usuario]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === "idSede" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(form); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Editar Usuario</h2>
              <p className="text-sm text-gray-400 mt-0.5">Modifica los datos del usuario</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required maxLength={100}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-400">*</span></label>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required maxLength={100}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">DNI <span className="text-red-400">*</span></label>
              <div className="relative">
                <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="dni" value={form.dni} onChange={handleChange} required maxLength={20}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="correo" value={form.correo} onChange={handleChange} required maxLength={150}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nueva Contraseña <span className="text-gray-400 font-normal text-xs">(dejar vacío para no cambiar)</span>
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo <span className="text-red-400">*</span></label>
              <div className="relative">
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select name="tipo" value={form.tipo} onChange={handleChange} required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 appearance-none">
                  <option value="WORKER">Worker</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* Teléfono + Sede */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="telefono" value={form.telefono ?? ""} onChange={handleChange} maxLength={20}
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Sede {form.tipo !== "ADMIN" && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  {loadingSedes
                    ? <div className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 text-sm text-gray-400"><Loader2 size={13} className="animate-spin" /> Cargando...</div>
                    : <>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select name="idSede" value={form.idSede} onChange={handleChange} required={form.tipo !== "ADMIN"}
                          className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 appearance-none">
                          {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                        </select>
                      </>
                  }
                </div>
                {form.tipo === "ADMIN" && (
                  <p className="mt-1.5 text-xs text-purple-600 font-medium flex items-center gap-1">
                    Los administradores no pertenecen a una sede específica — puedes seleccionar cualquiera.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition flex items-center justify-center gap-2">
                <Save size={15} /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;