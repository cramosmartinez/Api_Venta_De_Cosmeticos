const express = require("express");
const carritoRouter = express.Router();
const carritoController = require("./carrito.controller");
const passport = require("passport");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const log = require("../../../utils/logger");

// Agregar producto al carrito
carritoRouter.post(
  "/",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    try {
      const { productoId, cantidad } = req.body;
      const usuario = req.user.username;
      log.info(`Intentando agregar producto al carrito para el usuario: ${usuario}, productoId: ${productoId}, cantidad: ${cantidad}`);
      const carrito = await carritoController.agregarProductoAlCarrito(
        usuario,
        productoId,
        cantidad
      );
      log.info(`Producto agregado al carrito: ${JSON.stringify(carrito)}`);
      res.status(200).json(carrito);
    } catch (error) {
      log.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })
);

// Obtener carrito del usuario actual
carritoRouter.get(
  "/detalle",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    try {
      const usuario = req.user.username;
      log.info(`Intentando obtener carrito del usuario: ${usuario}`);
      const carrito = await carritoController.obtenerCarritoPorUsuario(usuario);
      log.info(`Carrito obtenido para el usuario ${usuario}: ${JSON.stringify(carrito)}`);
      res.status(200).json(carrito);
    } catch (error) {
      log.error("Error al obtener carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })
);

// Eliminar producto del carrito
carritoRouter.delete(
  "/eliminar/:productoId",
  jwtAuthenticate,
  procesarErrores(async (req, res) => {
    try {
      const usuario = req.user.username;
      const productoId = req.params.productoId;
      log.info(`Intentando eliminar producto del carrito para el usuario: ${usuario}, productoId: ${productoId}`);
      await carritoController.eliminarProductoDelCarrito(usuario, productoId);
      log.info("Producto eliminado del carrito.");
      res.status(200).json({ message: "Producto eliminado del carrito." });
    } catch (error) {
      log.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })
);

module.exports = carritoRouter;
