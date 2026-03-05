const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuarioRepository = require("../repositories/usuarioRepository");

async function login(correo, contrasena) {
  const usuario = await usuarioRepository.findByCorreo(correo);

  if (!usuario || !usuario.activo) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!passwordMatch) {
    return null;
  }

  const payload = {
    id:        usuario.id,
    tipo:      usuario.tipo,
    nombre:    usuario.nombre,
    apellido:  usuario.apellido,
    idSede:    usuario.idSede,
    sede:      usuario.sede?.nombre ?? "",   // ← nombre string para Drive y UI
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  return { token, usuario: payload };
}

module.exports = { login };