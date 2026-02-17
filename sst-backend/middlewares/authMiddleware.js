const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, tipo }
    next();
  } catch (error) {
    console.error("Error al verificar token JWT:", error);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.tipo !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Acceso denegado. Se requiere rol ADMIN." });
  }
  next();
}

module.exports = {
  authMiddleware,
  adminOnly,
};

