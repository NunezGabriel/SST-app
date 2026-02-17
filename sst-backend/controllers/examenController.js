const examenService = require("../services/examenService");

// ========== CONFIGURACIÓN ==========
async function obtenerConfiguracion(req, res) {
  try {
    const config = await examenService.obtenerConfiguracion();
    res.json(config);
  } catch (error) {
    console.error("Error al obtener configuración:", error);
    res.status(500).json({ error: "Error al obtener configuración del examen" });
  }
}

async function actualizarConfiguracion(req, res) {
  try {
    const { puntajeAprobatorio, puntajeTotal, intentosMaximos, tiempoEsperaMinutos } =
      req.body;
    const config = await examenService.actualizarConfiguracion({
      puntajeAprobatorio: Number(puntajeAprobatorio),
      puntajeTotal: Number(puntajeTotal),
      intentosMaximos: Number(intentosMaximos),
      tiempoEsperaMinutos: Number(tiempoEsperaMinutos),
    });
    res.json(config);
  } catch (error) {
    console.error("Error al actualizar configuración:", error);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
}

// ========== PREGUNTAS ==========
async function listarPreguntas(req, res) {
  try {
    const preguntas = await examenService.listarPreguntas();
    res.json(preguntas);
  } catch (error) {
    console.error("Error al listar preguntas:", error);
    res.status(500).json({ error: "Error al listar preguntas" });
  }
}

async function listarPreguntasActivas(req, res) {
  try {
    const preguntas = await examenService.listarPreguntasActivas();
    res.json(preguntas);
  } catch (error) {
    console.error("Error al listar preguntas activas:", error);
    res.status(500).json({ error: "Error al listar preguntas activas" });
  }
}

async function obtenerPregunta(req, res) {
  try {
    const id = Number(req.params.id);
    const pregunta = await examenService.obtenerPregunta(id);
    if (!pregunta) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    res.json(pregunta);
  } catch (error) {
    console.error("Error al obtener pregunta:", error);
    res.status(500).json({ error: "Error al obtener pregunta" });
  }
}

async function crearPregunta(req, res) {
  try {
    const {
      pregunta,
      opcionA,
      opcionB,
      opcionC,
      opcionD,
      respuestaCorrecta,
      activa,
    } = req.body;
    if (!pregunta || !opcionA || !opcionB || !opcionC || !opcionD || !respuestaCorrecta) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }
    const nuevaPregunta = await examenService.crearPregunta({
      pregunta,
      opcionA,
      opcionB,
      opcionC,
      opcionD,
      respuestaCorrecta,
      activa: activa !== undefined ? activa : true,
    });
    res.status(201).json(nuevaPregunta);
  } catch (error) {
    console.error("Error al crear pregunta:", error);
    res.status(500).json({ error: "Error al crear pregunta" });
  }
}

async function actualizarPregunta(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const pregunta = await examenService.actualizarPregunta(id, data);
    res.json(pregunta);
  } catch (error) {
    console.error("Error al actualizar pregunta:", error);
    res.status(500).json({ error: "Error al actualizar pregunta" });
  }
}

async function eliminarPregunta(req, res) {
  try {
    const id = Number(req.params.id);
    await examenService.eliminarPregunta(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar pregunta:", error);
    res.status(500).json({ error: "Error al eliminar pregunta" });
  }
}

// ========== RENDIR EXAMEN ==========
async function generarPreguntas(req, res) {
  try {
    const preguntas = await examenService.generarPreguntasAleatorias();
    res.json(preguntas);
  } catch (error) {
    console.error("Error al generar preguntas:", error);
    res.status(500).json({ error: error.message || "Error al generar preguntas" });
  }
}

async function rendirExamen(req, res) {
  try {
    const usuarioId = req.user.id;
    const { respuestas } = req.body; // { preguntaId: "A" | "B" | "C" | "D" }

    if (!respuestas || typeof respuestas !== "object") {
      return res.status(400).json({
        error: "Debes enviar un objeto con las respuestas (ej: { 1: 'A', 2: 'B', ... })",
      });
    }

    const resultado = await examenService.rendirExamen(usuarioId, respuestas);
    res.json(resultado);
  } catch (error) {
    console.error("Error al rendir examen:", error);
    res.status(400).json({ error: error.message || "Error al rendir examen" });
  }
}

async function obtenerHistorialIntentos(req, res) {
  try {
    const usuarioId = req.user.id;
    const historial = await examenService.obtenerHistorialIntentos(usuarioId);
    res.json(historial);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error al obtener historial de intentos" });
  }
}

async function obtenerEstadoExamen(req, res) {
  try {
    const usuarioId = req.user.id;
    const estado = await examenService.obtenerEstadoExamen(usuarioId);
    res.json(estado);
  } catch (error) {
    console.error("Error al obtener estado:", error);
    res.status(500).json({ error: "Error al obtener estado del examen" });
  }
}

async function resetearBloqueo(req, res) {
  try {
    const usuarioId = req.user.id;
    await examenService.resetearBloqueo(usuarioId);
    res.json({ message: "Bloqueo reseteado. Puedes ver el video de inducción nuevamente." });
  } catch (error) {
    console.error("Error al resetear bloqueo:", error);
    res.status(500).json({ error: "Error al resetear bloqueo" });
  }
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
  generarPreguntas,
  rendirExamen,
  obtenerHistorialIntentos,
  obtenerEstadoExamen,
  resetearBloqueo,
};
