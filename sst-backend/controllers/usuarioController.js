const usuarioService = require("../services/usuarioService");

// Helper para traducir errores de Prisma a mensajes legibles
function parsearErrorPrisma(error) {
  if (error.code === "P2002") {
    const campo = error.meta?.target?.[0];
    if (campo === "dni")    return "El DNI ingresado ya está registrado.";
    if (campo === "correo") return "El correo ingresado ya está en uso.";
    return "Ya existe un usuario con ese dato único.";
  }
  if (error.code === "P2003") return "La sede seleccionada no existe.";
  if (error.message)          return error.message;
  return "Error al crear usuario.";
}

async function crearUsuario(req, res) {
  try {
    const { nombre, apellido, dni, correo, contrasena, tipo, telefono, idSede } = req.body;

    if (!nombre || !apellido || !dni || !correo || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios para crear el usuario" });
    }
    if (!idSede) {
      return res.status(400).json({ error: "Debes seleccionar una sede." });
    }

    const nuevoUsuario = await usuarioService.crearUsuarioConAsignaciones({
      nombre,
      apellido,
      dni,
      correo,
      contrasena,
      tipo,
      telefono,
      idSede: Number(idSede),   // ← FK correcta
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    const mensaje = parsearErrorPrisma(error);
    res.status(400).json({ error: mensaje });
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
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

async function actualizarUsuario(req, res) {
  try {
    const id   = Number(req.params.id);
    const data = req.body;
    if (data.idSede) data.idSede = Number(data.idSede);

    const usuarioActualizado = await usuarioService.actualizarUsuario(id, data);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    const mensaje = parsearErrorPrisma(error);
    res.status(400).json({ error: mensaje });
  }
}

async function desactivarUsuario(req, res) {
  try {
    await usuarioService.desactivarUsuario(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ error: "Error al desactivar usuario" });
  }
}

async function activarUsuario(req, res) {
  try {
    await usuarioService.activarUsuario(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Error al activar usuario:", error);
    res.status(500).json({ error: "Error al activar usuario" });
  }
}

async function eliminarUsuario(req, res) {
  try {
    await usuarioService.eliminarUsuario(Number(req.params.id));
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