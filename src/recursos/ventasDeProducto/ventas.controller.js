const Venta = require("../ventasDeProducto/ventas.model");
const productoController = require("../productos/productos.controller");
//RealizarVenta

const realizarVenta = async (
  idProducto,
  usuarioVendedor,
  nombreComprador,
  cantidadAVender
) => {
  //Obetenemos el producto a vender
  const productoAVender = await productoController.obtenerProducto(idProducto);

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
    stock: 0,
    dueño: usuarioVendedor,
    moneda: "USD",
    precio: 0,
    nombre: "NombreDeLaVenta",
  });

  await nuevaVenta.save();

  return {
    productoAVender,
    nuevaVenta,
  };
};

const obtenerTodasLasVentas = async () => {
  return Venta.find({});
};

module.exports = {
  obtenerTodasLasVentas,
  realizarVenta,
};
