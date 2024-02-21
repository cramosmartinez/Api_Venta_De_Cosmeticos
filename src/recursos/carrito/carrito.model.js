const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
  },
  productos: [
    {
      productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },
      cantidad: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("Carrito", carritoSchema);
