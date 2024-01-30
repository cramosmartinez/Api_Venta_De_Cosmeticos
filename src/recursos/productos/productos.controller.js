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

//RealizarVenta

const realizarVenta = async (
  idProducto,
  usuarioVendedor,
  nombreComprador,
  cantidadAVender
) => {
  //Obetenemos el producto a vender
  const productoAVender = await obtenerProducto(idProducto);

  if (!productoAVender) {
    throw new ProductoNoExiste(`El producto con id [${idProducto}] no existe.`);
  }

  // Verificar que el usuario sea el dueño del producto
  if (productoAVender.dueño !== usuarioVendedor) {
    throw new UsuarioNoEsDueño(
      `No eres dueño del producto con id [${idProducto}]. Solo puedes vender productos creados por ti.`
    );
  }

  // Verificamos si hay suficiente stock para vender
  if (productoAVender.stock < cantidadAVender) {
    throw new Error(
      `No hay suficiente stock disponible para vender ${cantidadAVender} unidades.`
    );
  }

  // Actualizar el stock del producto
  productoAVender.stock -= cantidadAVender;
  await productoAVender.save();

  // Registra la nueva venta
  const nuevaVenta = new Venta({
    producto: productoAVender._id,
    vendedor: usuarioVendedor,
    comprador: nombreComprador,
    cantidad: cantidadAVender,
  });

  await nuevaVenta.save();

  return {
    productoAVender,
    nuevaVenta,
  };
};
const obtenerTodasLasVentas = async () => {
  const ventas = await Venta.find({}).populate("producto");

  return ventas;
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  borrarProducto,
  remplazarProducto,
  obtenerTodasLasVentas,
  realizarVenta,
};
