"use client";

import React, { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import AlertCard from "@/components/AlertCard";
import ToastNotification from "@/components/ToastNotification";

type AlertItem = {
  id: number;
  title: string;
  message?: string;
  severity: "danger" | "warning" | "info" | "success";
  time?: string;
  isNew?: boolean;
  read?: boolean;
};

export default function AlertasView() {
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

  const deleteAlert = (id?: number) => {
    setAlerts((s) => s.filter((a) => a.id !== id));
  };

  const markRead = (id?: number) => {
    setAlerts((s) => s.map((a) => (a.id === id ? { ...a, read: true, isNew: false } : a)));
  };

  const counts = {
    urgentes: alerts.filter((a) => a.severity === "danger").length,
    advertencias: alerts.filter((a) => a.severity === "warning").length,
    informacion: alerts.filter((a) => a.severity === "info").length,
    logros: alerts.filter((a) => a.severity === "success").length,
  };

  return (
    <LayoutComponent>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-[#003366]">Alertas y Notificaciones</h1>
            <div className="mt-3">
              <div className="bg-[#E6F7FB] text-[#003366] rounded-xl p-4 max-w-xl">
                <div className="font-medium">Mantente informado sobre tus actividades de seguridad</div>
                <div className="text-sm text-slate-700 mt-1">Revisa tus alertas recientes y toma acciones cuando sea necesario.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#E6F7FB] text-[#003366] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Sistema Activo
            </div>
          </div>
        </div>

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
              onDelete={deleteAlert}
              onMarkRead={markRead}
            />
          ))}
        </div>

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
  );
}
