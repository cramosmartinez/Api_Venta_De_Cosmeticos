const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({
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
});

const Comentario = mongoose.model("Comentario", comentarioSchema);

module.exports = Comentario;
