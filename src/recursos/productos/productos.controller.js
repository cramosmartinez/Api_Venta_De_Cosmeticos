// productos.controller.js
const Producto = require("./productos.model");

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

async function venderProducto(id, cantidad = 1) {
  const producto = await Producto.findById(id);

  if (!producto) {
    throw new ProductoNoExiste(`El producto con id [${id}] no existe.`);
  }

  if (producto.stock < cantidad) {
    throw new Error(
      `No hay suficiente stock disponible para vender ${cantidad} unidades.`
    );
  }

  producto.stock -= cantidad;
  await producto.save();

  return producto;
}

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  borrarProducto,
  remplazarProducto,
  venderProducto, // Agregamos la función venderProducto al export
};
