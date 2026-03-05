const sedeRepository = require("../repositories/sedeRepository");

async function listarSedes() {
  return sedeRepository.findAll();
}

async function crearSede(nombre) {
  return sedeRepository.create(nombre);
}

async function actualizarSede(id, nombre) {
  return sedeRepository.update(id, nombre);
}

async function eliminarSede(id) {
  const count = await sedeRepository.countUsuarios(id);
  if (count > 0) {
    throw new Error(`No se puede eliminar: hay ${count} usuario(s) asignado(s) a esta sede.`);
  }
  return sedeRepository.destroy(id);
}

async function contarUsuariosPorSede(id) {
  return sedeRepository.countUsuarios(id);
}

module.exports = { listarSedes, crearSede, actualizarSede, eliminarSede, contarUsuariosPorSede };