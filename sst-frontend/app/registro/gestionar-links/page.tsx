"use client";

import { useAuthContext } from "@/context/AuthContext";
import GestionarLinkView from "@/views/admin/gestionarLinkView";

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
    return <GestionarLinkView />;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-lg">
        No tienes permiso para acceder a esta página.
      </div>
    </div>
  );
}
