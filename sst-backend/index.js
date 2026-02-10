const express = require("express");

const app = express();

app.get("/api/user", (req, res) => {
  res.json({ message: "Data charged!" });
});

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

app.post("/api/user", (req, res) => {
  console.log("Data received:", req.body);
  res.json({ message: "Data received successfully!" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use((req, res) => {
  res.status(404).send("Page not found -- Desde Express. (0_0)");
});
