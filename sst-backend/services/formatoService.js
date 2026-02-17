const formatoRepository = require("../repositories/formatoRepository");

function listarFormatos() {
  return formatoRepository.findAll();
}

function obtenerFormato(id) {
  return formatoRepository.findById(id);
}

function crearFormato(data) {
  return formatoRepository.create({
    nombre: data.nombre,
    tipo: data.tipo,
    enlace: data.enlace,
  });
}

function actualizarFormato(id, data) {
  return formatoRepository.update(id, data);
}

function eliminarFormato(id) {
  return formatoRepository.remove(id);
}

module.exports = {
  listarFormatos,
  obtenerFormato,
  crearFormato,
  actualizarFormato,
  eliminarFormato,
};

