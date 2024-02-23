const mongoose = require("mongoose");

const ordenCompraSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true
  },
  
  productos: [
    {
      productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producto",
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
 
});

module.exports = mongoose.model("OrdenCompra", ordenCompraSchema);
