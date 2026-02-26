const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const charlaRoutes = require("./routes/charlaRoutes");
const documentoRoutes = require("./routes/documentoRoutes");
const formatoRoutes = require("./routes/formatoRoutes");
const logroRoutes = require("./routes/logroRoutes");
const notificacionRoutes = require("./routes/notificacionRoutes");
const induccionRoutes = require("./routes/induccionRoutes");
const examenRoutes = require("./routes/examenRoutes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// Servir la interfaz básica si tienes index.html
app.use(express.static(path.join(__dirname)));

app.get("/api/conection", (req, res) => {
  res.send("Hello ! Connection established. (-_-) ");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);

// Rutas de recuperación de contraseña
app.use("/api/password-reset", passwordResetRoutes);

// Rutas de administración de usuarios
app.use("/api/usuarios", usuarioRoutes);

// Rutas de charlas de seguridad
app.use("/api/charlas", charlaRoutes);

// Rutas de documentación de seguridad
app.use("/api/documentos", documentoRoutes);

// Rutas de formatos y plantillas
app.use("/api/formatos", formatoRoutes);

// Rutas de logros
app.use("/api/logros", logroRoutes);

// Rutas de notificaciones
app.use("/api/notificaciones", notificacionRoutes);

// Rutas de inducción
app.use("/api/induccion", induccionRoutes);

// Rutas de examen
app.use("/api/examen", examenRoutes);

// Middleware 404 (debe ir al final)
app.use((req, res) => {
  res.status(404).send("Page not found -- Desde Express. (0_0)");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
