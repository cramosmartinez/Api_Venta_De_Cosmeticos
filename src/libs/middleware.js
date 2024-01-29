mongoose = require("mongoose");

exports.validarId = (req, res, next) => {
  const id = req.params.id;

  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send("El id no es valido");
    return;
  }
  next();
};

exports.noValidarId = (req, res, next) => {
  next();
};
