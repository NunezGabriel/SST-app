const notificacionRepository = require("../repositories/notificacionRepository");

function crearNotificacionParaUsuario({
  idUsuario,
  nombre,
  descripcion,
  tipo,
}) {
  return notificacionRepository.create({
    idUsuario,
    nombre,
    descripcion,
    tipo,
  });
}

function crearNotificacionesParaUsuarios(notificaciones) {
  return notificacionRepository.createMany(notificaciones);
}

function listarPorUsuario(idUsuario) {
  return notificacionRepository.findByUsuario(idUsuario);
}

function marcarLeida(id) {
  return notificacionRepository.marcarLeida(id);
}

function marcarTodasLeidas(idUsuario) {
  return notificacionRepository.marcarTodasLeidas(idUsuario);
}

module.exports = {
  crearNotificacionParaUsuario,
  crearNotificacionesParaUsuarios,
  listarPorUsuario,
  marcarLeida,
  marcarTodasLeidas,
};

