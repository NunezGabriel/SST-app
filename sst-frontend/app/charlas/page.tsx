import CharlasAdminView from "@/views/admin/charlasAdminView";
import CharlasView from "@/views/charlasView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "WORKER";

export default function CharlasPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <CharlasAdminView />;
  }

  return <CharlasView />;
}
