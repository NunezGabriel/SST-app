const usuarioService = require("../services/usuarioService");

async function crearUsuario(req, res) {
  try {
    const { nombre, apellido, dni, correo, contrasena, tipo } = req.body;

    if (!nombre || !apellido || !dni || !correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Faltan datos obligatorios para crear el usuario" });
    }

    const nuevoUsuario = await usuarioService.crearUsuarioConAsignaciones({
      nombre,
      apellido,
      dni,
      correo,
      contrasena,
      tipo,
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
}

async function listarUsuariosConStats(req, res) {
  try {
    const usuarios = await usuarioService.listarUsuariosConStats();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios con stats:", error);
    res.status(500).json({ error: "Error al listar usuarios con stats" });
  }
}

async function obtenerUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const usuario = await usuarioService.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const usuarioActualizado = await usuarioService.actualizarUsuario(
      id,
      data
    );
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

async function desactivarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    await usuarioService.desactivarUsuario(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ error: "Error al desactivar usuario" });
  }
}

async function activarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    await usuarioService.activarUsuario(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al activar usuario:", error);
    res.status(500).json({ error: "Error al activar usuario" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const id = Number(req.params.id);
    await usuarioService.eliminarUsuario(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}

module.exports = {
  crearUsuario,
  listarUsuarios,
  listarUsuariosConStats,
  obtenerUsuario,
  actualizarUsuario,
  desactivarUsuario,
  activarUsuario,
  eliminarUsuario,
};

