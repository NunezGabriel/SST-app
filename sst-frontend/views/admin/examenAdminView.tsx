"use client";

import { useState } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronDown,
  Settings,
  CheckCircle2,
  BookOpen,
  Search,
} from "lucide-react";

type Opcion = "A" | "B" | "C" | "D";

interface PreguntaAdmin {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuestaCorrecta: Opcion;
  activa: boolean;
}

interface ConfigExamen {
  puntajeAprobatorio: number;
  puntajeTotal: number;
  intentosMaximos: number;
  tiempoEsperaMinutos: number;
}

// ── Banco completo de 28 preguntas ───────────────────────────────────────────
const BANCO_INICIAL: PreguntaAdmin[] = [
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
  },
  {
    id: 11,
    pregunta:
      "Observa el rombo NFPA 704. ¿Qué riesgo indica la sección AZUL y qué riesgo indica la sección ROJA?",
    opcionA:
      "Azul: reactividad e inestabilidad química / Rojo: riesgo para la salud por inhalación o contacto",
    opcionB: "Azul: riesgo para la salud / Rojo: inflamabilidad del material",
    opcionC:
      "Azul: inflamabilidad del material / Rojo: riesgo especial como oxidante o radiactivo",
    opcionD:
      "Azul: riesgo especial del material / Rojo: reactividad e inestabilidad química",
    respuestaCorrecta: "B",
    activa: true,
  },
  {
    id: 12,
    pregunta:
      "Observa el rombo NFPA 704. ¿Qué riesgo indica la sección AMARILLA y qué indica la sección BLANCA?",
    opcionA:
      "Amarillo: riesgo para la salud / Blanco: inflamabilidad del material almacenado",
    opcionB:
      "Amarillo: inflamabilidad del material / Blanco: riesgo para la salud del personal expuesto",
    opcionC:
      "Amarillo: reactividad o inestabilidad del material / Blanco: información especial (oxidante, radiactivo, etc.)",
    opcionD:
      "Amarillo: señal de precaución general / Blanco: nivel de toxicidad del material en escala del 0 al 4",
    respuestaCorrecta: "C",
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
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
    activa: true,
  },
  {
    id: 21,
    pregunta: "¿Cuál es la diferencia entre acto y condición subestándar?",
    opcionA:
      "El acto subestándar es causado por factores del ambiente de trabajo; la condición subestándar es una acción voluntaria del trabajador",
    opcionB:
      "Acto subestándar es la acción u omisión del trabajador que genera riesgo; condición subestándar es el estado del ambiente o equipo que propicia un accidente",
    opcionC:
      "Ambos conceptos son equivalentes y se usan de forma indistinta en los procedimientos de seguridad",
    opcionD:
      "El acto subestándar siempre es intencional y con consecuencias graves; la condición siempre es accidental y sin responsables",
    respuestaCorrecta: "B",
    activa: true,
  },
  {
    id: 22,
    pregunta:
      "Para realizar un trabajo de alto riesgo se necesita un permiso que se llama:",
    opcionA:
      "RIACS (Reporte de Incidentes, Actos y Condiciones Subestándar) emitido por el coordinador HSE",
    opcionB:
      "ATS (Análisis de Trabajo Seguro) firmado por el trabajador y el supervisor antes de iniciar la tarea",
    opcionC: "PETAR (Permiso Escrito de Trabajo de Alto Riesgo)",
    opcionD:
      "CSST (Comité de Seguridad y Salud en el Trabajo) aprobado por la jefatura de operaciones",
    respuestaCorrecta: "C",
    activa: true,
  },
  {
    id: 23,
    pregunta: "¿Qué significan las siglas ATS?",
    opcionA:
      "Auditoría de Trabajo Seguro, documento que registra el cumplimiento de normas de seguridad en obra",
    opcionB:
      "Alerta de Trabajo Subestándar, formato de reporte ante condiciones inseguras detectadas en el área",
    opcionC: "Análisis de Trabajo Seguro",
    opcionD:
      "Acción de Trabajo en Seguridad, protocolo de respuesta ante emergencias en trabajos de alto riesgo",
    respuestaCorrecta: "C",
    activa: true,
  },
  {
    id: 24,
    pregunta: "¿Cómo prevenimos las enfermedades ocupacionales?",
    opcionA:
      "Únicamente con el uso correcto de EPPs sin necesidad de aplicar controles adicionales al ambiente",
    opcionB:
      "Solo realizando exámenes médicos ocupacionales al ingreso, durante el trabajo y al retirarse de la empresa",
    opcionC:
      "Identificando y evaluando peligros para la salud como ruido, polvo y ergonomía, aplicando controles y haciendo seguimiento",
    opcionD:
      "Evitando trabajar en zonas con polvo, ruido o radiación solar bajo cualquier condición o circunstancia",
    respuestaCorrecta: "C",
    activa: true,
  },
  {
    id: 25,
    pregunta:
      "¿El extintor de polvo (PQS) para qué clase de fuego se recomienda?",
    opcionA:
      "Solo para fuegos clase A (materiales sólidos como madera, papel y tela que dejan brasas al arder)",
    opcionB:
      "Solo para fuegos clase B (líquidos inflamables como gasolina, aceite y solventes industriales)",
    opcionC:
      "Para fuegos clase A, B y C (materiales sólidos, líquidos inflamables y equipos eléctricos energizados)",
    opcionD:
      "Solo para fuegos clase D (metales combustibles como magnesio, potasio y sodio en estado sólido)",
    respuestaCorrecta: "C",
    activa: true,
  },
  {
    id: 26,
    pregunta:
      "En prevención de incendios hay un agente extintor que contiene PQS. ¿Qué significa esta sigla?",
    opcionA:
      "Producto Químico Sintético, agente retardante de llamas aplicado en estructuras metálicas expuestas al fuego",
    opcionB: "Polvo Químico Seco",
    opcionC:
      "Protección de Quemaduras Severas, protocolo de atención a víctimas con quemaduras de segundo y tercer grado",
    opcionD:
      "Prevención de Quemaduras con Solvente, medida de control para trabajos con líquidos inflamables en obra",
    respuestaCorrecta: "B",
    activa: true,
  },
  {
    id: 27,
    pregunta: "¿En qué ciudades tiene operaciones ECYTEL S.A.C. actualmente?",
    opcionA:
      "Solo en Arequipa, Cusco y Puno como ciudades principales del sur del país",
    opcionB:
      "Únicamente en Lima y Callao para atender proyectos de la capital peruana",
    opcionC:
      "En zonas sur (Arequipa), norte (Trujillo, Jaén, Huancabamba) y centro (Lima, Chimbote, Chiclayo), además de otras zonas a demanda",
    opcionD:
      "En toda Sudamérica, con sede principal en Buenos Aires y oficina administrativa en Lima",
    respuestaCorrecta: "C",
    activa: true,
  },
  {
    id: 28,
    pregunta:
      "¿Cuál es la condición atmosférica mínima de oxígeno requerida para trabajar en un espacio confinado de forma segura?",
    opcionA:
      "Entre 15% y 18% de volumen de oxígeno en el aire interior del espacio confinado",
    opcionB:
      "Entre 19.5% y 22% de volumen de oxígeno en el aire para una adecuada respiración",
    opcionC:
      "Entre 22% y 25% de volumen de oxígeno, ligeramente superior al aire normal del exterior",
    opcionD:
      "Cualquier porcentaje es aceptable si se usa mascarilla con filtro de carbón activado certificado",
    respuestaCorrecta: "B",
    activa: true,
  },
];

const CONFIG_INICIAL: ConfigExamen = {
  puntajeAprobatorio: 14,
  puntajeTotal: 20,
  intentosMaximos: 3,
  tiempoEsperaMinutos: 10,
};

const emptyForm: Omit<PreguntaAdmin, "id"> = {
  pregunta: "",
  opcionA: "",
  opcionB: "",
  opcionC: "",
  opcionD: "",
  respuestaCorrecta: "A",
  activa: true,
};

const ExamenAdminView = () => {
  const [preguntas, setPreguntas] = useState<PreguntaAdmin[]>(BANCO_INICIAL);
  const [config, setConfig] = useState<ConfigExamen>(CONFIG_INICIAL);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState<Omit<PreguntaAdmin, "id">>(emptyForm);
  const [configGuardada, setConfigGuardada] = useState(false);
  const [tab, setTab] = useState<"preguntas" | "config">("preguntas");

  const preguntasFiltradas = preguntas.filter((p) =>
    p.pregunta.toLowerCase().includes(busqueda.toLowerCase()),
  );
  const activas = preguntas.filter((p) => p.activa).length;

  // ── Editar ────────────────────────────────────────────────────────────────
  const handleEditar = (p: PreguntaAdmin) => {
    setEditandoId(p.id);
    setCreando(false);
    setForm({
      pregunta: p.pregunta,
      opcionA: p.opcionA,
      opcionB: p.opcionB,
      opcionC: p.opcionC,
      opcionD: p.opcionD,
      respuestaCorrecta: p.respuestaCorrecta,
      activa: p.activa,
    });
  };

  const handleGuardarEdit = () => {
    if (!editandoId) return;
    setPreguntas((prev) =>
      prev.map((p) => (p.id === editandoId ? { ...p, ...form } : p)),
    );
    setEditandoId(null);
  };

  // ── Crear ─────────────────────────────────────────────────────────────────
  const handleCrear = () => {
    setCreando(true);
    setEditandoId(null);
    setForm(emptyForm);
  };

  const handleGuardarNueva = () => {
    const nuevo: PreguntaAdmin = { id: Date.now(), ...form };
    setPreguntas((prev) => [nuevo, ...prev]);
    setCreando(false);
    setForm(emptyForm);
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleEliminar = (id: number) => {
    setPreguntas((prev) => prev.filter((p) => p.id !== id));
    if (editandoId === id) setEditandoId(null);
  };

  const handleToggleActiva = (id: number) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p)),
    );
  };

  // ── Config ────────────────────────────────────────────────────────────────
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigGuardada(true);
    setTimeout(() => setConfigGuardada(false), 2500);
  };

  const cancelarForm = () => {
    setEditandoId(null);
    setCreando(false);
    setForm(emptyForm);
  };

  // ── Form compartido (crear / editar) ─────────────────────────────────────
  const FormularioPregunta = ({
    onSave,
    onCancel,
    titulo,
  }: {
    onSave: () => void;
    onCancel: () => void;
    titulo: string;
  }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4 mb-4">
      <h3 className="font-bold text-[#003366] text-base">{titulo}</h3>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Pregunta <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={2}
          value={form.pregunta}
          onChange={(e) => setForm((f) => ({ ...f, pregunta: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white resize-none"
          placeholder="Escribe la pregunta..."
        />
      </div>

      {(["A", "B", "C", "D"] as Opcion[]).map((op) => {
        const key = `opcion${op}` as keyof typeof form;
        return (
          <div key={op}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Opción {op}
              {form.respuestaCorrecta === op && (
                <span className="ml-2 text-emerald-600 text-xs">
                  ✓ Correcta
                </span>
              )}
            </label>
            <input
              type="text"
              value={form[key] as string}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white ${
                form.respuestaCorrecta === op
                  ? "border-emerald-400 focus:ring-emerald-200 bg-emerald-50"
                  : "border-gray-200 focus:ring-cyan-300"
              }`}
              placeholder={`Opción ${op}...`}
            />
          </div>
        );
      })}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Respuesta correcta <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={form.respuestaCorrecta}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                respuestaCorrecta: e.target.value as Opcion,
              }))
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white appearance-none"
          >
            {(["A", "B", "C", "D"] as Opcion[]).map((op) => (
              <option key={op} value={op}>
                Opción {op}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={
            !form.pregunta ||
            !form.opcionA ||
            !form.opcionB ||
            !form.opcionC ||
            !form.opcionD
          }
          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Save size={14} />
          Guardar
        </button>
      </div>
    </div>
  );

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Examen de Inducción
            </h1>
            <p className="text-gray-500 mt-1">
              Administración de preguntas y configuración del examen
            </p>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Preguntas en banco",
              value: preguntas.length,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Preguntas activas",
              value: activas,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Preguntas por examen",
              value: config.puntajeTotal,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}
              >
                <ClipboardList size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: "preguntas", label: "Banco de Preguntas", icon: BookOpen },
            { key: "config", label: "Configuración", icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                tab === key
                  ? "border-[#003366] text-[#003366]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: PREGUNTAS ════════════════════════════════════════════════════ */}
        {tab === "preguntas" && (
          <div className="space-y-4">
            {/* Barra de herramientas */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar pregunta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                />
              </div>
              <button
                onClick={handleCrear}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-sm whitespace-nowrap"
              >
                <Plus size={16} />
                Nueva Pregunta
              </button>
            </div>

            {/* Formulario de creación */}
            {creando && (
              <FormularioPregunta
                titulo="Nueva Pregunta"
                onSave={handleGuardarNueva}
                onCancel={cancelarForm}
              />
            )}

            {/* Lista de preguntas */}
            <div className="space-y-3">
              {preguntasFiltradas.map((p, idx) => (
                <div key={p.id}>
                  {/* Formulario de edición inline */}
                  {editandoId === p.id ? (
                    <FormularioPregunta
                      titulo={`Editando pregunta #${idx + 1}`}
                      onSave={handleGuardarEdit}
                      onCancel={cancelarForm}
                    />
                  ) : (
                    <div
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                        p.activa
                          ? "border-gray-100"
                          : "border-gray-100 opacity-60"
                      }`}
                    >
                      {/* Header card */}
                      <div className="flex items-start gap-4 p-5">
                        {/* Número */}
                        <div
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            p.activa
                              ? "bg-[#003366] text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* Pregunta y opciones */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {p.pregunta}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(["A", "B", "C", "D"] as Opcion[]).map((op) => {
                              const key = `opcion${op}` as keyof PreguntaAdmin;
                              const esCorrecta = p.respuestaCorrecta === op;
                              return (
                                <div
                                  key={op}
                                  className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
                                    esCorrecta
                                      ? "bg-emerald-50 border border-emerald-200"
                                      : "bg-gray-50 border border-gray-100"
                                  }`}
                                >
                                  <span
                                    className={`font-bold shrink-0 ${esCorrecta ? "text-emerald-600" : "text-gray-400"}`}
                                  >
                                    {op}.
                                  </span>
                                  <span
                                    className={`leading-snug ${esCorrecta ? "text-emerald-800 font-medium" : "text-gray-600"}`}
                                  >
                                    {p[key] as string}
                                  </span>
                                  {esCorrecta && (
                                    <CheckCircle2
                                      size={13}
                                      className="text-emerald-500 shrink-0 ml-auto mt-0.5"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Footer acciones */}
                      <div className="flex border-t border-gray-100">
                        <button
                          onClick={() => handleToggleActiva(p.id)}
                          className={`flex-1 py-2.5 text-xs font-semibold transition ${
                            p.activa
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {p.activa ? "Desactivar" : "Activar"}
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleEditar(p)}
                          className="flex-1 py-2.5 text-xs font-semibold text-[#003366] hover:bg-blue-50 transition flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleEliminar(p.id)}
                          className="flex-1 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {preguntasFiltradas.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No se encontraron preguntas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB: CONFIGURACIÓN ═══════════════════════════════════════════════ */}
        {tab === "config" && (
          <div className="max-w-xl">
            <form
              onSubmit={handleSaveConfig}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Parámetros del Examen
                </h2>
                {configGuardada && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                    <CheckCircle2 size={15} /> Guardado
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 -mt-2">
                Cada pregunta vale 1 punto. El puntaje se calcula contando
                respuestas correctas.
              </p>

              {[
                {
                  key: "puntajeAprobatorio",
                  label: "Puntaje mínimo aprobatorio",
                  min: 1,
                  max: 20,
                  hint: "de 20 puntos posibles",
                },
                {
                  key: "puntajeTotal",
                  label: "Preguntas por examen",
                  min: 1,
                  max: preguntas.filter((p) => p.activa).length,
                  hint: `máx. ${preguntas.filter((p) => p.activa).length} (preguntas activas)`,
                },
                {
                  key: "intentosMaximos",
                  label: "Intentos máximos",
                  min: 1,
                  max: 10,
                  hint: "antes de bloqueo temporal",
                },
                {
                  key: "tiempoEsperaMinutos",
                  label: "Tiempo de espera (minutos)",
                  min: 1,
                  max: 1440,
                  hint: "tras agotar intentos",
                },
              ].map(({ key, label, min, max, hint }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={config[key as keyof ConfigExamen]}
                      onChange={(e) =>
                        setConfig((c) => ({
                          ...c,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 text-center font-bold"
                    />
                    <span className="text-xs text-gray-400">{hint}</span>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition shadow"
              >
                <Save size={16} />
                Guardar Configuración
              </button>
            </form>
          </div>
        )}
      </div>
    </LayoutComponent>
  );
};

export default ExamenAdminView;
