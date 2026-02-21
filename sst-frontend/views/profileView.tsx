"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/cards/ProfileCard";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { useAuthContext } from "@/context/AuthContext";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import { useDocumentoAdminContext } from "@/context/DocumentoAdminContext";
import { getMeRequest, type UsuarioCompleto } from "@/lib/api/auth";
import {
  User,
  Mail,
  IdCard,
  Calendar,
  Shield,
  CheckCircle2,
  FileText,
  Award,
  LogOut,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function ProfileView() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { charlasUsuario } = useCharlaAdminContext();
  const { documentosUsuario } = useDocumentoAdminContext();
  const [usuarioCompleto, setUsuarioCompleto] = useState<UsuarioCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMeRequest(user.token);
        setUsuarioCompleto(response.user);
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.token]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading || !user || !usuarioCompleto) {
    return (
      <LayoutComponent>
        <div className="text-center py-12">Cargando perfil...</div>
      </LayoutComponent>
    );
  }

  // Calcular estadísticas para workers
  const charlasCompletadas = charlasUsuario?.filter(
    (c) => c.estado === "COMPLETADA"
  ).length || 0;
  const totalCharlas = 365; // Total anual
  const progresoCharlas = Math.round((charlasCompletadas / totalCharlas) * 100);

  const documentosVistos = documentosUsuario?.filter(
    (d) => d.estado === "VISTO"
  ).length || 0;
  const totalDocumentos = documentosUsuario?.length || 0;
  const progresoDocumentos =
    totalDocumentos > 0 ? Math.round((documentosVistos / totalDocumentos) * 100) : 0;

  // Generar iniciales
  const iniciales = `${usuarioCompleto.nombre.charAt(0)}${usuarioCompleto.apellido.charAt(0)}`.toUpperCase();

  // Formatear fecha
  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const esAdmin = usuarioCompleto.tipo === "ADMIN";

  return (
    <LayoutComponent>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="relative max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] p-12 text-white overflow-hidden">
            {/* Glows */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]"></div>
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <ProfileCard
                initials={iniciales}
                name={`${usuarioCompleto.nombre} ${usuarioCompleto.apellido}`}
                email={usuarioCompleto.correo}
              />
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="bg-white p-10 space-y-8">
            {/* Información Personal */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#003366]" />
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Correo Electrónico</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {usuarioCompleto.correo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <IdCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">DNI</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {usuarioCompleto.dni}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Rol</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {usuarioCompleto.tipo === "ADMIN" ? "Administrador" : "Trabajador"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha de Registro</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatearFecha(usuarioCompleto.fechaCreacion)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs - Diferentes según el rol */}
            {!esAdmin ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#003366]" />
                  Mi Progreso
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <KpiComponent
                    title="Charlas Completadas"
                    value={`${charlasCompletadas} / ${totalCharlas}`}
                    percentage={progresoCharlas}
                    showIcon
                    icon={CheckCircle2}
                    iconColor="text-emerald-500"
                    iconPosition="top-right"
                    progressBarColor="bg-linear-to-r from-[#003366] to-[#4b2c82]"
                  />

                  <KpiComponent
                    title="Documentos Revisados"
                    value={`${documentosVistos} / ${totalDocumentos}`}
                    percentage={progresoDocumentos}
                    showIcon
                    icon={FileText}
                    iconColor="text-blue-500"
                    iconPosition="top-right"
                    progressBarColor="bg-linear-to-r from-[#003366] to-[#4b2c82]"
                  />

                  <KpiComponent
                    title="Cumplimiento General"
                    value={`${Math.round((progresoCharlas + progresoDocumentos) / 2)}%`}
                    percentage={Math.round((progresoCharlas + progresoDocumentos) / 2)}
                    showIcon
                    icon={Award}
                    iconColor="text-purple-500"
                    iconPosition="top-right"
                    progressBarColor="bg-linear-to-r from-[#003366] to-[#4b2c82]"
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#003366]" />
                  Panel de Administración
                </h2>
                <div className="bg-gradient-to-r from-[#003366] to-[#4b2c82] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8" />
                    <h3 className="text-lg font-bold">Acceso Completo</h3>
                  </div>
                  <p className="text-sm text-gray-200">
                    Como administrador, tienes acceso completo a todas las funcionalidades
                    del sistema: gestión de usuarios, charlas, documentos, formatos,
                    configuración de exámenes y más.
                  </p>
                </div>
              </>
            )}

            {/* Estado de la cuenta */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#003366]" />
                Estado de la Cuenta
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Estado:{" "}
                    <span
                      className={`font-semibold ${
                        usuarioCompleto.activo
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {usuarioCompleto.activo ? "Activa" : "Inactiva"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Última actualización:{" "}
                    {formatearFecha(usuarioCompleto.fechaActualizacion)}
                  </p>
                </div>
                {usuarioCompleto.activo && (
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                )}
              </div>
            </div>

            {/* Logout */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-8 py-3 rounded-full font-medium shadow-md transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </main>
    </LayoutComponent>
  );
}
