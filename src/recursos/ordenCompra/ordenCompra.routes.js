// En tu archivo de rutas para las órdenes de compra (por ejemplo, ordenCompra.routes.js)
const express = require("express");
const ordenCompraRouter = express.Router();
const ordenCompraController = require("./ordenCompra.controller");
const passport = require("passport");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;


ordenCompraRouter.post("/confirmar", jwtAuthenticate, async (req, res) => {
  try {
    const usuario = req.user.username;
    await ordenCompraController.confirmarOrdenCompra(usuario);
    res.status(200).json({ message: "Orden de compra confirmada con éxito" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ordenCompraRouter.get("/", async (req, res) => {
  try {
    const ordenesCompra = await ordenCompraController.obtenerTodasOrdenesCompra();
    res.status(200).json(ordenesCompra);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = ordenCompraRouter;
