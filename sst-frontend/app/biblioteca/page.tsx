import DocumentacionView from "@/views/documentacionView";
import DocumentacionAdminView from "@/views/admin/documentacionAdminView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "WORKER";

export default function DocumentacionPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <DocumentacionAdminView />;
  }

  return <DocumentacionView />;
}
