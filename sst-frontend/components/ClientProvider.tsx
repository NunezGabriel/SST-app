"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";
import { FormatoAdminProvider } from "@/context/FormatoAdminContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserAdminProvider>
        <FormatoAdminProvider>{children}</FormatoAdminProvider>
      </UserAdminProvider>
    </AuthProvider>
  );
}
