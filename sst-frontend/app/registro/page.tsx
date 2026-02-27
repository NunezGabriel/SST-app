"use client";

import { useAuthContext } from "@/context/AuthContext";
import RegistroAdminView from "@/views/admin/registroAdminView";
import RegistroView from "@/views/registroView";

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
    return <RegistroAdminView />;
  }

  return <RegistroView />;
}
