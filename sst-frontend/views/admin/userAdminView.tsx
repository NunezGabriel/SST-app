"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import EditUserModal, {
  UserFormData,
} from "@/components/modals/user/editUserModal";
import CreateUserModal from "@/components/modals/user/createUserModal";
import {
  Users,
  PlusCircle,
  Pencil,
  PowerOff,
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type TipoUsuario = "WORKER" | "ADMIN";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  correo: string;
  tipo: TipoUsuario;
  activo: boolean;
  charlas: string;
  examen: string;
  cumpl: number;
}

const usuariosMock: Usuario[] = [
  {
    id: 1,
    nombre: "Ana",
    apellido: "Flores",
    dni: "12345678",
    correo: "ana@empresa.com",
    tipo: "WORKER",
    activo: true,
    charlas: "28/30",
    examen: "Aprobado",
    cumpl: 96,
  },
  {
    id: 2,
    nombre: "Pedro",
    apellido: "Salas",
    dni: "23456789",
    correo: "pedro@empresa.com",
    tipo: "WORKER",
    activo: true,
    charlas: "20/30",
    examen: "Pendiente",
    cumpl: 68,
  },
  {
    id: 3,
    nombre: "Luis",
    apellido: "Gómez",
    dni: "34567890",
    correo: "luis@empresa.com",
    tipo: "WORKER",
    activo: true,
    charlas: "5/30",
    examen: "No rendido",
    cumpl: 20,
  },
  {
    id: 4,
    nombre: "María",
    apellido: "Torres",
    dni: "45678901",
    correo: "maria@empresa.com",
    tipo: "WORKER",
    activo: false,
    charlas: "25/30",
    examen: "Bloqueada",
    cumpl: 72,
  },
  {
    id: 5,
    nombre: "Carlos",
    apellido: "Ríos",
    dni: "56789012",
    correo: "carlos@empresa.com",
    tipo: "WORKER",
    activo: true,
    charlas: "30/30",
    examen: "Aprobado",
    cumpl: 100,
  },
  {
    id: 6,
    nombre: "Laura",
    apellido: "Mendoza",
    dni: "67890123",
    correo: "laura@empresa.com",
    tipo: "ADMIN",
    activo: true,
    charlas: "—",
    examen: "—",
    cumpl: 0,
  },
];

const examenBadge = (examen: string) => {
  if (examen === "Aprobado") return "bg-green-100 text-green-700";
  if (examen === "Bloqueada") return "bg-red-100 text-red-700";
  if (examen === "Pendiente") return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-500";
};

const UserAdminView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"TODOS" | TipoUsuario>("TODOS");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = `${u.nombre} ${u.apellido}`.toLowerCase();
    const coincideBusqueda =
      nombre.includes(busqueda.toLowerCase()) ||
      u.dni.includes(busqueda) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideTipo = filtroTipo === "TODOS" || u.tipo === filtroTipo;
    return coincideBusqueda && coincideTipo;
  });

  const handleEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setEditModalOpen(true);
  };

  const handleDesactivar = (id: number) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)),
    );
  };

  const handleSaveEdit = (data: UserFormData) => {
    if (!usuarioEditando) return;
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioEditando.id
          ? {
              ...u,
              nombre: data.nombre,
              apellido: data.apellido,
              dni: data.dni,
              correo: data.correo,
              tipo: data.tipo,
            }
          : u,
      ),
    );
    setEditModalOpen(false);
    setUsuarioEditando(null);
  };

  const handleCreate = (data: UserFormData) => {
    const nuevo: Usuario = {
      id: Date.now(),
      nombre: data.nombre,
      apellido: data.apellido,
      dni: data.dni,
      correo: data.correo,
      tipo: data.tipo,
      activo: true,
      charlas: data.tipo === "WORKER" ? "0/30" : "—",
      examen: data.tipo === "WORKER" ? "No rendido" : "—",
      cumpl: 0,
    };
    setUsuarios((prev) => [nuevo, ...prev]);
    setCreateModalOpen(false);
  };

  const totalWorkers = usuarios.filter((u) => u.tipo === "WORKER").length;
  const totalAdmins = usuarios.filter((u) => u.tipo === "ADMIN").length;
  const activos = usuarios.filter((u) => u.activo).length;

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Administración de Usuarios
            </h1>
            <p className="text-gray-500 mt-1">
              Gestión de workers y administradores del sistema
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <PlusCircle size={18} />
            Crear Usuario
          </button>
        </div>

        {/* ── KPIs rápidos ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Workers",
              value: totalWorkers,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Admins",
              value: totalAdmins,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              label: "Activos",
              value: activos,
              color: "text-green-600",
              bg: "bg-green-50",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}
              >
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
          {/* Tabla header con filtros */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-[#003366]" />
              Usuarios del Sistema
            </h3>
            <div className="flex gap-3 w-full sm:w-auto">
              {/* Búsqueda */}
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre, DNI o correo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50"
                />
              </div>
              {/* Filtro tipo */}
              <div className="relative">
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as any)}
                  className="pl-4 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 appearance-none cursor-pointer"
                >
                  <option value="TODOS">Todos</option>
                  <option value="WORKER">Workers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla */}
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
                  <tr
                    key={u.id}
                    className={`hover:bg-gray-50 transition ${!u.activo ? "opacity-50" : ""}`}
                  >
                    <td className="py-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {u.nombre} {u.apellido}
                        </p>
                        <p className="text-xs text-gray-400">{u.correo}</p>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{u.dni}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.tipo === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.tipo}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{u.charlas}</td>
                    <td className="py-3">
                      {u.examen === "—" ? (
                        <span className="text-gray-400 text-xs">—</span>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${examenBadge(u.examen)}`}
                        >
                          {u.examen}
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {u.cumpl === 0 && u.tipo === "ADMIN" ? (
                        <span className="text-gray-400 text-xs">—</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[60px]">
                            <div
                              className={`h-full rounded-full ${u.cumpl >= 80 ? "bg-green-500" : u.cumpl >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${u.cumpl}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-medium text-xs">
                            {u.cumpl}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {u.activo ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-gray-400" />
                        )}
                        <span
                          className={`text-xs font-medium ${u.activo ? "text-green-600" : "text-gray-400"}`}
                        >
                          {u.activo ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditar(u)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#003366] bg-blue-50 hover:bg-blue-100 transition"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDesactivar(u.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            u.activo
                              ? "text-red-500 bg-red-50 hover:bg-red-100"
                              : "text-green-600 bg-green-50 hover:bg-green-100"
                          }`}
                        >
                          <PowerOff size={12} />
                          {u.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No se encontraron usuarios</p>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-4 text-right">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
          </p>
        </div>
      </div>

      {/* Modales */}
      <EditUserModal
        open={editModalOpen}
        usuario={
          usuarioEditando
            ? {
                id: usuarioEditando.id,
                nombre: usuarioEditando.nombre,
                apellido: usuarioEditando.apellido,
                dni: usuarioEditando.dni,
                correo: usuarioEditando.correo,
                tipo: usuarioEditando.tipo,
              }
            : null
        }
        onClose={() => {
          setEditModalOpen(false);
          setUsuarioEditando(null);
        }}
        onSave={handleSaveEdit}
      />
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </LayoutComponent>
  );
};

export default UserAdminView;
