const express = require("express");
const facturaRouter = express.Router();
const facturaController = require("./factura.controller");
const log = require("../../../utils/logger");

facturaRouter.post("/generar", async (req, res) => {
  try {
    const { ordenCompraId, nitConsumidor, correoElectronico } = req.body;
    log.info(`Intentando generar factura para la orden de compra ID: ${ordenCompraId}, NIT del consumidor: ${nitConsumidor}, Correo electrónico: ${correoElectronico}`);
    const factura = await facturaController.generarFactura(ordenCompraId, nitConsumidor, correoElectronico);
    log.info("Factura generada con éxito:", factura);
    res.status(200).json({ factura });
  } catch (error) {
    log.error("Error al generar factura:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = facturaRouter;
