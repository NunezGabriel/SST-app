const express = require("express");
const path = require("path");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

// Servir la interfaz básica si tienes index.html
app.use(express.static(path.join(__dirname)));

// Rutas existentes de ejemplo
app.get("/api/cars", (req, res) => {
  res.json({ message: "Data charged!" });
});

app.get("/api/hello", (req, res) => {
  res.send("Hello gabriel!");
});

// Nueva ruta para productos (CRUD)
app.use("/api/products", productRoutes);

// Middleware 404 (debe ir al final)
app.use((req, res) => {
  res.status(404).send("Page not found -- Desde Express. (0_0)");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
