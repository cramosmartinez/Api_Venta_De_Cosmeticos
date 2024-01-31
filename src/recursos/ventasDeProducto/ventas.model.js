const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  moneda: {
    type: String,
    required: true,
  },
  dueño: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  comentarios: [
    {
      usuario: {
        type: String,
        required: true,
      },
      comentario: {
        type: String,
        required: true,
      },
      fecha: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  __v: {
    type: Number,
    select: false,
  },
});


const Venta = mongoose.model("Venta", ventaSchema);

module.exports = Venta;
