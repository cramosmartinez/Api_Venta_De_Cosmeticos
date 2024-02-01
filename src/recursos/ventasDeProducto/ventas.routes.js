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
  return ventasController.obtenerTodasLasVentas().then((ventas) => {
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
      const { productoAVender, nuevaVenta } =
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
        venta: {
          producto: productoAVender,
          fecha: nuevaVenta.fecha,
          vendedor: usuarioVendedor,
          comprador: nombreComprador,
          cantidad: cantidadAVender,
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

module.exports = ventasRouter;
