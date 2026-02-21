"use client";

import DocumentacionView from "@/views/documentacionView";
import DocumentacionAdminView from "@/views/admin/documentacionAdminView";
import { useAuthContext } from "@/context/AuthContext";

export default function DocumentacionPage() {
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
    return <DocumentacionAdminView />;
  }

  return <DocumentacionView />;
}
