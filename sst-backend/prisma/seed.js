require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed de preguntas de examen...");

  const preguntas = [
    {
      pregunta: "ECYTEL ¿Es una empresa dedicada a?",
      opcionA: "Empresa distribuidora de energía eléctrica y gas natural para el sector industrial peruano",
      opcionB: "Empresa constructora y de telecomunicaciones líder en servicios de redes de fibra óptica en el Perú",
      opcionC: "Empresa minera y de construcción de carreteras con operaciones en el sur del país",
      opcionD: "Empresa de exportación de materiales de construcción y telecomunicaciones al exterior",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Según la charla de inducción, ¿qué son las inspecciones y checklist?",
      opcionA: "Son documentos legales que analizan los peligros y riesgos de una tarea específica, y definen los controles a aplicar antes de iniciar el trabajo",
      opcionB: "Son documentos de verificación para identificar el estado óptimo o no de herramientas, vehículos y equipos; deben llenarse antes de realizar cualquier trabajo",
      opcionC: "Son formatos de reporte que se llenan después de un incidente o accidente y se envían al coordinador HSE de la empresa",
      opcionD: "Son permisos escritos que autoriza el supervisor para ejecutar trabajos catalogados como de alto riesgo en la obra",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Según la sección de terminología, ¿cuál de las siguientes definiciones es INCORRECTA?",
      opcionA: "Arnés de seguridad: Dispositivo que se usa alrededor del torso del cuerpo (hombros, caderas, cintura y piernas) para detener caídas severas",
      opcionB: "Accidente: Evento no deseado que ocasiona daños a la persona de manera inmediata o involucra un deterioro a su salud",
      opcionC: "Acto inseguro: Es aquella condición propicia para la ocurrencia de un accidente, produciendo daños a los trabajadores y a las herramientas y equipos",
      opcionD: "Peligro: Propiedad o característica intrínseca de algo capaz de ocasionar daños a las personas, maquinarias o medio ambiente",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿Cuáles son los trabajos de alto riesgo mencionados en la inducción de ECYTEL?",
      opcionA: "Trabajo nocturno, trabajo eléctrico, demolición de estructuras y pintura industrial en espacios cerrados",
      opcionB: "Trabajo en altura, trabajo en espacios confinados, manipulación e izaje de materiales, trabajos en caliente y excavación de zanjas",
      opcionC: "Soldadura, trabajo con radiación, manejo de explosivos y operación de maquinaria pesada en vía pública",
      opcionD: "Trabajo en altura, trabajo con químicos, manejo de residuos peligrosos y operación de vehículos en obra",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "¿Qué compromiso asume la empresa ECYTEL en relación al medio ambiente?",
      opcionA: "Compensar económicamente a las municipalidades por el impacto ambiental generado en cada proyecto ejecutado",
      opcionB: "Reducir el uso de maquinaria pesada y reemplazarla por equipos eléctricos para disminuir las emisiones de carbono",
      opcionC: "Asumir el cuidado y conservación de los ecosistemas; al terminar la actividad la zona de trabajo debe quedar limpia de cualquier desperdicio",
      opcionD: "Plantar árboles en áreas verdes equivalentes a las zonas intervenidas durante la ejecución de sus proyectos",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "De los siguientes enunciados de la pregunta 6 del examen, ¿cuáles corresponden a un ACTO subestándar?",
      opcionA: "Llaves stilson en estado deteriorado, equipos insuficientes en el área y tormentas eléctricas en la zona",
      opcionB: "Realizar bromas durante la charla, no utilizar los implementos de seguridad, conducir a alta velocidad e ingresar en estado de ebriedad",
      opcionC: "Realizar bromas durante la charla, llaves stilson deterioradas y tormentas eléctricas en el área de trabajo",
      opcionD: "Equipos insuficientes y deteriorados, tormentas eléctricas en el área y llaves stilson en mal estado",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "De los siguientes enunciados de la pregunta 6 del examen, ¿cuáles corresponden a una CONDICIÓN subestándar?",
      opcionA: "Realizar bromas durante la charla, conducir a alta velocidad e ingresar al trabajo en estado de ebriedad",
      opcionB: "No utilizar los implementos de seguridad, conducir a alta velocidad y realizar bromas en la charla de 5 minutos",
      opcionC: "Llaves stilson en estado deteriorado, equipos insuficientes y deteriorados en el área de trabajo, y tormentas eléctricas en el área",
      opcionD: "Ingresar al trabajo en estado de ebriedad, no usar los implementos de seguridad y realizar bromas en la charla",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "En la realización del trabajo, ¿cuál de las siguientes combinaciones de peligro, riesgo y consecuencia es correcta?",
      opcionA: "Peligro: uso de computadora — Riesgo: electrocución — Consecuencia: pérdida total de la visión del trabajador",
      opcionB: "Peligro: trabajo en altura — Riesgo: caída a diferente nivel — Consecuencia: fracturas, traumatismos o muerte",
      opcionC: "Peligro: iluminación natural — Riesgo: incendio en el área — Consecuencia: quemaduras leves en manos y cara",
      opcionD: "Peligro: herramienta nueva — Riesgo: intoxicación química — Consecuencia: daño al sistema respiratorio",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Según el código de señales y colores, ¿qué tipo de señal corresponde al color AMARILLO y al color VERDE respectivamente?",
      opcionA: "Amarillo: señal contra incendios / Verde: señal de prohibición",
      opcionB: "Amarillo: señal de obligación / Verde: señal de advertencia y precaución",
      opcionC: "Amarillo: señal de advertencia y precaución / Verde: señal de salvamento o emergencia",
      opcionD: "Amarillo: señal de prohibición / Verde: señal contra incendios con círculo rojo",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "Según el código de señales y colores, ¿qué color corresponde a las señales de tipo OBLIGATORIO y cuál a las señales CONTRA INCENDIOS respectivamente?",
      opcionA: "Obligatorio: verde con cuadrado / Contra incendios: amarillo con triángulo",
      opcionB: "Obligatorio: rojo con círculo / Contra incendios: azul con cuadrado",
      opcionC: "Obligatorio: azul con círculo / Contra incendios: rojo con cuadrado o rectángulo",
      opcionD: "Obligatorio: amarillo con triángulo / Contra incendios: verde con cuadrado",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "En el rombo NFPA 704, ¿qué riesgo indica la sección AZUL y qué riesgo indica la sección ROJA?",
      opcionA: "Azul: reactividad e inestabilidad química / Rojo: riesgo para la salud por inhalación o contacto",
      opcionB: "Azul: riesgo para la salud / Rojo: inflamabilidad del material",
      opcionC: "Azul: inflamabilidad del material / Rojo: riesgo especial como oxidante o radiactivo",
      opcionD: "Azul: riesgo especial del material / Rojo: reactividad e inestabilidad química",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "En el rombo NFPA 704, ¿qué riesgo indica la sección AMARILLA y qué indica la sección BLANCA?",
      opcionA: "Amarillo: riesgo para la salud / Blanco: inflamabilidad del material almacenado",
      opcionB: "Amarillo: inflamabilidad del material / Blanco: riesgo para la salud del personal expuesto",
      opcionC: "Amarillo: reactividad o inestabilidad del material / Blanco: información especial (oxidante, radiactivo, etc.)",
      opcionD: "Amarillo: señal de precaución general / Blanco: nivel de toxicidad del material en escala del 0 al 4",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿Cuál es el propósito de los Elementos de Protección Personal (EPP) según la inducción?",
      opcionA: "Reemplazar las protecciones colectivas como barandas y mallas en todos los trabajos de alto riesgo",
      opcionB: "Cumplir con las exigencias legales del Ministerio de Trabajo para evitar multas y sanciones a la empresa",
      opcionC: "Proteger al trabajador de uno o varios riesgos que puedan amenazar su seguridad, salud y medio ambiente en el trabajo",
      opcionD: "Mejorar el rendimiento del trabajador y reducir la fatiga durante las jornadas de trabajo en campo",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "Los materiales peligrosos (HAZMAT) pueden ser (marque la alternativa INCORRECTA):",
      opcionA: "Inflamable, como la gasolina, el propano y otros líquidos o gases combustibles de uso industrial",
      opcionB: "Tóxico o corrosivo, como biocidas, insecticidas, ácido sulfúrico o soda cáustica de uso industrial",
      opcionC: "Húmedo, como materiales con alto contenido de humedad absorbida durante su almacenamiento",
      opcionD: "Radiactivo, como las cápsulas radiactivas utilizadas en procesos médicos o industriales especializados",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "Complete: 'El check list es un documento para…'",
      opcionA: "…registrar las horas trabajadas y calcular el pago de horas extras del personal en campo",
      opcionB: "…identificar el estado óptimo o no de herramientas, vehículos y equipos antes de realizar el trabajo",
      opcionC: "…analizar los peligros y riesgos de la tarea y definir los controles antes de iniciar la actividad",
      opcionD: "…reportar los incidentes y accidentes ocurridos durante la jornada al coordinador de HSE",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Complete: 'Se considera trabajo en espacios confinados por…'",
      opcionA: "…realizarse a una altura igual o mayor a 1.80 metros del suelo, requiriendo protección contra caídas",
      opcionB: "…involucrar uso de materiales inflamables o tóxicos dentro de instalaciones industriales cerradas",
      opcionC: "…desarrollarse dentro de un lugar cerrado o parcialmente cerrado, con acceso limitado, ventilación deficiente y no diseñado para ocupación continua",
      opcionD: "…ejecutarse en zonas con presencia de gases tóxicos sin importar si el espacio tiene ventilación natural disponible",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "Complete: 'En caso de quemaduras lo recomendado es…'",
      opcionA: "…aplicar pasta dental, mantequilla o aceite sobre la zona afectada para aliviar el dolor inmediatamente",
      opcionB: "…aplicar abundante agua durante aproximadamente 15 minutos sobre la zona quemada",
      opcionC: "…cubrir con vendas secas sin aplicar nada y trasladar al trabajador al centro médico más cercano",
      opcionD: "…reventar las ampollas y limpiar con alcohol la zona afectada para prevenir posibles infecciones",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "El triángulo del fuego se compone por:",
      opcionA: "Reacción en cadena, energía calorífica y temperatura de ignición del combustible involucrado",
      opcionB: "Combustible, Comburente (oxígeno) y Energía de activación (Calor)",
      opcionC: "Combustible, Comburente (oxígeno) y Reacción en cadena entre los tres elementos",
      opcionD: "Temperatura, calor específico y calor latente necesarios para sostener la combustión",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Ante un accidente, lo primero que hay que hacer es:",
      opcionA: "Llamar al número de emergencia sin evaluar previamente la situación ni atender a la víctima",
      opcionB: "Realizar RCP a la víctima de forma inmediata sin importar su estado de consciencia ni las condiciones",
      opcionC: "Avisar a la Cruz Roja y al mando superior simultáneamente mientras se aleja del área del accidente",
      opcionD: "Valorar la situación, realizar primeros auxilios y comunicar a quien corresponda",
      respuestaCorrecta: "D",
      activa: true,
    },
    {
      pregunta: "Un trabajo en altura es cuando se trabaja a más de:",
      opcionA: "1.00 metro sobre el nivel del suelo, incluyendo el uso de escaleras portátiles en cualquier superficie",
      opcionB: "1.50 metros sobre el nivel del suelo, según el estándar aplicado en la industria de la construcción",
      opcionC: "1.80 metros sobre el nivel del suelo",
      opcionD: "2.00 metros sobre el nivel del suelo, que es el mínimo exigido por el estándar internacional OSHA",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿Cuál es la diferencia entre acto y condición subestándar?",
      opcionA: "El acto subestándar es causado por factores del ambiente de trabajo; la condición subestándar es una acción voluntaria del trabajador",
      opcionB: "Acto subestándar es la acción u omisión del trabajador que genera riesgo; condición subestándar es el estado del ambiente o equipo que propicia un accidente",
      opcionC: "Ambos conceptos son equivalentes y se usan de forma indistinta en los procedimientos de seguridad",
      opcionD: "El acto subestándar siempre es intencional y con consecuencias graves; la condición siempre es accidental y sin responsables",
      respuestaCorrecta: "B",
      activa: true,
    },
    {
      pregunta: "Para realizar un trabajo de alto riesgo se necesita un permiso que se llama:",
      opcionA: "RIACS (Reporte de Incidentes, Actos y Condiciones Subestándar) emitido por el coordinador HSE",
      opcionB: "ATS (Análisis de Trabajo Seguro) firmado por el trabajador y el supervisor antes de iniciar la tarea",
      opcionC: "PETAR (Permiso Escrito de Trabajo de Alto Riesgo)",
      opcionD: "CSST (Comité de Seguridad y Salud en el Trabajo) aprobado por la jefatura de operaciones",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿Qué significan las siglas ATS?",
      opcionA: "Auditoría de Trabajo Seguro, documento que registra el cumplimiento de normas de seguridad en obra",
      opcionB: "Alerta de Trabajo Subestándar, formato de reporte ante condiciones inseguras detectadas en el área",
      opcionC: "Análisis de Trabajo Seguro",
      opcionD: "Acción de Trabajo en Seguridad, protocolo de respuesta ante emergencias en trabajos de alto riesgo",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿Cómo prevenimos las enfermedades ocupacionales?",
      opcionA: "Únicamente con el uso correcto de EPPs sin necesidad de aplicar controles adicionales al ambiente",
      opcionB: "Solo realizando exámenes médicos ocupacionales al ingreso, durante el trabajo y al retirarse de la empresa",
      opcionC: "Identificando y evaluando peligros para la salud como ruido, polvo y ergonomía, aplicando controles y haciendo seguimiento",
      opcionD: "Evitando trabajar en zonas con polvo, ruido o radiación solar bajo cualquier condición o circunstancia",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "¿El extintor de polvo (PQS) para qué clase de fuego se recomienda?",
      opcionA: "Solo para fuegos clase A (materiales sólidos como madera, papel y tela que dejan brasas al arder)",
      opcionB: "Solo para fuegos clase B (líquidos inflamables como gasolina, aceite y solventes industriales)",
      opcionC: "Para fuegos clase A, B y C (materiales sólidos, líquidos inflamables y equipos eléctricos energizados)",
      opcionD: "Solo para fuegos clase D (metales combustibles como magnesio, potasio y sodio en estado sólido)",
      respuestaCorrecta: "C",
      activa: true,
    },
    {
      pregunta: "En prevención de incendios hay un agente extintor que contiene PQS. ¿Qué significa esta sigla?",
      opcionA: "Producto Químico Sintético, agente retardante de llamas aplicado en estructuras metálicas expuestas al fuego",
      opcionB: "Polvo Químico Seco",
      opcionC: "Protección de Quemaduras Severas, protocolo de atención a víctimas con quemaduras de segundo y tercer grado",
      opcionD: "Prevención de Quemaduras con Solvente, medida de control para trabajos con líquidos inflamables en obra",
      respuestaCorrecta: "B",
      activa: true,
    },
  ];

  try {
    // Eliminar todas las preguntas existentes (opcional, comentar si no se desea)
    // await prisma.preguntaExamen.deleteMany({});

    // Crear las preguntas
    for (const pregunta of preguntas) {
      await prisma.preguntaExamen.create({
        data: pregunta,
      });
    }

    console.log(`✅ Se crearon ${preguntas.length} preguntas de examen exitosamente`);
  } catch (error) {
    console.error("❌ Error al crear las preguntas:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
