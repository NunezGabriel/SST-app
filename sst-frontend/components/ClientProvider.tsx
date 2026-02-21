"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";
import { FormatoAdminProvider } from "@/context/FormatoAdminContext";
import { DocumentoAdminProvider } from "@/context/DocumentoAdminContext";
import { CharlaAdminProvider } from "@/context/CharlaAdminContext";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <UserAdminProvider>
        <FormatoAdminProvider>
          <DocumentoAdminProvider>
            <CharlaAdminProvider>{children}</CharlaAdminProvider>
          </DocumentoAdminProvider>
        </FormatoAdminProvider>
      </UserAdminProvider>
    </AuthProvider>
  );
}
