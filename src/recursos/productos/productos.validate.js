const Joi = require("joi");
const log = require("../../../utils/logger");

const blueprintProducto = Joi.object({
  nombre: Joi.string().max(100).required(),
  precio: Joi.number().positive().precision(2).required(),
  moneda: Joi.string().length(3).uppercase(),
  stock: Joi.number().integer().min(0).default(0),
  categoria: Joi.string().required(),  // Nueva línea para validar la categoría
});

module.exports = (req, res, next) => {
  let resultado = blueprintProducto.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (!resultado.error) {
    next();
  } else {
    let errorDeValidacion = resultado.error.details.reduce((acc, error) => {
      return acc + `[${error.message}]`;
    }, "");
    log.warn(
      "El producto en el body no cumple con el formato requerido. Detalles: " +
        errorDeValidacion
    );
    res
      .status(400)
      .send(
        "El producto en el body debe especificar nombre, precio y moneda. Detalles: " +
          errorDeValidacion
      );
  }
};
