const sedeService = require("../services/sedeService");

// GET /api/sedes
async function listarSedes(req, res) {
  try {
    const sedes = await sedeService.listarSedes();
    res.json(sedes);
  } catch (error) {
    console.error("Error al listar sedes:", error.message);
    res.status(500).json({ error: "Error al listar sedes" });
  }
}

// POST /api/sedes
async function crearSede(req, res) {
  try {
    const { nombre } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ error: "El nombre es requerido" });
    const sede = await sedeService.crearSede(nombre);
    res.status(201).json(sede);
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "Ya existe una sede con ese nombre" });
    console.error("Error al crear sede:", error.message);
    res.status(500).json({ error: "Error al crear sede" });
  }
}

// PUT /api/sedes/:id
async function actualizarSede(req, res) {
  try {
    const id = Number(req.params.id);
    const { nombre } = req.body;
    if (!nombre?.trim()) return res.status(400).json({ error: "El nombre es requerido" });
    const sede = await sedeService.actualizarSede(id, nombre);
    res.json(sede);
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ error: "Ya existe una sede con ese nombre" });
    console.error("Error al actualizar sede:", error.message);
    res.status(500).json({ error: "Error al actualizar sede" });
  }
}

// DELETE /api/sedes/:id
async function eliminarSede(req, res) {
  try {
    const id = Number(req.params.id);
    await sedeService.eliminarSede(id);
    res.status(204).send();
  } catch (error) {
    // Error de negocio (usuarios asignados)
    if (error.message.startsWith("No se puede eliminar")) {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error al eliminar sede:", error.message);
    res.status(500).json({ error: "Error al eliminar sede" });
  }
}

// GET /api/sedes/:id/usuarios-count
async function contarUsuarios(req, res) {
  try {
    const id = Number(req.params.id);
    const count = await sedeService.contarUsuariosPorSede(id);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Error al contar usuarios" });
  }
}

module.exports = { listarSedes, crearSede, actualizarSede, eliminarSede, contarUsuarios };