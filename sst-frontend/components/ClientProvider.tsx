"use client";

import { AuthProvider } from "@/context/AuthContext";
import { UserAdminProvider } from "@/context/UserAdminContext";
import { FormatoAdminProvider } from "@/context/FormatoAdminContext";
import { DocumentoAdminProvider } from "@/context/DocumentoAdminContext";
import { CharlaAdminProvider } from "@/context/CharlaAdminContext";
import { InduccionAdminProvider } from "@/context/InduccionAdminContext";
import { ExamenAdminProvider } from "@/context/ExamenAdminContext";
import { NotificacionProvider } from "@/context/NotificacionContext";
import { LogroProvider } from "@/context/LogroContext";

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
                <ExamenAdminProvider>
                  <NotificacionProvider>
                    <LogroProvider>{children}</LogroProvider>
                  </NotificacionProvider>
                </ExamenAdminProvider>
              </InduccionAdminProvider>
            </CharlaAdminProvider>
          </DocumentoAdminProvider>
        </FormatoAdminProvider>
      </UserAdminProvider>
    </AuthProvider>
  );
}
