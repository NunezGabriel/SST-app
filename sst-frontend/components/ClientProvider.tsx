"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";
import { FormatoAdminProvider } from "@/context/FormatoAdminContext";
import { DocumentoAdminProvider } from "@/context/DocumentoAdminContext";
import { CharlaAdminProvider } from "@/context/CharlaAdminContext";
import { InduccionAdminProvider } from "@/context/InduccionAdminContext";
import { ExamenAdminProvider } from "@/context/ExamenAdminContext";

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
              <InduccionAdminProvider>
                <ExamenAdminProvider>{children}</ExamenAdminProvider>
              </InduccionAdminProvider>
            </CharlaAdminProvider>
          </DocumentoAdminProvider>
        </FormatoAdminProvider>
      </UserAdminProvider>
    </AuthProvider>
  );
}
