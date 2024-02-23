// productos.controller.js
const Producto = require("./productos.model");
const CategoriaProducto = require("../categorias/categorias.model");

async function crearProducto(producto, dueño, categoria) {
  return new Producto({
    ...producto,
    dueño,
    categoria,
    stock: producto.stock || 0,
  }).save();
}

async function obtenerProductos() {
  return Producto.find({});
}

async function obtenerProducto(id) {
  return Producto.findById(id);
}

async function borrarProducto(id) {
  return Producto.findByIdAndDelete(id);
}

async function remplazarProducto(id, producto, username) {
  return Producto.findOneAndUpdate(
    { _id: id },
    { ...producto, dueño: username },
    { new: true, useFindAndModify: false }
  );
}

async function obtenerProductosPorCategoria(categoria) {
  return Producto.find({ categoria });
}

async function obtenerProductosPorUsuario(usuario) {
  return Producto.find({ dueño: usuario });
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  borrarProducto,
  remplazarProducto,
  obtenerProductosPorCategoria,
  obtenerProductosPorUsuario,
};
