"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import EditUserModal, { UserFormData } from "@/components/modals/user/editUserModal";
import CreateUserModal from "@/components/modals/user/createUserModal";
import GestionarSedesModal from "@/components/modals/sede/gestionarSedeModal";
import { useUserAdminContext } from "@/context/UserAdminContext";
import type { Usuario } from "@/context/UserAdminContext";
import {
  Users, PlusCircle, Pencil, PowerOff, Trash2,
  Search, ChevronDown, CheckCircle2, XCircle, MapPin,
} from "lucide-react";

const examenBadge = (examen: string) => {
  if (examen === "Aprobado")    return "bg-green-100 text-green-700";
  if (examen === "Bloqueada")   return "bg-red-100 text-red-700";
  if (examen === "No aprobado") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-500";
};

const UserAdminView = () => {
  const { usuarios, isLoading, error, createUsuario, updateUsuario, toggleActivo, deleteUsuario } = useUserAdminContext();

  const [busqueda,        setBusqueda]        = useState("");
  const [filtroTipo,      setFiltroTipo]      = useState<"TODOS" | "WORKER" | "ADMIN">("TODOS");
  const [editModalOpen,   setEditModalOpen]   = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sedesModalOpen,  setSedesModalOpen]  = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  // Incrementar para forzar reload de sedes en modales de usuario
  const [sedesVersion,   setSedesVersion]    = useState(0);

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = `${u.nombre} ${u.apellido}`.toLowerCase();
    const coincideBusqueda =
      nombre.includes(busqueda.toLowerCase()) ||
      u.dni.includes(busqueda) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === "TODOS" || u.tipo === filtroTipo;
    return coincideBusqueda && coincideTipo;
  });

  const handleEditar = (usuario: Usuario) => { setUsuarioEditando(usuario); setEditModalOpen(true); };

  const handleToggleActivo = async (usuario: Usuario) => {
    try { await toggleActivo(usuario.id, usuario.activo); }
    catch (err: any) { alert(err.message || "Error al cambiar estado del usuario"); }
  };

  const handleSaveEdit = async (data: UserFormData) => {
    if (!usuarioEditando) return;
    try {
      await updateUsuario(usuarioEditando.id, data);
      setEditModalOpen(false); setUsuarioEditando(null);
    } catch (err: any) { alert(err.message || "Error al actualizar usuario"); }
  };

  const handleCreate = async (data: UserFormData) => {
    try { await createUsuario(data); setCreateModalOpen(false); }
    catch (err: any) { alert(err.message || "Error al crear usuario"); }
  };

  const handleDelete = async (usuario: Usuario) => {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${usuario.nombre} ${usuario.apellido}?`)) return;
    try { await deleteUsuario(usuario.id); }
    catch (err: any) { alert(err.message || "Error al eliminar usuario"); }
  };

  const totalWorkers = usuarios.filter((u) => u.tipo === "WORKER").length;
  const totalAdmins  = usuarios.filter((u) => u.tipo === "ADMIN").length;
  const activos      = usuarios.filter((u) => u.activo).length;

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Administración de Usuarios</h1>
            <p className="text-gray-500 mt-1">Gestión de workers y administradores del sistema</p>
          </div>
          <div className="flex gap-3">
            {/* Gestionar Sedes */}
            <button
              onClick={() => setSedesModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-full font-semibold text-sm hover:bg-gray-50 transition"
            >
              <MapPin size={16} />
              Gestionar Sedes
            </button>
            {/* Crear Usuario */}
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <PlusCircle size={18} />
              Crear Usuario
            </button>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Workers", value: totalWorkers, color: "text-blue-600",   bg: "bg-blue-50"   },
            { label: "Admins",        value: totalAdmins,  color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Activos",       value: activos,      color: "text-green-600",  bg: "bg-green-50"  },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Users size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabla ── */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-[#003366]" /> Usuarios del Sistema
            </h3>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar por nombre, DNI o correo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50" />
              </div>
              <div className="relative">
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as any)}
                  className="pl-4 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 appearance-none cursor-pointer">
                  <option value="TODOS">Todos</option>
                  <option value="WORKER">Workers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left pb-3 font-semibold">Trabajador</th>
                  <th className="text-left pb-3 font-semibold">DNI</th>
                  <th className="text-left pb-3 font-semibold">Tipo</th>
                  <th className="text-left pb-3 font-semibold">Charlas</th>
                  <th className="text-left pb-3 font-semibold">Examen</th>
                  <th className="text-left pb-3 font-semibold">Cumplimiento</th>
                  <th className="text-left pb-3 font-semibold">Estado</th>
                  <th className="text-left pb-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className={`hover:bg-gray-50 transition ${!u.activo ? "opacity-50" : ""}`}>
                    <td className="py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{u.nombre} {u.apellido}</p>
                        <p className="text-xs text-gray-400">{u.correo}</p>
                        {u.tipo !== "ADMIN" && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-300" />
                            {u.sedNombre}
                          </p>
                        )}
                        {u.telefono && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-300" />
                            {u.telefono}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{u.dni}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.tipo === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {u.tipo}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{u.charlas}</td>
                    <td className="py-3">
                      {u.examen === "—" ? <span className="text-gray-400 text-xs">—</span>
                        : <span className={`px-2 py-1 rounded-full text-xs font-semibold ${examenBadge(u.examen)}`}>{u.examen}</span>}
                    </td>
                    <td className="py-3">
                      {u.cumpl === 0 && u.tipo === "ADMIN" ? <span className="text-gray-400 text-xs">—</span>
                        : (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                              <div className={`h-full rounded-full ${u.cumpl >= 80 ? "bg-green-500" : u.cumpl >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${u.cumpl}%` }} />
                            </div>
                            <span className="text-gray-700 font-medium text-xs">{u.cumpl}%</span>
                          </div>
                        )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {u.activo ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
                        <span className={`text-xs font-medium ${u.activo ? "text-green-600" : "text-gray-400"}`}>{u.activo ? "Activo" : "Inactivo"}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditar(u)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#003366] bg-blue-50 hover:bg-blue-100 transition">
                          <Pencil size={12} /> Editar
                        </button>
                        <button onClick={() => handleToggleActivo(u)} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${u.activo ? "text-red-500 bg-red-50 hover:bg-red-100" : "text-green-600 bg-green-50 hover:bg-green-100"}`}>
                          <PowerOff size={12} /> {u.activo ? "Desactivar" : "Activar"}
                        </button>
                        <button onClick={() => handleDelete(u)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition">
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {isLoading && <div className="text-center py-12 text-gray-400"><p className="font-medium">Cargando usuarios...</p></div>}
            {!isLoading && usuariosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No se encontraron usuarios</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            {error && <p className="text-xs text-red-500">Error: {error}</p>}
            <p className="text-xs text-gray-400 ml-auto">Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</p>
          </div>
        </div>
      </div>

      {/* ── Modales ── */}
      <GestionarSedesModal
        open={sedesModalOpen}
        onClose={() => setSedesModalOpen(false)}
        onSedesChange={() => setSedesVersion((v) => v + 1)}
      />
      <EditUserModal
        open={editModalOpen}
        usuario={usuarioEditando ? {
          id:        usuarioEditando.id,
          nombre:    usuarioEditando.nombre,
          apellido:  usuarioEditando.apellido,
          dni:       usuarioEditando.dni,
          correo:    usuarioEditando.correo,
          tipo:      usuarioEditando.tipo,
          telefono:  usuarioEditando.telefono ?? "",
          idSede:    usuarioEditando.idSede,
        } : null}
        onClose={() => { setEditModalOpen(false); setUsuarioEditando(null); }}
        onSave={handleSaveEdit}
        refreshSedes={sedesVersion}
      />
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
        refreshSedes={sedesVersion}
      />
    </LayoutComponent>
  );
};

export default UserAdminView;