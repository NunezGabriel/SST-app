import ExamenView from "@/views/examenView";
import ExamenAdminView from "@/views/admin/examenAdminView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "ADMIN";

export default function ExamenPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <ExamenAdminView />;
  }

  return <ExamenView />;
}
