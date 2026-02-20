import InduccionView from "@/views/induccionView";
import InduccionAdminView from "@/views/admin/induccionAdminView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "ADMIN";

export default function InduccionPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <InduccionAdminView />;
  }

  return <InduccionView />;
}
