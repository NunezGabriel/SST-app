"use client";

import DashboardView from "@/views/dashboardView";
import DasboardAdminView from "@/views/admin/dashboardAdminView";
import { useAuthContext } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.rol === "ADMIN") {
    return <DasboardAdminView />;
  }

  return <DashboardView />;
}
