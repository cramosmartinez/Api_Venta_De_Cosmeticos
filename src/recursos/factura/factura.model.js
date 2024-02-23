const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true
  },
  nitConsumidor: {
    type: String,
    required: true
  },
  correoElectronico: {
    type: String,
    required: true
  },
  productosOrdenCompra: [
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
  totalOrdenCompra: {
    type: Number,
    required: true
  },
  
});

module.exports = mongoose.model("Factura", facturaSchema);
