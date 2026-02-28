"use client";

import { useAuthContext } from "@/context/AuthContext";
import CuadroControlView from "@/views/cuadroControlView";
import CuadroControlAdminView from "@/views/admin/cuadroControlAdminView";

export default function RegistroPage() {
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
    return <CuadroControlAdminView />;
  }

  return <CuadroControlView />;
}
