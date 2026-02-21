"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";
import { FormatoAdminProvider } from "@/context/FormatoAdminContext";
import { DocumentoAdminProvider } from "@/context/DocumentoAdminContext";
import { CharlaAdminProvider } from "@/context/CharlaAdminContext";
import { InduccionAdminProvider } from "@/context/InduccionAdminContext";

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
            <CharlaAdminProvider>
              <InduccionAdminProvider>{children}</InduccionAdminProvider>
            </CharlaAdminProvider>
          </DocumentoAdminProvider>
        </FormatoAdminProvider>
      </UserAdminProvider>
    </AuthProvider>
  );
}
