"use client";

import React, { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import AlertCard from "@/components/cards/AlertCard";
import ToastNotification from "@/components/ToastNotification";
import { Bell } from "lucide-react";

type NotificationType = "nuevo" | "pendiente" | "logro";

type AlertItem = {
  id: number;
  title: string;
  message?: string;
  severity: "danger" | "warning" | "info" | "success";
  type: NotificationType;
  time?: string;
  isNew?: boolean;
  read?: boolean;
};

export default function AlertasView() {
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 1,
      title: "Inspección de EPP Vencida",
      message: "Tu equipo requiere inspección inmediata.",
      severity: "danger",
      type: "pendiente",
      time: "Hace 5 minutos",
      isNew: true,
    },

    {
      id: 2,
      title: "Charla SST Pendiente",
      message: "Uso correcto de EPP vence mañana.",
      severity: "warning",
      type: "pendiente",
      time: "Hace 1 hora",
      isNew: true,
    },

    {
      id: 3,
      title: "Nuevo protocolo disponible",
      message: "Actualización en espacios confinados.",
      severity: "info",
      type: "nuevo",
      time: "Hace 3 horas",
    },

    {
      id: 4,
      title: "Logro desbloqueado",
      message: "Inspección semanal completada sin hallazgos.",
      severity: "success",
      type: "logro",
      time: "Ayer",
    },
  ]);

  const [toastOpen, setToastOpen] = useState(true);

  const deleteAlert = (id?: number) =>
    setAlerts((s) => s.filter((a) => a.id !== id));

  const markRead = (id?: number) =>
    setAlerts((s) =>
      s.map((a) => (a.id === id ? { ...a, read: true, isNew: false } : a)),
    );

  const counts = {
    pendientes: alerts.filter((a) => a.type === "pendiente").length,

    nuevos: alerts.filter((a) => a.type === "nuevo").length,

    logros: alerts.filter((a) => a.type === "logro").length,
  };

  return (
    <LayoutComponent>
      <div className="space-y-8">
        {/* HEADER */}
        {/* HEADER */}

        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#003366] flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-cyan-400" />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-[#022B54] mb-1">
                Notificaciones
              </h1>

              <p className="text-gray-600 text-lg">
                Mantente informado sobre actividades SST, avances y
                reconocimientos.
              </p>
            </div>
          </div>
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-gray-500">Pendientes</div>

            <div className="text-3xl font-bold text-[#003366]">
              {counts.pendientes}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-gray-500">Nuevas</div>

            <div className="text-3xl font-bold text-[#003366]">
              {counts.nuevos}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-sm text-gray-500">Logros</div>

            <div className="text-3xl font-bold text-[#4b2c82]">
              {counts.logros}
            </div>
          </div>
        </div>

        {/* LISTA */}
        <div className="space-y-4">
          {alerts.map((a) => (
            <AlertCard
              key={a.id}
              id={a.id}
              title={a.title}
              message={a.message}
              type={a.type}
              time={a.time}
              isNew={!!a.isNew}
              read={!!a.read}
              onDelete={(id) => deleteAlert(id as number)}
              onMarkRead={(id) => markRead(id as number)}
            />
          ))}
        </div>

        {toastOpen && (
          <ToastNotification
            type="pendiente"
            title="Nueva alerta"
            message="Inspección requerida inmediatamente"
            onClose={() => setToastOpen(false)}
          />
        )}
      </div>
    </LayoutComponent>
  );
}
