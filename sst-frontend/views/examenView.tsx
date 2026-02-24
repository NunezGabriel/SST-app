"use client";

import { useState, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useExamenAdminContext } from "@/context/ExamenAdminContext";
import { useAuthContext } from "@/context/AuthContext";
import type { Opcion, PreguntaExamen, ResultadoExamen } from "@/lib/api/examen";

const OPCIONES: Opcion[] = ["A", "B", "C", "D"];

const ExamenView = () => {
  const router = useRouter();
  const { user } = useAuthContext();
  const {
    preguntasExamen,
    estadoExamen,
    configuracion,
    isLoadingExamen,
    errorExamen,
    generarPreguntas,
    rendirExamen,
    refreshEstadoExamen,
    resetearBloqueo,
  } = useExamenAdminContext();

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, Opcion>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [resultado, setResultado] = useState<ResultadoExamen | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cargar preguntas al montar
  useEffect(() => {
    if (
      user?.rol === "WORKER" &&
      preguntasExamen.length === 0 &&
      !isLoadingExamen
    ) {
      handleGenerarPreguntas();
    }
  }, [user?.rol]);

  // Verificar estado del examen
  useEffect(() => {
    if (user?.rol === "WORKER") {
      refreshEstadoExamen();
    }
  }, [user?.rol, refreshEstadoExamen]);

  const handleGenerarPreguntas = async () => {
    try {
      setIsGenerating(true);
      await generarPreguntas();
      setPreguntaActual(0);
      setRespuestas({});
      setMostrarResultado(false);
      setResultado(null);
    } catch (error: any) {
      alert(error.message || "Error al generar preguntas");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSeleccionar = (op: Opcion) => {
    if (!preguntasExamen[preguntaActual]) return;
    setRespuestas((prev) => ({
      ...prev,
      [preguntasExamen[preguntaActual].id]: op,
    }));
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntasExamen.length - 1) {
      setPreguntaActual((prev) => prev + 1);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual((prev) => prev - 1);
    }
  };

  const handleFinalizar = async () => {
    if (Object.keys(respuestas).length !== preguntasExamen.length) {
      const faltantes = preguntasExamen.length - Object.keys(respuestas).length;
      if (
        !confirm(
          `Tienes ${faltantes} pregunta(s) sin responder. ¿Deseas finalizar el examen de todas formas?`,
        )
      ) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const resultado = await rendirExamen(respuestas);
      setResultado(resultado);
      setMostrarResultado(true);
    } catch (error: any) {
      alert(error.message || "Error al enviar el examen");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetearBloqueo = async () => {
    try {
      await resetearBloqueo();
      alert(
        "Bloqueo reseteado. Ahora puedes ver el video de inducción y volver a intentar.",
      );
      router.push("/induccion");
    } catch (error: any) {
      alert(error.message || "Error al resetear bloqueo");
    }
  };

  // Verificar si está bloqueado
  if (estadoExamen?.bloqueado && estadoExamen.bloqueadoHasta) {
    const bloqueadoHasta = new Date(estadoExamen.bloqueadoHasta);
    const ahora = new Date();
    const minutosRestantes = Math.ceil(
      (bloqueadoHasta.getTime() - ahora.getTime()) / (1000 * 60),
    );

    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 w-full bg-red-500" />
              <div className="p-10 text-center space-y-6">
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-red-50">
                  <Lock className="w-14 h-14 text-red-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Examen Bloqueado
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    Has agotado tus {estadoExamen.intentosMaximos} intentos.
                  </p>
                </div>
                <div className="bg-red-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Debes ver el video de inducción nuevamente antes de poder
                    volver a intentar.
                  </p>
                  {minutosRestantes > 0 && (
                    <p className="text-lg font-bold text-red-600">
                      Tiempo restante: {minutosRestantes} minuto(s)
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={handleResetearBloqueo}
                    className="w-full py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Ver Video de Inducción
                  </button>
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm transition"
                  >
                    Volver al panel de Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  // Pantalla de carga
  if (isGenerating || (isLoadingExamen && preguntasExamen.length === 0)) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366] mx-auto mb-4"></div>
            <p className="text-gray-600">Generando preguntas del examen...</p>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  // Error al cargar
  if (errorExamen && preguntasExamen.length === 0) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-lg border border-red-100 p-10 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{errorExamen}</p>
              <button
                onClick={handleGenerarPreguntas}
                className="px-6 py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  // Si no hay preguntas, mostrar botón para generar
  if (preguntasExamen.length === 0) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Examen de Inducción
              </h2>
              <p className="text-gray-600">
                Haz clic en el botón para comenzar el examen.
              </p>
              <button
                onClick={handleGenerarPreguntas}
                className="w-full py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition"
              >
                Comenzar Examen
              </button>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  const total = preguntasExamen.length;
  const pregunta = preguntasExamen[preguntaActual];
  const esUltima = preguntaActual === total - 1;
  const esPrimera = preguntaActual === 0;
  const respondidas = Object.keys(respuestas).length;
  const puntajeAprobatorio = configuracion?.puntajeAprobatorio || 14;

  const getOpcionTexto = (p: PreguntaExamen, op: Opcion) => {
    if (op === "A") return p.opcionA;
    if (op === "B") return p.opcionB;
    if (op === "C") return p.opcionC;
    return p.opcionD;
  };

  // ── Pantalla de resultado ────────────────────────────────────────────────────
  if (mostrarResultado && resultado) {
    const aprobado = resultado.aprobado;

    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div
                className={`h-2 w-full ${aprobado ? "bg-emerald-500" : "bg-red-500"}`}
              />
              <div className="p-10 text-center space-y-6">
                <div
                  className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                    aprobado ? "bg-emerald-50" : "bg-red-50"
                  }`}
                >
                  {aprobado ? (
                    <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                  ) : (
                    <XCircle className="w-14 h-14 text-red-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {aprobado ? "¡Felicitaciones!" : "No aprobaste"}
                  </h2>
                  <p className="text-gray-500 mt-2 text-sm">
                    {aprobado
                      ? "Has aprobado el examen de inducción correctamente."
                      : `Necesitas ${puntajeAprobatorio} respuestas correctas para aprobar.`}
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-6 ${
                    aprobado ? "bg-emerald-50" : "bg-red-50"
                  }`}
                >
                  <p
                    className={`text-6xl font-black ${
                      aprobado ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {resultado.puntaje}
                    <span className="text-3xl font-semibold text-gray-400">
                      /{resultado.puntajeTotal}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    respuestas correctas
                  </p>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        aprobado ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${(resultado.puntaje / resultado.puntajeTotal) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span className="text-amber-500 font-semibold">
                      Mínimo: {puntajeAprobatorio}
                    </span>
                    <span>{resultado.puntajeTotal}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-left">
                  <p className="text-xs font-semibold text-gray-600 mb-2">
                    Intento #{resultado.intento.numeroIntento}
                  </p>
                  <p className="text-xs text-gray-500">
                    Intentos usados: {estadoExamen?.intentosUsados || 0} /{" "}
                    {estadoExamen?.intentosMaximos || 3}
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  {!aprobado &&
                    estadoExamen &&
                    estadoExamen.intentosUsados <
                      estadoExamen.intentosMaximos && (
                      <button
                        onClick={handleGenerarPreguntas}
                        className="w-full py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition"
                      >
                        Intentar Nuevamente
                      </button>
                    )}
                  {!aprobado &&
                    estadoExamen &&
                    estadoExamen.intentosUsados >=
                      estadoExamen.intentosMaximos && (
                      <button
                        onClick={() => router.push("/induccion")}
                        className="w-full py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition"
                      >
                        Volver a ver el material de inducción
                      </button>
                    )}
                  <button
                    onClick={() => router.push("/dashboard")}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                      aprobado
                        ? "bg-[#003366] text-white hover:bg-[#004080]"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Volver al panel de Inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  // ── Vista de pregunta ────────────────────────────────────────────────────────
  const progreso = ((preguntaActual + 1) / total) * 100;
  const respuestaActual = respuestas[pregunta.id];

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-3xl mx-auto py-6 space-y-5">
          {/* Header */}
          <div>
            <button
              onClick={() => router.push("/induccion")}
              className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-medium mb-5"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Inducción
            </button>

            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-[#022B54]">
                  Examen de Inducción
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Pregunta{" "}
                  <span className="font-semibold text-gray-700">
                    {preguntaActual + 1}
                  </span>{" "}
                  de {total}
                  <span className="mx-2 text-gray-300">·</span>
                  <span className="text-gray-500">
                    {respondidas} respondidas
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#003366]">
                  {Math.round(progreso)}%
                </p>
                <p className="text-xs text-gray-400">completado</p>
              </div>
            </div>

            {/* Barra de progreso segmentada */}
            <div className="flex gap-1">
              {preguntasExamen.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPreguntaActual(i)}
                  className={`h-1.5 flex-1 rounded-full transition-all ${
                    i === preguntaActual
                      ? "bg-cyan-500"
                      : respuestas[p.id]
                        ? "bg-[#003366]"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card pregunta */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#003366] text-white text-sm font-bold flex items-center justify-center shrink-0">
                {preguntaActual + 1}
              </div>
              <p className="text-base font-semibold text-gray-900 leading-snug">
                {pregunta.pregunta}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Opciones */}
              <div className="space-y-3">
                {OPCIONES.map((op) => {
                  const texto = getOpcionTexto(pregunta, op);
                  const seleccionada = respuestaActual === op;
                  return (
                    <button
                      key={op}
                      onClick={() => handleSeleccionar(op)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 ${
                        seleccionada
                          ? "border-cyan-500 bg-cyan-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-cyan-200 hover:bg-cyan-50/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold transition-all ${
                            seleccionada
                              ? "border-cyan-500 bg-cyan-500 text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {op}
                        </div>
                        <span
                          className={`flex-1 leading-snug ${
                            seleccionada
                              ? "text-gray-900 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {texto}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Aviso sin respuesta */}
              {!respuestaActual && (
                <p className="text-xs text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  Debes seleccionar una opción para continuar
                </p>
              )}
            </div>

            {/* Footer navegación */}
            <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center">
              <button
                onClick={handleAnterior}
                disabled={esPrimera}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              {esUltima ? (
                <button
                  onClick={handleFinalizar}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Finalizar Examen
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSiguiente}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-sm transition"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mini mapa de preguntas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Navegación rápida
            </p>
            <div className="flex flex-wrap gap-2">
              {preguntasExamen.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPreguntaActual(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    i === preguntaActual
                      ? "bg-cyan-500 text-white shadow-sm"
                      : respuestas[p.id]
                        ? "bg-[#003366] text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default ExamenView;
