"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/cards/ProfileCard";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";

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
    <LayoutComponent>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="relative max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] p-12 text-white overflow-hidden">
            {/* Glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <ProfileCard
                name="Juan Desarrollador"
                email="juan.dev@empresa.com"
              />
            </div>
            {/* CONTENIDO */}
            <div className=" p-10">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <KpiComponent
                  title="Charlas Completadas"
                  value="24 / 30"
                  percentage={80}
                  showIcon
                  iconPosition="top-right"
                  progressBarColor="bg-gradient-to-r from-[#003366] to-[#4b2c82]"
                />

                <KpiComponent
                  title="Cumplimiento"
                  value="85%"
                  percentage={85}
                  showIcon
                  iconPosition="top-right"
                  progressBarColor="bg-gradient-to-r from-[#003366] to-[#4b2c82]"
                />

                <KpiComponent
                  title="Alertas Pendientes"
                  value="3"
                  showProgressBar={false}
                  showIcon
                  iconPosition="top-right"
                  variant="alert"
                />
              </div>

              {/* Logout */}
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-[#ef4444] hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutComponent>
  );
}
