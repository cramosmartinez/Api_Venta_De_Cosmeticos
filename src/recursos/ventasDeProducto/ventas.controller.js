const Venta = require("../ventasDeProducto/ventas.model");
const Producto = require("../productos/productos.model");

//RealizarVenta

const realizarVenta = async (
  idProducto,
  usuarioVendedor,
  nombreComprador,
  cantidadAVender
) => {
  // Obtener el producto que se va a vender
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

  // Verificar si hay suficiente stock
  if (productoAVender.stock < cantidadAVender) {
    throw new Error(
      `No hay suficiente stock disponible para vender ${cantidadAVender} unidades.`
    );
  }

  // Actualizar el stock del producto
  productoAVender.stock -= cantidadAVender;
  await productoAVender.save();

  // Registrar la venta
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
  const ventas = await Venta.findOne({ _id: id });

  return ventas;
};

module.exports = {
  obtenerTodasLasVentas,
  realizarVenta, // Agregamos la función venderProducto al export
};
