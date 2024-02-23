const express = require("express");
const ordenCompraRouter = express.Router();
const ordenCompraController = require("./ordenCompra.controller");
const passport = require("passport");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const log = require("../../../utils/logger");

ordenCompraRouter.post("/confirmar", jwtAuthenticate, async (req, res) => {
  try {
    const usuario = req.user.username;
    log.info(`Intentando confirmar orden de compra para el usuario: ${usuario}`);
    await ordenCompraController.confirmarOrdenCompra(usuario);
    log.info("Orden de compra confirmada con éxito");
    res.status(200).json({ message: "Orden de compra confirmada con éxito" });
  } catch (error) {
    log.error("Error al confirmar orden de compra:", error);
    res.status(500).json({ message: error.message });
  }
});

ordenCompraRouter.get("/", async (req, res) => {
  try {
    log.info("Intentando obtener todas las órdenes de compra");
    const ordenesCompra = await ordenCompraController.obtenerTodasOrdenesCompra();
    log.info("Órdenes de compra obtenidas:", ordenesCompra);
    res.status(200).json(ordenesCompra);
  } catch (error) {
    log.error("Error al obtener todas las órdenes de compra:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = ordenCompraRouter;
