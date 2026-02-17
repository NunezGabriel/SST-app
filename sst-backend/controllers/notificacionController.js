const notificacionService = require("../services/notificacionService");

async function listar(req, res) {
  try {
    const usuarioId = req.user.id;
    const notificaciones = await notificacionService.listarPorUsuario(
      usuarioId
    );
    res.json(notificaciones);
  } catch (error) {
    console.error("Error al listar notificaciones:", error);
    res.status(500).json({ error: "Error al listar notificaciones" });
  }
}

async function marcarLeida(req, res) {
  try {
    const id = Number(req.params.id);
    const notificacion = await notificacionService.marcarLeida(id);
    res.json(notificacion);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    res
      .status(500)
      .json({ error: "Error al marcar notificación como leída" });
  }
}

async function marcarTodasLeidas(req, res) {
  try {
    const usuarioId = req.user.id;
    await notificacionService.marcarTodasLeidas(usuarioId);
    res.status(204).send();
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error);
    res
      .status(500)
      .json({ error: "Error al marcar todas las notificaciones como leídas" });
  }
}

module.exports = {
  listar,
  marcarLeida,
  marcarTodasLeidas,
};

