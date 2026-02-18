"use client";

import React, { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import AlertCard from "@/components/AlertCard";
import ToastNotification from "@/components/ToastNotification";
import { Plus } from "lucide-react";

type Severity = "danger" | "warning" | "info" | "success";

type AlertItem = {
  id: number;
  title: string;
  message?: string;
  severity: Severity;
  time?: string;
  isNew?: boolean;
  read?: boolean;
};

type EditAlertData = {
  id: number;
  title: string;
  message: string;
  severity: Severity;
};

export default function AlertasAdminView() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      title: "Inspección de EPP Vencida",
      message:
        "Tu equipo de protección personal requiere inspección inmediata. Dirígete al almacén de seguridad.",
      severity: "danger",
      time: "Hace 5 minutos",
      isNew: true,
    },
    {
      id: 2,
      title: "Charla Pendiente",
      message: 'Tienes una charla de seguridad pendiente que vence mañana: "Uso Correcto de EPP en Altura".',
      severity: "warning",
      time: "Hace 1 hora",
      isNew: true,
    },
    {
      id: 3,
      title: "Nuevo Protocolo Disponible",
      message: "Se ha actualizado el protocolo de trabajo en espacios confinados.",
      severity: "info",
      time: "Hace 3 horas",
    },
    {
      id: 4,
      title: "Logro: Inspección completada",
      message: "Inspección semanal completada sin hallazgos.",
      severity: "success",
      time: "Ayer",
    },
  ]);

  const [toastOpen, setToastOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editAlert, setEditAlert] = useState<EditAlertData | null>(null);
  const [isNew, setIsNew] = useState(false);

  const deleteAlert = (id?: number) => {
    if (confirm("¿Eliminar alerta? Esta acción no se puede deshacer.")) {
      setAlerts((s) => s.filter((a) => a.id !== id));
    }
  };

  const markRead = (id?: number) => {
    setAlerts((s) => s.map((a) => (a.id === id ? { ...a, read: true, isNew: false } : a)));
  };

  const openEdit = (id: number) => {
    const found = alerts.find((a) => a.id === id);
    if (!found) return;
    setEditAlert({
      id: found.id,
      title: found.title,
      message: found.message ?? "",
      severity: found.severity,
    });
    setIsNew(false);
    setEditOpen(true);
  };

  const openNew = () => {
    setEditAlert({
      id: Math.max(0, ...alerts.map((a) => a.id)) + 1,
      title: "",
      message: "",
      severity: "info",
    });
    setIsNew(true);
    setEditOpen(true);
  };

  const handleSave = (data: EditAlertData) => {
    if (isNew) {
      setAlerts((prev) => [
        {
          id: data.id,
          title: data.title,
          message: data.message,
          severity: data.severity,
          time: "Hace unos momentos",
          isNew: true,
        },
        ...prev,
      ]);
    } else {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === data.id
            ? {
                ...a,
                title: data.title,
                message: data.message,
                severity: data.severity,
                time: "Actualizado recientemente",
              }
            : a
        )
      );
    }
    setEditOpen(false);
    setIsNew(false);
  };

  const counts = {
    urgentes: alerts.filter((a) => a.severity === "danger").length,
    advertencias: alerts.filter((a) => a.severity === "warning").length,
    informacion: alerts.filter((a) => a.severity === "info").length,
    logros: alerts.filter((a) => a.severity === "success").length,
  };

  return (
    <>
      <LayoutComponent>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#003366]">Alertas y Notificaciones</h1>
              <div className="mt-3">
                <div className="bg-[#E6F7FB] text-[#003366] rounded-xl p-4 max-w-xl">
                  <div className="font-medium">Mantente informado sobre tus actividades de seguridad</div>
                  <div className="text-sm text-slate-700 mt-1">
                    Revisa tus alertas recientes y toma acciones cuando sea necesario.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Botón agregar */}
              <button
                onClick={openNew}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#00BFFF] text-white font-bold shadow hover:bg-[#0099cc] transition text-sm"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <Plus className="w-4 h-4" /> Agregar Alerta
              </button>

              <div className="bg-[#E6F7FB] text-[#003366] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Sistema Activo
              </div>
            </div>
          </div>

          {/* Contadores */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-500">Urgentes</div>
              <div className="text-2xl font-bold text-[#003366]">{counts.urgentes}</div>
            </div>
            <div className="rounded-xl p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-500">Advertencias</div>
              <div className="text-2xl font-bold text-[#003366]">{counts.advertencias}</div>
            </div>
            <div className="rounded-xl p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-500">Información</div>
              <div className="text-2xl font-bold text-[#003366]">{counts.informacion}</div>
            </div>
            <div className="rounded-xl p-4 bg-white shadow-sm">
              <div className="text-sm text-gray-500">Logros</div>
              <div className="text-2xl font-bold text-[#003366]">{counts.logros}</div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {alerts.map((a) => (
              <AlertCard
                key={a.id}
                id={a.id}
                title={a.title}
                message={a.message}
                severity={a.severity}
                time={a.time}
                isNew={!!a.isNew}
                read={!!a.read}
                onDelete={(id) => deleteAlert(id as number)}
                onMarkRead={(id) => markRead(id as number)}
                onEdit={(id) => openEdit(id as number)}
              />
            ))}
          </div>

          {/* Historial */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Alertas</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <div>Alerta de EPP - Sitio A</div>
                <div className="text-gray-500">2 horas</div>
              </div>
              <div className="flex justify-between">
                <div>Capacitación completada</div>
                <div className="text-gray-500">1 día</div>
              </div>
            </div>
          </div>

          {toastOpen && (
            <ToastNotification
              title="Nueva Alerta"
              message="Inspección de EPP requerida inmediatamente"
              onClose={() => setToastOpen(false)}
            />
          )}
        </div>
      </LayoutComponent>

      {/* Modal Crear / Editar */}
      {editOpen && editAlert && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            {/* Cerrar */}
            <button
              onClick={() => { setEditOpen(false); setIsNew(false); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-[#003366]">
              {isNew ? "Crear Alerta" : "Editar Alerta"}
            </h2>
            <p className="text-gray-500 mb-6">
              {isNew
                ? "Completa los detalles de la nueva alerta"
                : "Modifica los detalles de la alerta"}
            </p>

            {/* Título */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Título de la Alerta
              </label>
              <input
                type="text"
                value={editAlert.title}
                onChange={(e) => setEditAlert({ ...editAlert, title: e.target.value })}
                placeholder="Ej: Inspección de EPP Vencida"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Tipo */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo de Alerta
              </label>
              <select
                value={editAlert.severity}
                onChange={(e) =>
                  setEditAlert({ ...editAlert, severity: e.target.value as Severity })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="info"> Información</option>
                <option value="warning"> Advertencia</option>
                <option value="danger"> Peligro</option>
                <option value="success"> Éxito / Logro</option>
              </select>
            </div>

            {/* Mensaje */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Mensaje
              </label>
              <textarea
                rows={3}
                value={editAlert.message}
                onChange={(e) => setEditAlert({ ...editAlert, message: e.target.value })}
                placeholder="Descripción breve de la alerta..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setEditOpen(false); setIsNew(false); }}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (editAlert.title.trim()) {
                    handleSave(editAlert);
                  } else {
                    alert("Por favor ingresa un título");
                  }
                }}
                className="px-5 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600"
              >
                {isNew ? "Crear Alerta" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}