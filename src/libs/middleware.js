mongoose = require("mongoose");
// middleware.js

exports.validarId = (req, res, next) => {
  const id = req.params.idProducto;

  try {
    if (!id || !id.match(/^[a-f\d]{24}$/i)) {
      throw new Error("El id no es válido");
    }
    next();
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

