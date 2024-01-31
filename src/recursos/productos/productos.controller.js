// productos.controller.js
const Producto = require("./productos.model");
const Venta = require("../ventasDeProducto/ventas.model");

async function crearProducto(producto, dueño) {
  return new Producto({
    ...producto,
    dueño,
    stock: producto.stock || 0, // Establecer un stock inicial si se proporciona
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



module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  borrarProducto,
  remplazarProducto,
};
