const mongoose = require("mongoose");

const detalleVentaSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  precioUnitario: {
    type: Number,
    required: true,
  },
});

const ordenVentaSchema = new mongoose.Schema({
  vendedor: {
    type: String,
    required: true,
  },
  comprador: {
    nombre: {
      type: String,
      required: true,
    },
    nit: {
      type: String,
      required: true,
    },
  },
  detalles: [detalleVentaSchema],
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const OrdenVenta = mongoose.model("OrdenVenta", ordenVentaSchema);

module.exports = OrdenVenta;
