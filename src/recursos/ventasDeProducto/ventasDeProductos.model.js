const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  vendedor: {
    type: String,
    required: true,
  },
  comprador: {
    type: String,
  },
  cantidad: {
    type: Number,
    required: true,
  },
});

const Venta = mongoose.model("Venta", ventaSchema);

module.exports = Venta;
