// comentarios.routes.js
const express = require("express");
const comentariosRouter = express.Router();
const validarId = require("../../libs/middleware").validarId;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const jwtAuthhenticate = require("passport").authenticate("jwt", {
  session: false,
});
const comentariosController = require("./comentarios.controller");

comentariosRouter.post(
  "/:idProducto",
  [jwtAuthhenticate, validarId],
  procesarErrores(async (req, res) => {
    const idProducto = req.params.idProducto;
    const usuario = req.user.username;
    const comentario = req.body.comentario;

    const comentarios = await comentariosController.agregarComentario(
      idProducto,
      usuario,
      comentario
    );

    res.json(comentarios);
  })
);

comentariosRouter.get(
  "/:idProducto",
  validarId,
  procesarErrores(async (req, res) => {
    const idProducto = req.params.idProducto;

    const comentarios = await comentariosController.obtenerComentarios(idProducto);

    res.json(comentarios);
  })
);

module.exports = comentariosRouter;
