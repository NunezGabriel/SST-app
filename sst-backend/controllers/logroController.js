const logroService = require("../services/logroService");

async function listarLogrosSistema(req, res) {
  try {
    const logros = await logroService.listarLogrosSistema();
    res.json(logros);
  } catch (error) {
    console.error("Error al listar logros del sistema:", error);
    res.status(500).json({ error: "Error al listar logros" });
  }
}

async function crearLogro(req, res) {
  try {
    const { nombre, descripcion, icono } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del logro es obligatorio" });
    }
    const logro = await logroService.crearLogro({ nombre, descripcion, icono });
    res.status(201).json(logro);
  } catch (error) {
    console.error("Error al crear logro:", error);
    res.status(500).json({ error: "Error al crear logro" });
  }
}

async function actualizarLogro(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const logro = await logroService.actualizarLogro(id, data);
    res.json(logro);
  } catch (error) {
    console.error("Error al actualizar logro:", error);
    res.status(500).json({ error: "Error al actualizar logro" });
  }
}

async function eliminarLogro(req, res) {
  try {
    const id = Number(req.params.id);
    await logroService.eliminarLogro(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar logro:", error);
    res.status(500).json({ error: "Error al eliminar logro" });
  }
}

async function listarLogrosUsuario(req, res) {
  try {
    const usuarioId = req.user.id;
    const logros = await logroService.listarLogrosDeUsuario(usuarioId);
    res.json(logros);
  } catch (error) {
    console.error("Error al listar logros de usuario:", error);
    res.status(500).json({ error: "Error al listar logros de usuario" });
  }
}

module.exports = {
  listarLogrosSistema,
  crearLogro,
  actualizarLogro,
  eliminarLogro,
  listarLogrosUsuario,
};

