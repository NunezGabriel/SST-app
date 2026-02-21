const charlaService = require("../services/charlaService");

async function listarCharlasAdmin(req, res) {
  try {
    const charlas = await charlaService.listarCharlasAdmin();
    res.json(charlas);
  } catch (error) {
    console.error("Error al listar charlas (admin):", error);
    res.status(500).json({ error: "Error al listar charlas" });
  }
}

async function listarCharlasUsuario(req, res) {
  try {
    const usuarioId = req.user.id;
    const charlas = await charlaService.listarCharlasDeUsuario(usuarioId);
    res.json(charlas);
  } catch (error) {
    console.error("Error al listar charlas del usuario:", error);
    res.status(500).json({ error: "Error al listar charlas del usuario" });
  }
}

async function crearCharla(req, res) {
  try {
    const { nombre, enlace, etiqueta, fechaCharla } = req.body;

    if (!nombre || !enlace || !fechaCharla) {
      return res
        .status(400)
        .json({ error: "nombre, enlace y fechaCharla son obligatorios" });
    }

    // Normalizar fecha para evitar problemas de zona horaria
    const fechaNormalizada = new Date(fechaCharla);
    fechaNormalizada.setHours(0, 0, 0, 0);

    const charla = await charlaService.crearCharla({
      nombre,
      enlace,
      etiqueta,
      fechaCharla: fechaNormalizada,
    });

    res.status(201).json(charla);
  } catch (error) {
    console.error("Error al crear charla:", error);
    res.status(500).json({ error: "Error al crear charla" });
  }
}

async function actualizarCharla(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    if (data.fechaCharla) {
      // Normalizar fecha para evitar problemas de zona horaria
      const fechaNormalizada = new Date(data.fechaCharla);
      fechaNormalizada.setHours(0, 0, 0, 0);
      data.fechaCharla = fechaNormalizada;
    }

    const charla = await charlaService.actualizarCharla(id, data);
    res.json(charla);
  } catch (error) {
    console.error("Error al actualizar charla:", error);
    res.status(500).json({ error: "Error al actualizar charla" });
  }
}

async function eliminarCharla(req, res) {
  try {
    const id = Number(req.params.id);
    await charlaService.eliminarCharla(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar charla:", error);
    res.status(500).json({ error: "Error al eliminar charla" });
  }
}

async function marcarCharlaCompletada(req, res) {
  try {
    const usuarioId = req.user.id;
    const charlaId = Number(req.params.id);

    const progreso = await charlaService.marcarCharlaCompletada(
      usuarioId,
      charlaId
    );

    res.json(progreso);
  } catch (error) {
    console.error("Error al marcar charla como completada:", error);
    res
      .status(400)
      .json({ error: error.message || "Error al completar la charla" });
  }
}

module.exports = {
  listarCharlasAdmin,
  listarCharlasUsuario,
  crearCharla,
  actualizarCharla,
  eliminarCharla,
  marcarCharlaCompletada,
};

