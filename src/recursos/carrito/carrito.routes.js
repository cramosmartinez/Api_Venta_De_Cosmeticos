const express = require("express");
const carritoRouter = express.Router();
const carritoController = require("./carrito.controller");
const passport = require("passport");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;


// Agregar producto al carrito
carritoRouter.post(
  "/",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    const { productoId, cantidad } = req.body;
    const usuario = req.user.username;
    const carrito = await carritoController.agregarProductoAlCarrito(
      usuario,
      productoId,
      cantidad
    );
    res.status(200).json(carrito);
  })
);

// Obtener carrito del usuario actual
carritoRouter.get(
  "/detalle",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    const usuario = req.user.username;
    const carrito = await carritoController.obtenerCarritoPorUsuario(usuario);
    res.status(200).json(carrito);
  })
);

// Eliminar producto del carrito
carritoRouter.delete(
  "/eliminar/:productoId",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    const usuario = req.user.username;
    const productoId = req.params.productoId;
    await carritoController.eliminarProductoDelCarrito(usuario, productoId);
    res.status(200).json({ message: "Producto eliminado del carrito." });
  })
);



module.exports = carritoRouter;