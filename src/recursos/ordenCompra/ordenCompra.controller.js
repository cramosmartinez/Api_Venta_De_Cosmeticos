// ordenCompra.controller.js
const OrdenCompra = require("./ordenCompra.model");
const Carrito = require("../carrito/carrito.model");

async function confirmarOrdenCompra(usuario) {
  try {
    // Obtener el carrito del usuario
    const carrito = await Carrito.findOne({ usuario }).populate("productos.productoId");
    if (!carrito) {
      throw new Error("No se encontró el carrito del usuario");
    }

    // Crear una nueva orden de compra basada en el carrito del usuario
    const nuevaOrden = new OrdenCompra({
      usuario: carrito.usuario,
      productos: carrito.productos,
      total: carrito.total
    });

    // Guardar la orden de compra en la base de datos
    await nuevaOrden.save();

    // Eliminar el carrito del usuario después de confirmar la orden de compra
    await Carrito.findOneAndDelete({ usuario });

  } catch (error) {
    throw new Error(`Error al confirmar la orden de compra: ${error.message}`);
  }
}

async function obtenerTodasOrdenesCompra() {
  try {
    const ordenesCompra = await OrdenCompra.find();
    return ordenesCompra;
  } catch (error) {
    throw new Error(`Error al obtener todas las órdenes de compra: ${error.message}`);
  }
}

module.exports = {
  confirmarOrdenCompra,
  obtenerTodasOrdenesCompra

};
