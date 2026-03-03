"use client";

import { useAuthContext } from "@/context/AuthContext";
import GestionarCarpetaView from "@/views/admin/gestionarCarpetaView";

export default function GestionarPage() {
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
    return <GestionarCarpetaView />;
  }

  return <GestionarCarpetaView />;
}
