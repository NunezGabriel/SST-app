"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserAdminProvider>{children}</UserAdminProvider>
    </AuthProvider>
  );
}
