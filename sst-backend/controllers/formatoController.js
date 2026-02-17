const formatoService = require("../services/formatoService");

async function listarFormatos(req, res) {
  try {
    const formatos = await formatoService.listarFormatos();
    res.json(formatos);
  } catch (error) {
    console.error("Error al listar formatos:", error);
    res.status(500).json({ error: "Error al listar formatos" });
  }
}

async function obtenerFormato(req, res) {
  try {
    const id = Number(req.params.id);
    const formato = await formatoService.obtenerFormato(id);
    if (!formato) {
      return res.status(404).json({ error: "Formato no encontrado" });
    }
    res.json(formato);
  } catch (error) {
    console.error("Error al obtener formato:", error);
    res.status(500).json({ error: "Error al obtener formato" });
  }
}

async function crearFormato(req, res) {
  try {
    const { nombre, tipo, enlace } = req.body;
    if (!nombre || !enlace) {
      return res
        .status(400)
        .json({ error: "nombre y enlace son obligatorios" });
    }
    const formato = await formatoService.crearFormato({ nombre, tipo, enlace });
    res.status(201).json(formato);
  } catch (error) {
    console.error("Error al crear formato:", error);
    res.status(500).json({ error: "Error al crear formato" });
  }
}

async function actualizarFormato(req, res) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const formato = await formatoService.actualizarFormato(id, data);
    res.json(formato);
  } catch (error) {
    console.error("Error al actualizar formato:", error);
    res.status(500).json({ error: "Error al actualizar formato" });
  }
}

async function eliminarFormato(req, res) {
  try {
    const id = Number(req.params.id);
    await formatoService.eliminarFormato(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar formato:", error);
    res.status(500).json({ error: "Error al eliminar formato" });
  }
}

module.exports = {
  listarFormatos,
  obtenerFormato,
  crearFormato,
  actualizarFormato,
  eliminarFormato,
};

