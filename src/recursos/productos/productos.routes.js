const express = require("express");
const productosRouter = express.Router();
const validarProducto = require("./productos.validate");
const log = require("../../../utils/logger");
const passport = require("passport");
const productoController = require("./productos.controller");
const jwtAuthhenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const { ProductoNoExiste, UsuarioNoEsDueño } = require("./productos.error");
const Venta = require("../ventasDeProducto/ventasDeProductos.model");

function validarId(req, res, next) {
  let id = req.params.id;
  if (id.match(/^[a-fA-F0-9]{24}$/) === null) {
    res.status(400).send("El id no es valido");
    return;
  }
  next();
}

//Listar

productosRouter.get(
  "/",
  procesarErrores((req, res) => {
    return productoController.obtenerProductos().then((productos) => {
      res.json(productos);
    });
  })
);
//localhost:3000/productos
//crear
productosRouter.post(
  "/",
  [jwtAuthhenticate, validarProducto],
  procesarErrores((req, res) => {
    return productoController
      .crearProducto(req.body, req.user.username)
      .then((producto) => {
        log.info("Producto agregado a la colección productos", producto);
        res.status(201).json(producto);
      });
  })
);

productosRouter.get(
  "/:id",
  validarId,
  procesarErrores((req, res) => {
    let id = req.params.id;
    return productoController.obtenerProducto(id).then((producto) => {
      if (!producto)
        throw new ProductoNoExiste(`Producto con id [${id}] no existe.`);
      res.json(producto);
    });
  })
);

//actualizar
productosRouter.put(
  "/:id",
  [jwtAuthhenticate, validarProducto],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let requestUsuario = req.user.username;
    let productoAReemplazar;

    productoAReemplazar = await productoController.obtenerProducto(id);

    if (!productoAReemplazar)
      throw new ProductoNoExiste(`El producto con id [${id}] no existe.`);

    if (productoAReemplazar.dueño !== requestUsuario) {
      log.warn(
        `Usuario [${requestUsuario}] no es dueño de producto con id [${id}]. Dueño real es [${productoAReemplazar.dueño}]. Request no será procesado`
      );
      throw new UsuarioNoEsDueño(
        `No eres dueño del producto con id [${id}]. Solo puedes modificar productos creados por ti.`
      );
    }

    productoController
      .remplazarProducto(id, req.body, requestUsuario)
      .then((producto) => {
        res.json(producto);
        log.info(
          `Producto con id [${id}] reemplazado con nuevo producto`,
          producto
        );
      });
  })
);
//borrar
productosRouter.delete(
  "/:id",
  [jwtAuthhenticate, validarId],
  procesarErrores(async (req, res) => {
    let id = req.params.id;
    let productoABorrar;

    productoABorrar = await productoController.obtenerProducto(id);

    if (!productoABorrar) {
      log.info(`Producto con id [${id}] no existe. Nada que borrar`);
      throw new ProductoNoExiste(
        `Producto con id [${id}] no existe. Nada que borrar.`
      );
    }

    let usuarioAutenticado = req.user.username;
    if (productoABorrar.dueño !== usuarioAutenticado) {
      log.info(
        `Usuario [${usuarioAutenticado}] no es dueño de producto con id [${id}]. Dueño real es [${productoABorrar.dueño}]. Request no será procesado`
      );
      throw new UsuarioNoEsDueño(
        `No eres dueño del producto con id [${id}]. Solo puedes borrar productos creados por ti.`
      );
    }

    let productoBorrado = await productoController.borrarProducto(id);
    log.info(`Producto con id [${id}] fue borrado`);
    res.json(productoBorrado);
  })
);

productosRouter.post(
  "/vender/:id",
  [jwtAuthhenticate, validarId],
  procesarErrores(async (req, res) => {
    const idProducto = req.params.id;
    const usuarioVendedor = req.user.username;
    const nombreComprador = req.body.nombreComprador;
    const cantidadAVender = req.body.cantidad || 1;

    // Obtener el producto que se va a vender
    const productoAVender = await productoController.obtenerProducto(
      idProducto
    );

    if (!productoAVender) {
      throw new ProductoNoExiste(
        `El producto con id [${idProducto}] no existe.`
      );
    }

    // Verificar que el usuario sea el dueño del producto
    if (productoAVender.dueño !== usuarioVendedor) {
      throw new UsuarioNoEsDueño(
        `No eres dueño del producto con id [${idProducto}]. Solo puedes vender productos creados por ti.`
      );
    }

    // Verificar si hay suficiente stock
    if (productoAVender.stock < cantidadAVender) {
      throw new Error(
        `No hay suficiente stock disponible para vender ${cantidadAVender} unidades.`
      );
    }

    // Actualizar el stock del producto
    productoAVender.stock -= cantidadAVender;
    await productoAVender.save();

    // Registrar la venta
    const nuevaVenta = new Venta({
      producto: productoAVender._id,
      vendedor: usuarioVendedor,
      comprador: nombreComprador,
      cantidad: cantidadAVender,
    });

    await nuevaVenta.save();

    // Responder con el resultado de la venta
    res.json({
      mensaje: "Venta realizada con éxito",
      venta: {
        producto: productoAVender,
        fecha: nuevaVenta.fecha,
        vendedor: usuarioVendedor,
        comprador: nombreComprador,
        cantidad: cantidadAVender,
      },
    });
  })
);

// En productos.routes.js
productosRouter.get(
  "/ventas",
  jwtAuthhenticate,
  procesarErrores(async (req, res) => {
    const usuario = req.user.username;

    // Obtener todas las ventas del usuario (puedes ajustar según tus necesidades)
    const ventas = await Venta.find({ vendedor: usuario });

    res.json({ ventas });
  })
);

module.exports = productosRouter;
