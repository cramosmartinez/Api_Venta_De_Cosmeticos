const express = require("express");
const productosRouter = express.Router();
const validarProducto = require("./productos.validate");
const log = require("../../../utils/logger");
const passport = require("passport");
const productoController = require("./productos.controller");
const jwtAuthhenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const { ProductoNoExiste, UsuarioNoEsDueño } = require("./productos.error");
const Venta = require("../ventasDeProducto/ventas.model");
const validarId = require("../../libs/middleware").validarId;

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
//venta
productosRouter.post(
  "/vender/:id",
  [jwtAuthhenticate, validarId],
  procesarErrores(async (req, res) => {
    const idProducto = req.params.id;
    const usuarioVendedor = req.user.username;
    const nombreComprador = req.body.nombreComprador;
    const cantidadAVender = req.body.cantidad || 1;

    try {
      const { productoAVender, nuevaVenta } =
        await productoController.realizarVenta(
          idProducto,
          usuarioVendedor,
          nombreComprador,
          cantidadAVender
        );
      log.info(
        `Venta realizada - Usuario: [${usuarioVendedor}], Producto: [${idProducto}], Comprador: [${nombreComprador}], Cantidad: [${cantidadAVender}]`
      );
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
    } catch (error) {
      log.error(
        `Error al realizar la venta - Usuario: [${usuarioVendedor}], Producto: [${idProducto}], Comprador: [${nombreComprador}], Cantidad: [${cantidadAVender}] - Error: ${error.message}`
      );
      throw error;
    }
  })
);

productosRouter.get(
  "/ventas",
  procesarErrores((req, res) => {
    return productoController
      .obtenerTodasLasVentas(req.params.id)
      .then((ventas) => {
        res.json(ventas);
      });
  })
);
module.exports = productosRouter;
