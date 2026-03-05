"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileCard from "@/components/cards/ProfileCard";
import LayoutComponent from "@/components/layoutComponent";
import KpiComponent from "@/components/kpiComponent";
import { useAuthContext } from "@/context/AuthContext";
import { useCharlaAdminContext } from "@/context/CharlaAdminContext";
import { useDocumentoAdminContext } from "@/context/DocumentoAdminContext";
import { useLogroContext } from "@/context/LogroContext";
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
  Trophy,
  Star,
  BadgeCheck,
  RefreshCw,
  Phone,
  MapPin,
} from "lucide-react";

// Mapeo icono backend → componente lucide
const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  star: Star,
  certificate: BadgeCheck,
  award: Award,
};

export default function ProfileView() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { charlasUsuario, reloadUsuario: reloadCharlas } =
    useCharlaAdminContext();
  const { documentosUsuario, reloadUsuario: reloadDocumentos } =
    useDocumentoAdminContext();
  const {
    logrosUsuario,
    logrosAdmin,
    isLoading: logrosLoading,
    reload: reloadLogros,
  } = useLogroContext();
  const [usuarioCompleto, setUsuarioCompleto] =
    useState<UsuarioCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── FUNCIÓN PARA REFRESCAR TODOS LOS DATOS ──
  const refreshAllData = async () => {
    if (!user?.token) return;

    setIsRefreshing(true);
    try {
      // Refrescar datos del usuario
      const response = await getMeRequest(user.token);
      setUsuarioCompleto(response.user);

      // Refrescar datos según el rol
      if (response.user.tipo === "WORKER") {
        await Promise.all([
          reloadCharlas?.(),
          reloadDocumentos?.(),
          reloadLogros?.(),
        ]);
      } else {
        await reloadLogros?.();
      }
    } catch (error) {
      console.error("Error al refrescar datos:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── CARGA INICIAL ──
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

  // ── AUTO-REFRESH cada 30 segundos (opcional - puedes comentar esto si no lo quieres) ──
  useEffect(() => {
    if (!user?.token) return;

    const interval = setInterval(() => {
      refreshAllData();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user?.token, reloadCharlas, reloadDocumentos, reloadLogros]);

  // ── ESCUCHAR CAMBIOS EN LocalStorage (cuando otra pestaña actualiza) ──
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "logros_updated" ||
        e.key === "charlas_updated" ||
        e.key === "documentos_updated"
      ) {
        refreshAllData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [reloadCharlas, reloadDocumentos, reloadLogros]);

  // ── ESCUCHAR EVENTO CUSTOM DE LOGRO DESBLOQUEADO ──
  useEffect(() => {
    const handleLogroDesbloqueado = () => {
      refreshAllData();
    };

    window.addEventListener("logro_desbloqueado", handleLogroDesbloqueado);
    return () =>
      window.removeEventListener("logro_desbloqueado", handleLogroDesbloqueado);
  }, [reloadCharlas, reloadDocumentos, reloadLogros]);

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
  const charlasCompletadas =
    charlasUsuario?.filter((c) => c.estado === "COMPLETADA").length || 0;
  const totalCharlas = charlasUsuario?.length || 0;
  const progresoCharlas =
    totalCharlas > 0
      ? Math.round((charlasCompletadas / totalCharlas) * 100)
      : 0;

  const documentosVistos =
    documentosUsuario?.filter((d) => d.estado === "VISTO").length || 0;
  const totalDocumentos = documentosUsuario?.length || 0;
  const progresoDocumentos =
    totalDocumentos > 0
      ? Math.round((documentosVistos / totalDocumentos) * 100)
      : 0;

  const iniciales =
    `${usuarioCompleto.nombre.charAt(0)}${usuarioCompleto.apellido.charAt(0)}`.toUpperCase();

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const esAdmin = usuarioCompleto.tipo === "ADMIN";

  return (
    <LayoutComponent>
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="relative max-w-5xl w-full rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="relative bg-gradient-to from-[#003366] via-[#4b2c82] to-[#0066a3] p-12 text-white overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500 opacity-20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400 opacity-20 rounded-full blur-[90px]" />
            <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-[80px]" />

            {/* ── BOTÓN REFRESH ── */}
            <button
              onClick={refreshAllData}
              disabled={isRefreshing}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              title="Actualizar datos"
            >
              <RefreshCw
                className={`w-5 h-5 text-white ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

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
                      {usuarioCompleto.tipo === "ADMIN"
                        ? "Administrador"
                        : "Trabajador"}
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
                {usuarioCompleto.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {usuarioCompleto.telefono}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Sede</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {usuarioCompleto.sede?.nombre ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KPIs / Panel según rol */}
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
                    percentage={Math.round(
                      (progresoCharlas + progresoDocumentos) / 2,
                    )}
                    showIcon
                    icon={Award}
                    iconColor="text-purple-500"
                    iconPosition="top-right"
                    progressBarColor="bg-linear-to-r from-[#003366] to-[#4b2c82]"
                  />
                </div>

                {/* ── LOGROS WORKER ── */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Mis Logros
                    {isRefreshing && (
                      <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                  </h2>

                  {logrosLoading ? (
                    <p className="text-sm text-gray-400">Cargando logros...</p>
                  ) : logrosUsuario.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      Aún no tienes logros registrados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {logrosUsuario.map((ul) => {
                        const conseguido = ul.estado === "CONSEGUIDO";
                        const IconComponent =
                          iconMap[ul.logro.icono ?? "trophy"] ?? Trophy;

                        return (
                          <div
                            key={ul.id}
                            className={`relative rounded-2xl p-5 border transition-all duration-300 ${
                              conseguido
                                ? "bg-gradient-to from-amber-50 to-yellow-100 border-amber-300 shadow-md"
                                : "bg-gray-50 border-gray-200 opacity-60"
                            }`}
                          >
                            {/* Ícono */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                                conseguido
                                  ? "bg-gradient-to from-amber-400 to-yellow-500 shadow-lg"
                                  : "bg-gray-200"
                              }`}
                            >
                              <IconComponent
                                className={`w-6 h-6 ${
                                  conseguido ? "text-white" : "text-gray-400"
                                }`}
                              />
                            </div>

                            {/* Nombre */}
                            <h3
                              className={`font-bold text-sm mb-1 ${
                                conseguido ? "text-amber-800" : "text-gray-400"
                              }`}
                            >
                              {ul.logro.nombre}
                            </h3>

                            {/* Descripción */}
                            <p
                              className={`text-xs ${
                                conseguido ? "text-amber-700" : "text-gray-400"
                              }`}
                            >
                              {ul.logro.descripcion}
                            </p>

                            {/* Fecha conseguido */}
                            {conseguido && ul.fechaConseguido && (
                              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {new Date(
                                  ul.fechaConseguido,
                                ).toLocaleDateString("es-PE", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            )}

                            {/* Badge CONSEGUIDO */}
                            {conseguido && (
                              <span className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                ✓ Conseguido
                              </span>
                            )}

                            {/* Badge Pendiente */}
                            {!conseguido && (
                              <span className="absolute top-3 right-3 bg-gray-200 text-gray-500 text-[10px] font-medium px-2 py-0.5 rounded-full">
                                Pendiente
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#003366]" />
                  Panel de Administración
                </h2>
                <div className="bg-gradient-to from-[#003366] to-[#4b2c82] rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-8 h-8" />
                    <h3 className="text-lg font-bold">Acceso Completo</h3>
                  </div>
                  <p className="text-sm text-gray-200">
                    Como administrador, tienes acceso completo a todas las
                    funcionalidades del sistema: gestión de usuarios, charlas,
                    documentos, formatos, configuración de exámenes y más.
                  </p>
                </div>

                {/* ── LOGROS ADMIN (sistema) ── */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Logros del Sistema
                  </h2>
                  {logrosLoading ? (
                    <p className="text-sm text-gray-400">Cargando logros...</p>
                  ) : logrosAdmin.length === 0 ? (
                    <p className="text-sm text-gray-400">
                      No hay logros configurados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {logrosAdmin.map((logro) => {
                        const IconComponent =
                          iconMap[logro.icono ?? "trophy"] ?? Trophy;
                        return (
                          <div
                            key={logro.id}
                            className="relative rounded-2xl p-5 bg-gradient-to from-[#003366]/5 to-[#4b2c82]/10 border border-[#003366]/20 shadow-sm"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to from-[#003366] to-[#4b2c82] flex items-center justify-center mb-3 shadow-md">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-bold text-sm text-[#022B54] mb-1">
                              {logro.nombre}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {logro.descripcion}
                            </p>
                            <span className="absolute top-3 right-3 bg-[#003366]/10 text-[#003366] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Activo
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
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
