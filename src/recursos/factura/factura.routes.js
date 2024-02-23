const express = require("express");
const facturaRouter = express.Router();
const facturaController = require("./factura.controller");

facturaRouter.post("/generar", async (req, res) => {
  try {
    const { ordenCompraId, nitConsumidor, correoElectronico } = req.body;
    const factura = await facturaController.generarFactura(ordenCompraId, nitConsumidor, correoElectronico);
    res.status(200).json({ factura });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = facturaRouter;
