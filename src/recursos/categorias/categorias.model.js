const mongoose = require("mongoose");

const categoriaProductoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategoriaProducto = mongoose.model("CategoriaProducto", categoriaProductoSchema);

module.exports = CategoriaProducto;