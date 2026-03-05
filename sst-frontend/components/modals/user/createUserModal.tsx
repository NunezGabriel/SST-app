"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Lock, CreditCard, PlusCircle, ChevronDown, Phone, MapPin, Loader2 } from "lucide-react";
import { TipoUsuario, UserFormData } from "@/components/modals/user/editUserModal";
import { useAuthContext } from "@/context/AuthContext";
import { getSedesRequest, Sede } from "@/lib/api/sedes";

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: UserFormData) => void;
  refreshSedes?: number; // incrementar desde padre para forzar reload de sedes
}

const emptyForm: UserFormData = {
  nombre: "", apellido: "", dni: "", correo: "", contrasena: "",
  tipo: "WORKER", telefono: "", idSede: 0,
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onCreate, refreshSedes }) => {
  const { user } = useAuthContext();
  const [form,  setForm]  = useState<UserFormData>(emptyForm);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loadingSedes, setLoadingSedes] = useState(false);

  useEffect(() => {
    if (!open || !user?.token) return;
    setLoadingSedes(true);
    getSedesRequest(user.token)
      .then((data) => {
        setSedes(data);
        // Si no hay sede seleccionada, preseleccionar la primera
        if (data.length > 0) setForm((prev) => ({ ...prev, idSede: prev.idSede || data[0].id }));
      })
      .catch(() => setSedes([]))
      .finally(() => setLoadingSedes(false));
  }, [open, refreshSedes, user?.token]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.name === "idSede" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
    setForm(emptyForm);
  };

  const handleClose = () => { setForm(emptyForm); onClose(); };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Crear Usuario</h2>
              <p className="text-sm text-gray-400 mt-0.5">Completa los datos del nuevo usuario</p>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
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
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required maxLength={100} placeholder="Juan"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Apellido <span className="text-red-400">*</span></label>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required maxLength={100} placeholder="Pérez"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* DNI */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">DNI <span className="text-red-400">*</span></label>
              <div className="relative">
                <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="dni" value={form.dni} onChange={handleChange} required maxLength={20} placeholder="12345678"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" name="correo" value={form.correo} onChange={handleChange} required maxLength={150} placeholder="juan@empresa.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" name="contrasena" value={form.contrasena} onChange={handleChange} required placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
              </div>
            </div>

            {/* Teléfono + Sede */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="telefono" value={form.telefono ?? ""} onChange={handleChange} maxLength={20} placeholder="+51 999 999 999"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 placeholder-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sede <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  {loadingSedes
                    ? <div className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2 text-sm text-gray-400"><Loader2 size={13} className="animate-spin" /> Cargando...</div>
                    : <>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <select name="idSede" value={form.idSede} onChange={handleChange} required
                          className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 appearance-none">
                          {sedes.length === 0
                            ? <option value={0} disabled>Sin sedes disponibles</option>
                            : sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)
                          }
                        </select>
                      </>
                  }
                </div>
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

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition flex items-center justify-center gap-2">
                <PlusCircle size={15} /> Crear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateUserModal;