const express = require("express");
const ventasRouter = express.Router();
const ventasController = require("./ventas.controller");
const log = require("../../../utils/logger");
const jwtAuthhenticate = require("passport").authenticate("jwt", {
  session: false,
});
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const validarId = require("../../libs/middleware").validarId;

ventasRouter.get("/", (req, res) => {
  return ventasController.obtenerTodasLasOrdenesVenta().then((ventas) => {
    res.json(ventas);
  });
});

//venta
ventasRouter.post(
  "/vender/:id",
  [jwtAuthhenticate],
  procesarErrores(async (req, res) => {
    const idProducto = req.params.id;
    const usuarioVendedor = req.user.username;
    const nombreComprador = req.body.nombreComprador;
    const cantidadAVender = req.body.cantidad || 1;

    try {
      const { productoAVender, nuevaOrdenVenta } =
        await ventasController.realizarVenta(
          idProducto,
          usuarioVendedor,
          nombreComprador,
          cantidadAVender
        );
      log.info(
        `Venta realizada - Usuario: [${usuarioVendedor}], Producto: [${idProducto}], Comprador: [${nombreComprador}], Cantidad: [${cantidadAVender}]`
      );
      res.json({
        mensaje: "Venta realizada con éxito",
        ordenVenta: {
          vendedor: usuarioVendedor,
          comprador: nombreComprador,
          detalles: nuevaOrdenVenta.detalles,
          fecha: nuevaOrdenVenta.fecha,
        },
      });
    } catch (error) {
      log.error(
        `Error al realizar la venta - Usuario: [${usuarioVendedor}], Producto: [${idProducto}], Comprador: [${nombreComprador}], Cantidad: [${cantidadAVender}] - Error: ${error.message}`
      );
      throw error;
    }
  })
);

// Actualiza la llamada a realizarVentaAutomatica en el enrutador
ventasRouter.post(
  "/vender-automatico",
  [jwtAuthhenticate],
  procesarErrores(async (req, res) => {
    const productosAVender = req.body.productosAVender || [];
    const usuarioVendedor = req.user.username;
    const nombreComprador = req.body.nombreComprador;
    const nitComprador = req.body.nitComprador; // Agrega el NIT del comprador desde la solicitud

    try {
      const resultadoVentaAutomatica =
        await ventasController.realizarVentaAutomatica(
          productosAVender,
          usuarioVendedor,
          nombreComprador,
          nitComprador // Pasa el NIT del comprador como argumento
        );

      log.info(
        `Venta automática realizada - Vendedor: [${usuarioVendedor}], Comprador: [${nombreComprador}]`
      );

      res.json({
        mensaje: "Venta automática realizada con éxito",
        ordenVenta: {
          vendedor: usuarioVendedor,
          comprador: {
            nombre: nombreComprador,
            nit: nitComprador,
          },
          detalles: resultadoVentaAutomatica.nuevaOrdenVenta.detalles,
          fecha: resultadoVentaAutomatica.nuevaOrdenVenta.fecha,
          precioTotal: resultadoVentaAutomatica.precioTotal,
        },
      });
    } catch (error) {
      log.error(
        `Error al realizar la venta automática - Vendedor: [${usuarioVendedor}], Comprador: [${nombreComprador}] - Error: ${error.message}`
      );
      throw error;
    }
  })
);

module.exports = ventasRouter;
