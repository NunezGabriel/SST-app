const induccionRepository = require("../repositories/induccionRepository");

async function obtenerInduccion() {
  return await induccionRepository.getSingle();
}

async function actualizarInduccion(data) {
  return await induccionRepository.upsert(data);
}

module.exports = {
  obtenerInduccion,
  actualizarInduccion,
};
