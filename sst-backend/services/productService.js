const productRepository = require("../repositories/productRepository");

function getAllProducts() {
  return productRepository.findAll();
}

function getProductById(id) {
  return productRepository.findById(id);
}

function createProduct(data) {
  return productRepository.create(data);
}

function updateProduct(id, data) {
  return productRepository.update(id, data);
}

function deleteProduct(id) {
  return productRepository.remove(id);
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

