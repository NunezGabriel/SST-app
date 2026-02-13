const productService = require("../services/productService");

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
}

async function createProduct(req, res) {
  try {
    const { name, price } = req.body;
    const newProduct = await productService.createProduct({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
}

async function updateProduct(req, res) {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;
    const updatedProduct = await productService.updateProduct(id, {
      name,
      price,
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    await productService.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

