"use client";

import React, { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import UserRow from "@/components/UserRow";
import CreateUserModal from "@/components/CreateUserModal";
import { Users, User, ShieldCheck, Trophy } from "lucide-react";

export default function GestionUsuariosView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const [users, setUsers] = useState<any[]>([
    { id: 1, name: "María González", email: "maria.gonzalez@empresa.com", dept: "Producción", compliance: "100%" },
    { id: 2, name: "Carlos Rodriguez", email: "carlos.rodriguez@empresa.com", dept: "Mantenimiento", compliance: "97%" },
    { id: 3, name: "Ana Martínez", email: "ana.martinez@empresa.com", dept: "Administración", compliance: "100%" },
    { id: 4, name: "Juan Pérez", email: "juan.perez@empresa.com", dept: "Logística", compliance: "90%" },
    { id: 5, name: "Laura Sánchez", email: "laura.sanchez@empresa.com", dept: "Producción", compliance: "87%" },
  ]);

  const totals = { total: users.length, trabajadores: 4, admins: 1, promedio: "95%" };

  const openCreate = () => { setEditing(null); setModalOpen(true); };

  const handleSave = (data: any) => {
    if (data.id) {
      setUsers((s) => s.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
    } else {
      const id = Math.max(0, ...users.map((u) => u.id)) + 1;
      setUsers((s) => [{ id, name: data.name || data.email, email: data.email, dept: "Producción", compliance: "0%", role: data.role }, ...s]);
    }
  };

  const handleEdit = (user: any) => { setEditing(user); setModalOpen(true); };

  const handleDelete = (id: number) => {
    if (confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")) setUsers((s) => s.filter((u) => u.id !== id));
  };

  return (
    <LayoutComponent>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#003366]">Gestión de Usuarios</h1>
            <p className="text-gray-600 mt-2">Administra usuarios, roles y permisos del sistema</p>
          </div>
          <div>
            <button onClick={openCreate} className="bg-green-500 text-white px-4 py-2 rounded-full shadow hover:opacity-95">Crear Usuario</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <KpiComponent
            title="Total Usuarios"
            value={totals.total}
            showProgressBar={false}
            showIcon
            icon={Users}
            iconColor="text-[#00C2FF]"
          />

          <KpiComponent
            title="Trabajadores"
            value={totals.trabajadores}
            showProgressBar={false}
            showIcon
            icon={User}
            iconColor="text-[#7CC4F8]"
          />

          <KpiComponent
            title="Admins"
            value={totals.admins}
            showProgressBar={false}
            showIcon
            icon={ShieldCheck}
            iconColor="text-[#a23dc5]"
          />

          <KpiComponent
            title="Cumplimiento Promedio"
            value={totals.promedio}
            percentage={95}
            showProgressBar
            icon={Trophy}
            showIcon
            iconColor="text-[#34D399]"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <input placeholder="Buscar por nombre, email o departamento..." className="w-full p-3 rounded-full bg-gray-50 border border-gray-100" />
          </div>

          <div className="space-y-4">
            {users.map((u) => (
              <UserRow key={u.id} user={u} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>

        <CreateUserModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editing || undefined} />
      </div>
    </LayoutComponent>
  );
}
