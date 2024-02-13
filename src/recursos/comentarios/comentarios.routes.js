const express = require("express");
const comentariosRouter = express.Router();
const validarId = require("../../libs/middleware").validarId;
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const jwtAuthhenticate = require("passport").authenticate("jwt", {
  session: false,
});
const comentariosController = require("./comentarios.controller");
const log = require("../../../utils/logger");


comentariosRouter.post(
  "/:idProducto",
  [jwtAuthhenticate, validarId],
  procesarErrores(async (req, res) => {
    try {
      const idProducto = req.params.idProducto;
      const usuario = req.user.username;
      const comentario = req.body.comentario;

      log.info(
        `Intentando agregar comentario para el producto con ID: ${idProducto}`
      );
      log.info(`Usuario: ${usuario}, Comentario: ${comentario}`);

      const comentarios = await comentariosController.agregarComentario(
        idProducto,
        usuario,
        comentario
      );

      log.info("Comentario agregado con éxito:", comentarios);
      res.json(comentarios);
    } catch (error) {
      log.error("Error al agregar comentario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })
);

comentariosRouter.get(
  "/:idProducto",
  [validarId],
  procesarErrores(async (req, res) => {
    try {
      const idProducto = req.params.idProducto;

      log.info(
        `Intentando obtener comentarios para el producto con ID: ${idProducto}`
      );

      const comentarios = await comentariosController.obtenerComentarios(
        idProducto
      );

      log.info("Comentarios obtenidos:", comentarios);
      res.json(comentarios);
    } catch (error) {
      log.error("Error al obtener comentarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })
);

module.exports = comentariosRouter;
