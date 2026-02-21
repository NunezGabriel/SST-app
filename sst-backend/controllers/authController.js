const authService = require("../services/authService");

async function login(req, res) {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const result = await authService.login(correo, contrasena);

    if (!result) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

async function me(req, res) {
  try {
    const usuarioRepository = require("../repositories/usuarioRepository");
    const usuario = await usuarioRepository.findById(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Devolver todos los datos del usuario (sin contraseña)
    const { contrasena, ...usuarioSinPassword } = usuario;
    res.json({ user: usuarioSinPassword });
  } catch (error) {
    console.error("Error en me:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
}

async function logout(req, res) {
  try {
    // Con JWT stateless, el logout es principalmente del lado del cliente
    // El token se invalidará cuando expire o el cliente lo elimine
    // Aquí solo confirmamos que el logout fue exitoso
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
}

module.exports = {
  login,
  me,
  logout,
};

