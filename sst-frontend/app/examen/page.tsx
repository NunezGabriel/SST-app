"use client";

import ExamenView from "@/views/examenView";
import ExamenAdminView from "@/views/admin/examenAdminView";
import { useAuthContext } from "@/context/AuthContext";

export default function ExamenPage() {
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
    return <ExamenAdminView />;
  }

  return <ExamenView />;
}
