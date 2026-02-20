import DashboardView from "@/views/dashboardView";
import DasboardAdminView from "@/views/admin/dashboardAdminView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "ADMIN";

export default function DashboardPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <DasboardAdminView />;
  }

  return <DashboardView />;
}
