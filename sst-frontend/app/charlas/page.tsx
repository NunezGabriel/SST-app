"use client";

import CharlasAdminView from "@/views/admin/charlasAdminView";
import CharlasView from "@/views/charlasView";
import { useAuthContext } from "@/context/AuthContext";

export default function CharlasPage() {
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
    return <CharlasAdminView />;
  }

  return <CharlasView />;
}
