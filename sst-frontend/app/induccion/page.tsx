"use client";

import InduccionView from "@/views/induccionView";
import InduccionAdminView from "@/views/admin/induccionAdminView";
import { useAuthContext } from "@/context/AuthContext";

export default function InduccionPage() {
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
    return <InduccionAdminView />;
  }

  return <InduccionView />;
}
