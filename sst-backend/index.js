const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

app.get("/products", (req, res) => {
  res.send("Lista de productos");
});

app.post("/products", (req, res) => {
  res.send("Producto creado");
});

app.put("/products:id", (req, res) => {
  res.send("Producto editado correctamente");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use((req, res) => {
  res.status(404).send("Page not found -- Desde Express. (0_0)");
});
