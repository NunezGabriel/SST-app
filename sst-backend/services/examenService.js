const configuracionExamenRepository = require("../repositories/configuracionExamenRepository");
const preguntaExamenRepository = require("../repositories/preguntaExamenRepository");
const intentoExamenRepository = require("../repositories/intentoExamenRepository");
const bloqueoExamenRepository = require("../repositories/bloqueoExamenRepository");
const prisma = require("../prisma");
const logroService = require("./logroService");
const notificacionService = require("./notificacionService");

// ========== CONFIGURACIÓN ==========
async function obtenerConfiguracion() {
  let config = await configuracionExamenRepository.getSingle();
  if (!config) {
    // Crear configuración por defecto si no existe
    config = await configuracionExamenRepository.upsert({
      puntajeAprobatorio: 14,
      puntajeTotal: 20,
      intentosMaximos: 3,
      tiempoEsperaMinutos: 10,
    });
  }
  return config;
}

async function actualizarConfiguracion(data) {
  return await configuracionExamenRepository.upsert(data);
}

// ========== PREGUNTAS ==========
function listarPreguntas() {
  return preguntaExamenRepository.findAll();
}

function listarPreguntasActivas() {
  return preguntaExamenRepository.findAllActivas();
}

function obtenerPregunta(id) {
  return preguntaExamenRepository.findById(id);
}

async function crearPregunta(data) {
  return await preguntaExamenRepository.create(data);
}

async function actualizarPregunta(id, data) {
  return await preguntaExamenRepository.update(id, data);
}

async function eliminarPregunta(id) {
  return await preguntaExamenRepository.remove(id);
}

// ========== RENDIR EXAMEN ==========
async function generarPreguntasAleatorias() {
  const preguntas = await preguntaExamenRepository.findAllActivas();
  if (preguntas.length < 20) {
    throw new Error("No hay suficientes preguntas activas (mínimo 20)");
  }
  // Mezclar y tomar 20
  const mezcladas = preguntas.sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, 20).map((p) => ({
    id: p.id,
    pregunta: p.pregunta,
    opcionA: p.opcionA,
    opcionB: p.opcionB,
    opcionC: p.opcionC,
    opcionD: p.opcionD,
  }));
}

async function verificarBloqueo(usuarioId) {
  const bloqueo = await bloqueoExamenRepository.findByUsuario(usuarioId);
  if (!bloqueo) return null;

  if (bloqueo.bloqueadoHasta && new Date() < bloqueo.bloqueadoHasta) {
    return bloqueo;
  }
  return null;
}

async function rendirExamen(usuarioId, respuestas) {
  const config = await obtenerConfiguracion();
  const bloqueo = await verificarBloqueo(usuarioId);

  if (bloqueo) {
    throw new Error(
      `Estás bloqueado hasta ${bloqueo.bloqueadoHasta.toISOString()}. Debes ver el video de inducción nuevamente.`
    );
  }

  // Obtener bloqueo actual para contar intentos
  let bloqueoActual = await bloqueoExamenRepository.findByUsuario(usuarioId);
  if (!bloqueoActual) {
    bloqueoActual = await bloqueoExamenRepository.create({
      idUsuario: usuarioId,
      intentosUsados: 0,
    });
  }

  if (bloqueoActual.intentosUsados >= config.intentosMaximos) {
    // Bloquear por tiempo de espera
    const bloqueadoHasta = new Date();
    bloqueadoHasta.setMinutes(
      bloqueadoHasta.getMinutes() + config.tiempoEsperaMinutos
    );
    await bloqueoExamenRepository.update(bloqueoActual.id, {
      bloqueadoHasta,
      fechaUltimoIntento: new Date(),
    });
    throw new Error(
      `Has agotado tus ${config.intentosMaximos} intentos. Debes ver el video de inducción nuevamente y esperar ${config.tiempoEsperaMinutos} minutos.`
    );
  }

  // Obtener preguntas correctas
  const preguntasIds = Object.keys(respuestas).map(Number);
  const preguntas = await prisma.preguntaExamen.findMany({
    where: { id: { in: preguntasIds } },
  });

  // Calificar
  let correctas = 0;
  const respuestasDetalle = {};

  preguntas.forEach((p) => {
    const respuestaUsuario = respuestas[p.id];
    const esCorrecta = respuestaUsuario === p.respuestaCorrecta;
    respuestasDetalle[p.id] = {
      pregunta: p.pregunta,
      respuestaUsuario,
      respuestaCorrecta: p.respuestaCorrecta,
      esCorrecta,
    };
    if (esCorrecta) correctas++;
  });

  const aprobado = correctas >= config.puntajeAprobatorio;
  const numeroIntento = bloqueoActual.intentosUsados + 1;

  // Guardar intento
  const intento = await intentoExamenRepository.create({
    idUsuario: usuarioId,
    numeroIntento,
    puntajeObtenido: correctas,
    aprobado,
    respuestasJson: respuestasDetalle,
  });

  // Actualizar bloqueo
  await bloqueoExamenRepository.update(bloqueoActual.id, {
    intentosUsados: numeroIntento,
    fechaUltimoIntento: new Date(),
  });

  // Si aprobó, desbloquear y dar logro
  if (aprobado) {
    await bloqueoExamenRepository.update(bloqueoActual.id, {
      bloqueadoHasta: null,
      intentosUsados: 0, // Resetear intentos
    });

    // Buscar logro "Aprobado" y desbloquearlo
    await logroService.desbloquearLogroPorNombre(usuarioId, "Aprobado");

    // Notificar aprobación
    await notificacionService.crearNotificacionParaUsuario({
      idUsuario: usuarioId,
      nombre: "¡Examen Aprobado!",
      descripcion: `Felicitaciones, aprobaste el examen con ${correctas}/${config.puntajeTotal} puntos.`,
      tipo: "LOGRO",
    });
  } else {
    // Si falló y es el último intento, bloquear
    if (numeroIntento >= config.intentosMaximos) {
      const bloqueadoHasta = new Date();
      bloqueadoHasta.setMinutes(
        bloqueadoHasta.getMinutes() + config.tiempoEsperaMinutos
      );
      await bloqueoExamenRepository.update(bloqueoActual.id, {
        bloqueadoHasta,
      });

      await notificacionService.crearNotificacionParaUsuario({
        idUsuario: usuarioId,
        nombre: "Examen Reprobado",
        descripcion: `Has agotado tus intentos. Debes ver el video de inducción nuevamente y esperar ${config.tiempoEsperaMinutos} minutos antes de volver a intentar.`,
        tipo: "PENDIENTE",
      });
    }
  }

  return {
    intento,
    puntaje: correctas,
    puntajeTotal: config.puntajeTotal,
    aprobado,
    respuestasDetalle,
  };
}

async function resetearBloqueo(usuarioId) {
  const bloqueo = await bloqueoExamenRepository.findByUsuario(usuarioId);
  if (bloqueo) {
    await bloqueoExamenRepository.update(bloqueo.id, {
      bloqueadoHasta: null,
      intentosUsados: 0,
    });
  }
}

async function obtenerHistorialIntentos(usuarioId) {
  return await intentoExamenRepository.findByUsuario(usuarioId);
}

async function obtenerEstadoExamen(usuarioId) {
  const bloqueo = await bloqueoExamenRepository.findByUsuario(usuarioId);
  const config = await obtenerConfiguracion();
  const historial = await intentoExamenRepository.findByUsuario(usuarioId);

  const mejorIntento = historial.length > 0
    ? historial.reduce((mejor, actual) =>
        actual.puntajeObtenido > mejor.puntajeObtenido ? actual : mejor
      )
    : null;

  return {
    bloqueado: bloqueo?.bloqueadoHasta && new Date() < bloqueo.bloqueadoHasta,
    bloqueadoHasta: bloqueo?.bloqueadoHasta || null,
    intentosUsados: bloqueo?.intentosUsados || 0,
    intentosMaximos: config.intentosMaximos,
    puedeRendir: !bloqueo || !bloqueo.bloqueadoHasta || new Date() >= bloqueo.bloqueadoHasta,
    mejorPuntaje: mejorIntento?.puntajeObtenido || null,
    aprobado: mejorIntento?.aprobado || false,
    historial: historial.length,
  };
}

module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  listarPreguntas,
  listarPreguntasActivas,
  obtenerPregunta,
  crearPregunta,
  actualizarPregunta,
  eliminarPregunta,
  generarPreguntasAleatorias,
  rendirExamen,
  resetearBloqueo,
  obtenerHistorialIntentos,
  obtenerEstadoExamen,
};
