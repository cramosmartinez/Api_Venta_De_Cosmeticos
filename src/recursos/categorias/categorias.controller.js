const CategoriaProducto = require("./categorias.model");

async function crearCategoriaProducto(nombre) {
  return CategoriaProducto.create({ nombre });
}

async function obtenerCategoriasProductos() {
  return CategoriaProducto.find({});
}

async function obtenerCategoriaPorId(id) {
  return CategoriaProducto.findById(id);
}

module.exports = {
  crearCategoriaProducto,
  obtenerCategoriasProductos,
  obtenerCategoriaPorId,
};
