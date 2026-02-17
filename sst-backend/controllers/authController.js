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
    res.json({ user: req.user });
  } catch (error) {
    console.error("Error en me:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
}

module.exports = {
  login,
  me,
};

