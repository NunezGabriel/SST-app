"use client";

import React, { useMemo } from "react";
import LayoutComponent from "@/components/layoutComponent";
import AlertCard from "@/components/cards/AlertCard";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useNotificacionContext } from "@/context/NotificacionContext";
import type { TipoNotificacion } from "@/lib/api/notificaciones";

type AlertCardType = "pendiente" | "logro" | "nuevo";

const tipoMap: Record<TipoNotificacion, AlertCardType> = {
  PENDIENTE: "pendiente",
  LOGRO: "logro",
  NUEVO: "nuevo",
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return "Ayer";
  return `Hace ${diffDays} días`;
}

export default function AlertasView() {
  const { notificaciones, isLoading, marcarLeida, marcarTodasLeidas, reload } =
    useNotificacionContext();

  const counts = useMemo(
    () => ({
      pendientes: notificaciones.filter((n) => n.tipo === "PENDIENTE").length,
      nuevas: notificaciones.filter((n) => n.tipo === "NUEVO").length,
      logros: notificaciones.filter((n) => n.tipo === "LOGRO").length,
      noLeidas: notificaciones.filter((n) => !n.leida).length,
    }),
    [notificaciones]
  );

  const handleMarcarLeida = async (id?: string | number) => {
    if (id !== undefined) await marcarLeida(Number(id));
  };

  return (
    <LayoutComponent>
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
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

            {/* Botón marcar todas leídas */}
            {counts.noLeidas > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="flex items-center gap-2 bg-[#003366] hover:bg-[#004080] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <CheckCheck className="w-4 h-4" />
                Marcar todas leídas
              </button>
            )}
          </div>
        </div>

        {/* KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-yellow-400">
            <div className="text-sm text-gray-500">Pendientes</div>
            <div className="text-3xl font-bold text-[#003366]">
              {counts.pendientes}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-cyan-400">
            <div className="text-sm text-gray-500">Nuevas</div>
            <div className="text-3xl font-bold text-[#003366]">
              {counts.nuevas}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-amber-400">
            <div className="text-sm text-gray-500">Logros</div>
            <div className="text-3xl font-bold text-[#4b2c82]">
              {counts.logros}
            </div>
          </div>
        </div>

        {/* LISTA */}
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 animate-pulse" />
            <p>Cargando notificaciones...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Inbox className="w-16 h-16 mb-4 opacity-40" />
            <p className="text-lg font-medium">Sin notificaciones</p>
            <p className="text-sm mt-1">
              Aquí aparecerán tus alertas y logros desbloqueados.
            </p>
            <button
              onClick={reload}
              className="mt-4 text-sm text-[#003366] hover:underline"
            >
              Actualizar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones.map((n) => (
              <AlertCard
                key={n.id}
                id={n.id}
                title={n.nombre}
                message={n.descripcion}
                type={tipoMap[n.tipo]}
                time={formatRelativeTime(n.fechaCreacion)}
                isNew={!n.leida}
                read={n.leida}
                onMarkRead={handleMarcarLeida}
              />
            ))}
          </div>
        )}
      </div>
    </LayoutComponent>
  );
}
