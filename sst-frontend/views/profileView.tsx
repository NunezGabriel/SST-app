"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/ProfileCard";
import StatsCard from "@/components/StatsCard";
import InfoCard from "@/components/InfoCard";

export default function ProfileView(): JSX.Element {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } catch (e) {
      // ignore errors for now
    }
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        {/* Top gradient banner */}
        <div className="absolute -top-6 left-6 right-6 h-28 bg-linear-to-r from-[#003366] to-[#004d80] rounded-xl" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="-mt-8">
            <ProfileCard
              name="Juan Desarrollador"
              email="juan.dev@empresa.com"
            />
          </div>

          <div className="mt-6 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                soft
                label="Charlas Completadas"
                value={<span className="text-3xl font-bold">24/30</span>}
                progress={80}
              />
              <StatsCard
                soft
                label="Cumplimiento"
                value={<span className="text-3xl font-bold">85%</span>}
                progress={85}
              />
              <StatsCard
                label="Alertas Pendientes"
                value={<span className="text-3xl font-bold">3</span>}
              />
            </div>

            <div className="mt-6 flex justify-center">
              <div className="bg-[#E6F7FB] rounded-full p-2 shadow-sm">
                <button
                  onClick={handleLogout}
                  className="bg-[#ef4444] text-white px-6 py-3 rounded-full shadow-md hover:opacity-95 transition"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard title="Información">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>
                    <span className="font-medium text-slate-700">Cargo:</span>{" "}
                    Ingeniero Fullstack
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">
                      Ubicación:
                    </span>{" "}
                    Remoto - Perú
                  </li>
                  <li>
                    <span className="font-medium text-slate-700">
                      Última sesión:
                    </span>{" "}
                    2026-02-10 09:12
                  </li>
                </ul>
              </InfoCard>

              <InfoCard title="Actividad reciente">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Completó la charla "Introducción a SST" • 2 días</li>
                  <li>Subió su progreso de cumplimiento • 1 semana</li>
                  <li>Actualizó su perfil • 3 semanas</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
