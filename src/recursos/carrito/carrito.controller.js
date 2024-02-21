const Carrito = require("./carrito.model");
const Producto = require("../productos/productos.model");

async function agregarProductoAlCarrito(usuario, productoId, cantidad) {
  const producto = await Producto.findById(productoId);
  if (!producto) {
    throw new Error(`Producto con ID ${productoId} no encontrado.`);
  }

  const carritoExistente = await Carrito.findOne({ usuario });
  if (carritoExistente) {
    const index = carritoExistente.productos.findIndex(
      (item) => item.productoId.toString() === productoId
    );
    if (index !== -1) {
      carritoExistente.productos[index].cantidad += cantidad;
    } else {
      carritoExistente.productos.push({ productoId, cantidad });
    }
    carritoExistente.total += producto.precio * cantidad;
    return carritoExistente.save();
  } else {
    const nuevoCarrito = new Carrito({
      usuario,
      productos: [{ productoId, cantidad }],
      total: producto.precio * cantidad,
    });
    return nuevoCarrito.save();
  }
}

async function obtenerCarritoPorUsuario(usuario) {
  return Carrito.findOne({ usuario }).populate("productos.productoId");
}

async function eliminarProductoDelCarrito(usuario, productoId) {
  const carrito = await Carrito.findOne({ usuario });
  if (!carrito) {
    throw new Error(`Carrito no encontrado para el usuario ${usuario}.`);
  }

  const index = carrito.productos.findIndex(
    (item) => item.productoId.toString() === productoId
  );
  if (index !== -1) {
    const producto = await Producto.findById(productoId);
    carrito.total -= producto.precio * carrito.productos[index].cantidad;
    carrito.productos.splice(index, 1);
    return carrito.save();
  } else {
    throw new Error(`Producto con ID ${productoId} no encontrado en el carrito.`);
  }
}

module.exports = {
  agregarProductoAlCarrito,
  obtenerCarritoPorUsuario,
  eliminarProductoDelCarrito,
};
