"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number; // índice de la respuesta correcta
}

// 20 preguntas hardcodeadas
const preguntasMock: Pregunta[] = [
  {
    id: 1,
    pregunta: "¿Cuál es la vida útil máxima de un arnés de cuerpo completo?",
    opciones: ["2 años", "5 años", "10 años", "Indefinida si está en buen estado"],
    respuestaCorrecta: 1,
  },
  {
    id: 2,
    pregunta: "¿Qué tipo de EPP es esencial para trabajos en altura?",
    opciones: ["Casco", "Arnés de cuerpo completo", "Guantes", "Botas de seguridad"],
    respuestaCorrecta: 1,
  },
  {
    id: 3,
    pregunta: "¿Con qué frecuencia se debe inspeccionar el arnés antes de usarlo?",
    opciones: ["Solo cuando es nuevo", "Antes de cada uso", "Una vez al mes", "Una vez al año"],
    respuestaCorrecta: 1,
  },
  {
    id: 4,
    pregunta: "¿Cuál es la altura mínima desde la cual se considera trabajo en altura?",
    opciones: ["1 metro", "1.5 metros", "2 metros", "3 metros"],
    respuestaCorrecta: 1,
  },
  {
    id: 5,
    pregunta: "¿Qué debe hacer si encuentra un defecto en su EPP?",
    opciones: ["Usarlo de todos modos", "Reportarlo y usar uno nuevo", "Repararlo usted mismo", "Ignorarlo"],
    respuestaCorrecta: 1,
  },
  {
    id: 6,
    pregunta: "¿El arnés debe ajustarse de manera que quede?",
    opciones: ["Muy apretado", "Muy suelto", "Ajustado pero cómodo", "No importa"],
    respuestaCorrecta: 2,
  },
  {
    id: 7,
    pregunta: "¿Qué parte del cuerpo debe soportar el peso en caso de caída?",
    opciones: ["Las piernas", "Los brazos", "El torso y los muslos", "La cintura"],
    respuestaCorrecta: 2,
  },
  {
    id: 8,
    pregunta: "¿Cuándo se debe reemplazar un arnés?",
    opciones: ["Nunca", "Solo si está visiblemente dañado", "Después de una caída o si está dañado", "Cada 5 años sin importar el estado"],
    respuestaCorrecta: 2,
  },
  {
    id: 9,
    pregunta: "¿Qué es un punto de anclaje?",
    opciones: ["Un lugar para descansar", "Un punto seguro para conectar el arnés", "Un tipo de herramienta", "Un área de trabajo"],
    respuestaCorrecta: 1,
  },
  {
    id: 10,
    pregunta: "¿El casco debe usarse siempre en trabajos en altura?",
    opciones: ["Solo si hace sol", "Siempre", "Solo en interiores", "Opcional"],
    respuestaCorrecta: 1,
  },
  {
    id: 11,
    pregunta: "¿Qué debe verificar antes de usar un arnés?",
    opciones: ["Solo el color", "Etiquetas, costuras, hebillas y material", "Solo el tamaño", "Nada"],
    respuestaCorrecta: 1,
  },
  {
    id: 12,
    pregunta: "¿Cuál es el propósito principal del EPP en altura?",
    opciones: ["Verse profesional", "Prevenir caídas y lesiones", "Cumplir con la ley", "Ahorrar tiempo"],
    respuestaCorrecta: 1,
  },
  {
    id: 13,
    pregunta: "¿Se puede usar un arnés que ha estado expuesto a productos químicos?",
    opciones: ["Sí, siempre", "Solo si se lava", "No, debe inspeccionarse o reemplazarse", "Depende del químico"],
    respuestaCorrecta: 2,
  },
  {
    id: 14,
    pregunta: "¿Qué debe hacer si su compañero no está usando EPP correctamente?",
    opciones: ["Ignorarlo", "Reportarlo al supervisor", "Hacerlo usted mismo", "Reírse"],
    respuestaCorrecta: 1,
  },
  {
    id: 15,
    pregunta: "¿El EPP debe guardarse en un lugar?",
    opciones: ["Húmedo y oscuro", "Seco, limpio y protegido", "Al aire libre", "Cualquier lugar"],
    respuestaCorrecta: 1,
  },
  {
    id: 16,
    pregunta: "¿Cuántas personas pueden usar el mismo arnés?",
    opciones: ["Varias", "Solo una persona asignada", "Dos personas", "Tres personas"],
    respuestaCorrecta: 1,
  },
  {
    id: 17,
    pregunta: "¿Qué significa EPP?",
    opciones: ["Equipo de Protección Personal", "Equipo de Prevención Personal", "Equipo de Protección Profesional", "Equipo de Prevención Profesional"],
    respuestaCorrecta: 0,
  },
  {
    id: 18,
    pregunta: "¿El arnés debe tener certificación?",
    opciones: ["No es necesario", "Sí, debe estar certificado", "Solo en algunos países", "Opcional"],
    respuestaCorrecta: 1,
  },
  {
    id: 19,
    pregunta: "¿Qué hacer si el arnés no ajusta correctamente?",
    opciones: ["Usarlo de todos modos", "Ajustarlo con herramientas", "Obtener uno del tamaño correcto", "Atarlo más fuerte"],
    respuestaCorrecta: 2,
  },
  {
    id: 20,
    pregunta: "¿La capacitación en EPP es importante?",
    opciones: ["No es necesaria", "Muy importante y obligatoria", "Solo para nuevos empleados", "Opcional"],
    respuestaCorrecta: 1,
  },
];

const ExamenView = () => {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>(new Array(preguntasMock.length).fill(-1));
  const [mostrarResultado, setMostrarResultado] = useState(false);

  const pregunta = preguntasMock[preguntaActual];
  const esUltimaPregunta = preguntaActual === preguntasMock.length - 1;
  const esPrimeraPregunta = preguntaActual === 0;

  const handleSeleccionarRespuesta = (indice: number) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = indice;
    setRespuestas(nuevasRespuestas);
  };

  const handleSiguiente = () => {
    if (esUltimaPregunta) {
      calcularResultado();
    } else {
      setPreguntaActual(preguntaActual + 1);
    }
  };

  const handleAnterior = () => {
    if (!esPrimeraPregunta) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const calcularResultado = () => {
    setMostrarResultado(true);
  };

  const respuestasCorrectas = respuestas.reduce((acc, respuesta, index) => {
    return acc + (respuesta === preguntasMock[index].respuestaCorrecta ? 1 : 0);
  }, 0);

  const porcentaje = Math.round((respuestasCorrectas / preguntasMock.length) * 100);

  if (mostrarResultado) {
    return (
      <LayoutComponent>
        <div className="min-h-screen bg-[#F5FAFF]">
          <div className="max-w-3xl mx-auto py-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
              <div className="flex justify-center">
                {porcentaje >= 70 ? (
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {porcentaje >= 70 ? "¡Felicitaciones!" : "Necesitas estudiar más"}
                </h2>
                <p className="text-gray-600 mb-4">
                  Has completado el examen
                </p>
                <div className="text-4xl font-bold text-[#003366] mb-2">
                  {respuestasCorrectas} / {preguntasMock.length}
                </div>
                <div className="text-2xl font-semibold text-gray-700">
                  {porcentaje}%
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => router.push("/induccion")}
                  className="px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Volver a Inducción
                </button>
              </div>
            </div>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="min-h-screen bg-[#F5FAFF]">
        <div className="max-w-3xl mx-auto py-6">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/induccion")}
              className="inline-flex items-center text-sm text-cyan-600 hover:text-cyan-700 font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver a Inducción
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#022B54]">
                  Examen de Inducción
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Pregunta {preguntaActual + 1} de {preguntasMock.length}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {Math.round(((preguntaActual + 1) / preguntasMock.length) * 100)}%
              </div>
            </div>
            {/* Barra de progreso */}
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${((preguntaActual + 1) / preguntasMock.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pregunta */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {pregunta.pregunta}
              </h2>
            </div>

            {/* Opciones */}
            <div className="space-y-3">
              {pregunta.opciones.map((opcion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSeleccionarRespuesta(index)}
                  className={`w-full text-left px-4 py-4 rounded-xl border text-sm transition-all ${
                    respuestas[preguntaActual] === index
                      ? "border-cyan-500 bg-cyan-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-cyan-200 hover:bg-cyan-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        respuestas[preguntaActual] === index
                          ? "border-cyan-500 bg-cyan-500"
                          : "border-gray-300"
                      }`}
                    >
                      {respuestas[preguntaActual] === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="flex-1">{opcion}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navegación */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={handleAnterior}
                disabled={esPrimeraPregunta}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              <button
                onClick={handleSiguiente}
                disabled={respuestas[preguntaActual] === -1}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors"
              >
                {esUltimaPregunta ? "Finalizar Examen" : "Siguiente"}
                {!esUltimaPregunta && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
};

export default ExamenView;
