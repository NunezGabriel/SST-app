import { Suspense } from "react";
import ResetPasswordView from "@/views/auth/resetPasswordView";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>}>
      <ResetPasswordView />
    </Suspense>
  );
}