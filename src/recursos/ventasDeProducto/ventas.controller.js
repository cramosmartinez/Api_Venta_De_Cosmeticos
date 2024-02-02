const OrdenVenta = require("../ventasDeProducto/ventas.model");
const productoController = require("../productos/productos.controller");
const { ProductoNoExiste, UsuarioNoEsDueño } = require("../productos/productos.error");

const realizarVenta = async (
  idProducto,
  usuarioVendedor,
  nombreComprador,
  cantidadAVender
) => {
  const productoAVender = await productoController.obtenerProducto(idProducto);

  if (!productoAVender) {
    throw new ProductoNoExiste(`El producto con id [${idProducto}] no existe.`);
  }

  if (productoAVender.dueño !== usuarioVendedor) {
    throw new UsuarioNoEsDueño(
      `No eres dueño del producto con id [${idProducto}]. Solo puedes vender productos creados por ti.`
    );
  }

  if (productoAVender.stock < cantidadAVender) {
    throw new Error(
      `No hay suficiente stock disponible para vender ${cantidadAVender} unidades.`
    );
  }

  productoAVender.stock -= cantidadAVender;
  await productoAVender.save();

  const precioUnitario = productoAVender.precio;

  const nuevaVentaDetalle = {
    producto: productoAVender._id,
    cantidad: cantidadAVender,
    precioUnitario: precioUnitario,
  };

  const nuevaOrdenVenta = new OrdenVenta({
    vendedor: usuarioVendedor,
    comprador: nombreComprador,
    detalles: [nuevaVentaDetalle],
  });

  await nuevaOrdenVenta.save();

  return {
    productoAVender,
    nuevaOrdenVenta,
  };
};

const obtenerTodasLasOrdenesVenta = async () => {
  return OrdenVenta.find({}).populate("detalles.producto");
};


const realizarVentaAutomatica = async (
  productosAVender,
  usuarioVendedor,
  nombreComprador,
  nitComprador
) => {
  try {
    if (!productosAVender || productosAVender.length === 0) {
      throw new Error("La lista de productos a vender está vacía.");
    }

    // Verifica si el comprador proporcionó el NIT
    if (!nitComprador) {
      throw new Error("El NIT del comprador es obligatorio.");
    }

    // Realiza una verificación del dueño al producto
    const primerProducto = await productoController.obtenerProducto(
      productosAVender[0].idProducto
    );

    if (!primerProducto || primerProducto.dueño !== usuarioVendedor) {
      throw new UsuarioNoEsDueño(
        "No eres dueño de todos los productos seleccionados."
      );
    }

    // Verifica que haya suficiente stock
    for (const producto of productosAVender) {
      const productoAVender = await productoController.obtenerProducto(
        producto.idProducto
      );

      if (!productoAVender) {
        throw new ProductoNoExiste(
          `El producto con id [${producto.idProducto}] no existe.`
        );
      }

      if (productoAVender.stock < producto.cantidad) {
        throw new Error(
          `No hay suficiente stock disponible para vender ${producto.cantidad} unidades del producto con id [${producto.idProducto}].`
        );
      }
    }

    // Realiza la venta y reduce el stock
    for (const producto of productosAVender) {
      const productoAVender = await productoController.obtenerProducto(
        producto.idProducto
      );

      productoAVender.stock -= producto.cantidad;
      await productoAVender.save();
    }

    const detallesVenta = [];

    for (const producto of productosAVender) {
      const productoAVender = await productoController.obtenerProducto(
        producto.idProducto
      );

      const precioUnitario = productoAVender.precio;
      const detalleVenta = {
        producto: producto.idProducto,
        cantidad: producto.cantidad,
        precioUnitario: precioUnitario,
      };

      detallesVenta.push(detalleVenta);
    }

    const precioTotal = detallesVenta.reduce((total, detalle) => {
      return total + detalle.cantidad * detalle.precioUnitario;
    }, 0);

    // Registra la nueva venta
    const nuevaOrdenVenta = new OrdenVenta({
      vendedor: usuarioVendedor,
      comprador: {
        nombre: nombreComprador,
        nit: nitComprador,
      },
      detalles: detallesVenta,
      precioTotal: precioTotal,
    });
    

    await nuevaOrdenVenta.save();

    return {
      productosAVender,
      precioTotal,
      nuevaOrdenVenta,
    };
  } catch (error) {
    throw error;
  }
};


module.exports = {
  realizarVenta,
  obtenerTodasLasOrdenesVenta,
  realizarVentaAutomatica,
};
