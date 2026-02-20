"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Opcion = "A" | "B" | "C" | "D";

interface Pregunta {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuestaCorrecta: Opcion;
  imagen?: string; // ruta de imagen opcional (para preguntas del rombo NFPA)
}

// ── Banco hardcodeado — 28 preguntas, el backend tomará 20 aleatorias ──────────
// Por ahora usamos las 20 primeras como mock secuencial
const PREGUNTAS_MOCK: Pregunta[] = [
  {
    id: 1,
    pregunta: "ECYTEL ¿Es una empresa dedicada a?",
    opcionA:
      "Empresa distribuidora de energía eléctrica y gas natural para el sector industrial peruano",
    opcionB:
      "Empresa constructora y de telecomunicaciones líder en servicios de redes de fibra óptica en el Perú",
    opcionC:
      "Empresa minera y de construcción de carreteras con operaciones en el sur del país",
    opcionD:
      "Empresa de exportación de materiales de construcción y telecomunicaciones al exterior",
    respuestaCorrecta: "B",
  },
  {
    id: 2,
    pregunta:
      "Según la charla de inducción, ¿qué son las inspecciones y checklist?",
    opcionA:
      "Son documentos legales que analizan los peligros y riesgos de una tarea específica, y definen los controles a aplicar antes de iniciar el trabajo",
    opcionB:
      "Son documentos de verificación para identificar el estado óptimo o no de herramientas, vehículos y equipos; deben llenarse antes de realizar cualquier trabajo",
    opcionC:
      "Son formatos de reporte que se llenan después de un incidente o accidente y se envían al coordinador HSE de la empresa",
    opcionD:
      "Son permisos escritos que autoriza el supervisor para ejecutar trabajos catalogados como de alto riesgo en la obra",
    respuestaCorrecta: "B",
  },
  {
    id: 3,
    pregunta:
      "Según la sección de terminología, ¿cuál de las siguientes definiciones es INCORRECTA?",
    opcionA:
      "Arnés de seguridad: Dispositivo que se usa alrededor del torso del cuerpo (hombros, caderas, cintura y piernas) para detener caídas severas",
    opcionB:
      "Accidente: Evento no deseado que ocasiona daños a la persona de manera inmediata o involucra un deterioro a su salud",
    opcionC:
      "Acto inseguro: Es aquella condición propicia para la ocurrencia de un accidente, produciendo daños a los trabajadores y a las herramientas y equipos",
    opcionD:
      "Peligro: Propiedad o característica intrínseca de algo capaz de ocasionar daños a las personas, maquinarias o medio ambiente",
    respuestaCorrecta: "C",
  },
  {
    id: 4,
    pregunta:
      "¿Cuáles son los trabajos de alto riesgo mencionados en la inducción de ECYTEL?",
    opcionA:
      "Trabajo nocturno, trabajo eléctrico, demolición de estructuras y pintura industrial en espacios cerrados",
    opcionB:
      "Trabajo en altura, trabajo en espacios confinados, manipulación e izaje de materiales, trabajos en caliente y excavación de zanjas",
    opcionC:
      "Soldadura, trabajo con radiación, manejo de explosivos y operación de maquinaria pesada en vía pública",
    opcionD:
      "Trabajo en altura, trabajo con químicos, manejo de residuos peligrosos y operación de vehículos en obra",
    respuestaCorrecta: "B",
  },
  {
    id: 5,
    pregunta:
      "¿Qué compromiso asume la empresa ECYTEL en relación al medio ambiente?",
    opcionA:
      "Compensar económicamente a las municipalidades por el impacto ambiental generado en cada proyecto ejecutado",
    opcionB:
      "Reducir el uso de maquinaria pesada y reemplazarla por equipos eléctricos para disminuir las emisiones de carbono",
    opcionC:
      "Asumir el cuidado y conservación de los ecosistemas; al terminar la actividad la zona de trabajo debe quedar limpia de cualquier desperdicio",
    opcionD:
      "Plantar árboles en áreas verdes equivalentes a las zonas intervenidas durante la ejecución de sus proyectos",
    respuestaCorrecta: "C",
  },
  {
    id: 6,
    pregunta:
      "De los siguientes enunciados, ¿cuáles corresponden a un ACTO subestándar?",
    opcionA:
      "Llaves stilson en estado deteriorado, equipos insuficientes en el área y tormentas eléctricas en la zona",
    opcionB:
      "Realizar bromas durante la charla, no utilizar los implementos de seguridad, conducir a alta velocidad e ingresar en estado de ebriedad",
    opcionC:
      "Realizar bromas durante la charla, llaves stilson deterioradas y tormentas eléctricas en el área de trabajo",
    opcionD:
      "Equipos insuficientes y deteriorados, tormentas eléctricas en el área y llaves stilson en mal estado",
    respuestaCorrecta: "B",
  },
  {
    id: 7,
    pregunta:
      "De los siguientes enunciados, ¿cuáles corresponden a una CONDICIÓN subestándar?",
    opcionA:
      "Realizar bromas durante la charla, conducir a alta velocidad e ingresar al trabajo en estado de ebriedad",
    opcionB:
      "No utilizar los implementos de seguridad, conducir a alta velocidad y realizar bromas en la charla de 5 minutos",
    opcionC:
      "Llaves stilson en estado deteriorado, equipos insuficientes y deteriorados en el área de trabajo, y tormentas eléctricas en el área",
    opcionD:
      "Ingresar al trabajo en estado de ebriedad, no usar los implementos de seguridad y realizar bromas en la charla",
    respuestaCorrecta: "C",
  },
  {
    id: 8,
    pregunta:
      "En la realización del trabajo, ¿cuál de las siguientes combinaciones de peligro, riesgo y consecuencia es correcta?",
    opcionA:
      "Peligro: uso de computadora — Riesgo: electrocución — Consecuencia: pérdida total de la visión del trabajador",
    opcionB:
      "Peligro: trabajo en altura — Riesgo: caída a diferente nivel — Consecuencia: fracturas, traumatismos o muerte",
    opcionC:
      "Peligro: iluminación natural — Riesgo: incendio en el área — Consecuencia: quemaduras leves en manos y cara",
    opcionD:
      "Peligro: herramienta nueva — Riesgo: intoxicación química — Consecuencia: daño al sistema respiratorio",
    respuestaCorrecta: "B",
  },
  {
    id: 9,
    pregunta:
      "Según el código de señales y colores, ¿qué tipo de señal corresponde al color AMARILLO y al color VERDE respectivamente?",
    opcionA: "Amarillo: señal contra incendios / Verde: señal de prohibición",
    opcionB:
      "Amarillo: señal de obligación / Verde: señal de advertencia y precaución",
    opcionC:
      "Amarillo: señal de advertencia y precaución / Verde: señal de salvamento o emergencia",
    opcionD:
      "Amarillo: señal de prohibición / Verde: señal contra incendios con círculo rojo",
    respuestaCorrecta: "C",
  },
  {
    id: 10,
    pregunta:
      "Según el código de señales y colores, ¿qué color corresponde a las señales de tipo OBLIGATORIO y cuál a las señales CONTRA INCENDIOS respectivamente?",
    opcionA:
      "Obligatorio: verde con cuadrado / Contra incendios: amarillo con triángulo",
    opcionB:
      "Obligatorio: rojo con círculo / Contra incendios: azul con cuadrado",
    opcionC:
      "Obligatorio: azul con círculo / Contra incendios: rojo con cuadrado o rectángulo",
    opcionD:
      "Obligatorio: amarillo con triángulo / Contra incendios: verde con cuadrado",
    respuestaCorrecta: "C",
  },
  {
    id: 11,
    pregunta:
      "Observa el rombo NFPA 704 de la imagen. ¿Qué riesgo indica la sección AZUL y qué riesgo indica la sección ROJA?",
    opcionA:
      "Azul: reactividad e inestabilidad química / Rojo: riesgo para la salud por inhalación o contacto",
    opcionB: "Azul: riesgo para la salud / Rojo: inflamabilidad del material",
    opcionC:
      "Azul: inflamabilidad del material / Rojo: riesgo especial como oxidante o radiactivo",
    opcionD:
      "Azul: riesgo especial del material / Rojo: reactividad e inestabilidad química",
    respuestaCorrecta: "B",
    imagen: "/images/rombo-nfpa.png", // imagen fija del rombo NFPA
  },
  {
    id: 12,
    pregunta:
      "Observa el rombo NFPA 704 de la imagen. ¿Qué riesgo indica la sección AMARILLA y qué indica la sección BLANCA?",
    opcionA:
      "Amarillo: riesgo para la salud / Blanco: inflamabilidad del material almacenado",
    opcionB:
      "Amarillo: inflamabilidad del material / Blanco: riesgo para la salud del personal expuesto",
    opcionC:
      "Amarillo: reactividad o inestabilidad del material / Blanco: información especial (oxidante, radiactivo, etc.)",
    opcionD:
      "Amarillo: señal de precaución general / Blanco: nivel de toxicidad del material en escala del 0 al 4",
    respuestaCorrecta: "C",
    imagen: "/images/rombo-nfpa.png",
  },
  {
    id: 13,
    pregunta:
      "¿Cuál es el propósito de los Elementos de Protección Personal (EPP) según la inducción?",
    opcionA:
      "Reemplazar las protecciones colectivas como barandas y mallas en todos los trabajos de alto riesgo",
    opcionB:
      "Cumplir con las exigencias legales del Ministerio de Trabajo para evitar multas y sanciones a la empresa",
    opcionC:
      "Proteger al trabajador de uno o varios riesgos que puedan amenazar su seguridad, salud y medio ambiente en el trabajo",
    opcionD:
      "Mejorar el rendimiento del trabajador y reducir la fatiga durante las jornadas de trabajo en campo",
    respuestaCorrecta: "C",
  },
  {
    id: 14,
    pregunta:
      "Los materiales peligrosos (HAZMAT) pueden ser (marque la alternativa INCORRECTA):",
    opcionA:
      "Inflamable, como la gasolina, el propano y otros líquidos o gases combustibles de uso industrial",
    opcionB:
      "Tóxico o corrosivo, como biocidas, insecticidas, ácido sulfúrico o soda cáustica de uso industrial",
    opcionC:
      "Húmedo, como materiales con alto contenido de humedad absorbida durante su almacenamiento",
    opcionD:
      "Radiactivo, como las cápsulas radiactivas utilizadas en procesos médicos o industriales especializados",
    respuestaCorrecta: "C",
  },
  {
    id: 15,
    pregunta: "Complete: 'El check list es un documento para…'",
    opcionA:
      "…registrar las horas trabajadas y calcular el pago de horas extras del personal en campo",
    opcionB:
      "…identificar el estado óptimo o no de herramientas, vehículos y equipos antes de realizar el trabajo",
    opcionC:
      "…analizar los peligros y riesgos de la tarea y definir los controles antes de iniciar la actividad",
    opcionD:
      "…reportar los incidentes y accidentes ocurridos durante la jornada al coordinador de HSE",
    respuestaCorrecta: "B",
  },
  {
    id: 16,
    pregunta: "Complete: 'Se considera trabajo en espacios confinados por…'",
    opcionA:
      "…realizarse a una altura igual o mayor a 1.80 metros del suelo, requiriendo protección contra caídas",
    opcionB:
      "…involucrar uso de materiales inflamables o tóxicos dentro de instalaciones industriales cerradas",
    opcionC:
      "…desarrollarse dentro de un lugar cerrado o parcialmente cerrado, con acceso limitado, ventilación deficiente y no diseñado para ocupación continua",
    opcionD:
      "…ejecutarse en zonas con presencia de gases tóxicos sin importar si el espacio tiene ventilación natural disponible",
    respuestaCorrecta: "C",
  },
  {
    id: 17,
    pregunta: "Complete: 'En caso de quemaduras lo recomendado es…'",
    opcionA:
      "…aplicar pasta dental, mantequilla o aceite sobre la zona afectada para aliviar el dolor inmediatamente",
    opcionB:
      "…aplicar abundante agua durante aproximadamente 15 minutos sobre la zona quemada",
    opcionC:
      "…cubrir con vendas secas sin aplicar nada y trasladar al trabajador al centro médico más cercano",
    opcionD:
      "…reventar las ampollas y limpiar con alcohol la zona afectada para prevenir posibles infecciones",
    respuestaCorrecta: "B",
  },
  {
    id: 18,
    pregunta: "El triángulo del fuego se compone por:",
    opcionA:
      "Reacción en cadena, energía calorífica y temperatura de ignición del combustible involucrado",
    opcionB:
      "Combustible, Comburente (oxígeno) y Energía de activación (Calor)",
    opcionC:
      "Combustible, Comburente (oxígeno) y Reacción en cadena entre los tres elementos",
    opcionD:
      "Temperatura, calor específico y calor latente necesarios para sostener la combustión",
    respuestaCorrecta: "B",
  },
  {
    id: 19,
    pregunta: "Ante un accidente, lo primero que hay que hacer es:",
    opcionA:
      "Llamar al número de emergencia sin evaluar previamente la situación ni atender a la víctima",
    opcionB:
      "Realizar RCP a la víctima de forma inmediata sin importar su estado de consciencia ni las condiciones",
    opcionC:
      "Avisar a la Cruz Roja y al mando superior simultáneamente mientras se aleja del área del accidente",
    opcionD:
      "Valorar la situación, realizar primeros auxilios y comunicar a quien corresponda",
    respuestaCorrecta: "D",
  },
  {
    id: 20,
    pregunta: "Un trabajo en altura es cuando se trabaja a más de:",
    opcionA:
      "1.00 metro sobre el nivel del suelo, incluyendo el uso de escaleras portátiles en cualquier superficie",
    opcionB:
      "1.50 metros sobre el nivel del suelo, según el estándar aplicado en la industria de la construcción",
    opcionC: "1.80 metros sobre el nivel del suelo",
    opcionD:
      "2.00 metros sobre el nivel del suelo, que es el mínimo exigido por el estándar internacional OSHA",
    respuestaCorrecta: "C",
  },
];

const OPCIONES: Opcion[] = ["A", "B", "C", "D"];
const PUNTAJE_APROBATORIO = 14;

const ExamenView = () => {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, Opcion>>({});
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const total = PREGUNTAS_MOCK.length;
  const pregunta = PREGUNTAS_MOCK[preguntaActual];
  const esUltima = preguntaActual === total - 1;
  const esPrimera = preguntaActual === 0;
  const respondidas = Object.keys(respuestas).length;

  const getOpcionTexto = (p: Pregunta, op: Opcion) => {
    if (op === "A") return p.opcionA;
    if (op === "B") return p.opcionB;
    if (op === "C") return p.opcionC;
    return p.opcionD;
  };

  const handleSeleccionar = (op: Opcion) => {
    setRespuestas((prev) => ({ ...prev, [pregunta.id]: op }));
  };

  const handleSiguiente = () => {
    if (esUltima) {
      setMostrarResultado(true);
    } else {
      setPreguntaActual((p) => p + 1);
    }
  };

  const correctas = PREGUNTAS_MOCK.reduce((acc, p) => {
    return acc + (respuestas[p.id] === p.respuestaCorrecta ? 1 : 0);
  }, 0);

  const aprobado = correctas >= PUNTAJE_APROBATORIO;

  // ── Pantalla de resultado ────────────────────────────────────────────────────
  if (mostrarResultado) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF] flex items-center justify-center py-10">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Banner superior */}
              <div
                className={`h-2 w-full ${aprobado ? "bg-emerald-500" : "bg-red-500"}`}
              />

              <div className="p-10 text-center space-y-6">
                {/* Icono */}
                <div
                  className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${aprobado ? "bg-emerald-50" : "bg-red-50"}`}
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
                      : `Necesitas ${PUNTAJE_APROBATORIO} respuestas correctas para aprobar.`}
                  </p>
                </div>

                {/* Puntaje */}
                <div
                  className={`rounded-2xl p-6 ${aprobado ? "bg-emerald-50" : "bg-red-50"}`}
                >
                  <p
                    className={`text-6xl font-black ${aprobado ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {correctas}
                    <span className="text-3xl font-semibold text-gray-400">
                      /{total}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    respuestas correctas
                  </p>
                  <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${aprobado ? "bg-emerald-500" : "bg-red-500"}`}
                      style={{ width: `${(correctas / total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span className="text-amber-500 font-semibold">
                      Mínimo: {PUNTAJE_APROBATORIO}
                    </span>
                    <span>{total}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-3 pt-2">
                  {!aprobado && (
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
                    Ir al Dashboard
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
              {PREGUNTAS_MOCK.map((p, i) => (
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
            {/* Número de pregunta */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#003366] text-white text-sm font-bold flex items-center justify-center shrink-0">
                {preguntaActual + 1}
              </div>
              <p className="text-base font-semibold text-gray-900 leading-snug">
                {pregunta.pregunta}
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Imagen opcional (rombo NFPA) */}
              {pregunta.imagen && (
                <div className="flex justify-center py-2">
                  <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50 p-4">
                    <img
                      src={pregunta.imagen}
                      alt="Referencia visual de la pregunta"
                      className="max-h-48 object-contain"
                    />
                    {/* Fallback visual cuando no existe la imagen */}
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Rombo NFPA 704
                    </p>
                  </div>
                </div>
              )}

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
                        {/* Letra de opción */}
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
                          className={`flex-1 leading-snug ${seleccionada ? "text-gray-900 font-medium" : "text-gray-700"}`}
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
                onClick={() => setPreguntaActual((p) => p - 1)}
                disabled={esPrimera}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                onClick={handleSiguiente}
                disabled={!respuestaActual}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition"
              >
                {esUltima ? "Finalizar Examen" : "Siguiente"}
                {!esUltima && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mini mapa de preguntas */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Navegación rápida
            </p>
            <div className="flex flex-wrap gap-2">
              {PREGUNTAS_MOCK.map((p, i) => (
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
