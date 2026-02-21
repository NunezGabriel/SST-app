"use client";

import FormatosView from "@/views/formatosView";
import FormatoAdminView from "@/views/admin/formatoAdminView";
import { useAuthContext } from "@/context/AuthContext";

export default function FormatosPage() {
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
    return <FormatoAdminView />;
  }

  return <FormatosView />;
}
