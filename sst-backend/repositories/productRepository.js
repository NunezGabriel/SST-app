const prisma = require("../prisma");

/**
 * Obtiene todos los productos
 * @returns {Promise<Array>} Lista de productos
 */
function findAll() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Obtiene un producto por su ID
 * @param {number} id - ID del producto
 * @returns {Promise<Object|null>} Producto encontrado o null
 */
function findById(id) {
  return prisma.product.findUnique({
    where: { id },
  });
}

/**
 * Crea un nuevo producto
 * @param {Object} data - Datos del producto { name, price }
 * @returns {Promise<Object>} Producto creado
 */
function create(data) {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
    },
  });
}

/**
 * Actualiza un producto existente
 * @param {number} id - ID del producto
 * @param {Object} data - Datos a actualizar { name, price }
 * @returns {Promise<Object>} Producto actualizado
 */
function update(id, data) {
  return prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
    },
  });
}

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Producto eliminado
 */
function remove(id) {
  return prisma.product.delete({
    where: { id },
  });
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
