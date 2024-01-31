const express = require("express");
const bodyParser = require("body-parser");
const productosRouter = require("./src/recursos/productos/productos.routes");
const logger = require("./utils/logger");
const morgan = require("morgan");
const passport = require("passport");
const authJWT = require("./src/libs/auth");
const usuariosRouter = require("./src/recursos/usuarios/usuarios.routes");
const config = require("./config");
const mongoose = require("mongoose");
const errorHandler = require("./src/libs/errorHandler");
const comentariosRouter = require("./src/recursos/comentarios/comentarios.routes");
const ventasRouter = require("./src/recursos/ventasDeProducto/ventas.routes");

//autenticacion de constraseña y username
passport.use(authJWT);

//MongoDB => NoSql = > no hay tablas, si no colecciones de documentos
mongoose.connect("mongodb://127.0.0.1:27017/ApiVenta", {});

const app = express();
app.use(bodyParser.json());
app.use(
  morgan("short", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(passport.initialize());
//Rutas
app.use("/api/v1/productos", productosRouter);
app.use("/api/v1/usuarios", usuariosRouter);
app.use("/api/v1/comentarios", comentariosRouter);
app.use("/api/v1/ventas", ventasRouter);


app.use(errorHandler.procesarErroresDeDB);
if (config.ambiente === "prod") {
  app.use(errorHandler.erroresEnProduccion);
} else {
  app.use(errorHandler.erroresEnDesarrollo);
}

const server = app.listen(config.puerto, () => {
  logger.info("Escuchando el puerto 3000.");
});

module.exports = { app, server };
