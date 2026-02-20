import FormatosView from "@/views/formatosView";
import FormatoAdminView from "@/views/admin/formatoAdminView";

type UserRole = "WORKER" | "ADMIN";

// TODO: reemplazar con auth real (ej: getServerSession, useAuth, context, etc.)
let MOCK_USER_ROLE: UserRole = "ADMIN";

export default function CharlasPage() {
  if (MOCK_USER_ROLE === "ADMIN") {
    return <FormatoAdminView />;
  }

  return <FormatosView />;
}
