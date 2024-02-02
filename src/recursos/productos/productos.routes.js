const express = require("express");
const productosRouter = express.Router();
const validarProducto = require("./productos.validate");
const log = require("../../../utils/logger");
const passport = require("passport");
const productoController = require("./productos.controller");
const jwtAuthhenticate = passport.authenticate("jwt", { session: false });
const procesarErrores = require("../../libs/errorHandler").procesarErrores;
const { ProductoNoExiste, UsuarioNoEsDueño } = require("./productos.error");
const validarId = require("../../libs/middleware").validarId;
const CategoriaProducto = require("../categorias/categorias.model");
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
  procesarErrores(async (req, res) => {
    const { nombre, precio, moneda, stock, categoria } = req.body;

    // Verificar si la categoría existe
    const categoriaExistente = await CategoriaProducto.findOne({
      nombre: categoria,
    });

    if (!categoriaExistente) {
      return res
        .status(400)
        .json({ error: "La categoría especificada no existe." });
    }

    // Crear el producto solo si la categoría existe
    const producto = await productoController.crearProducto(
      { nombre, precio, moneda, stock },
      req.user.username,
      categoria
    );

    log.info("Producto agregado a la colección productos", producto);
    res.status(201).json(producto);
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
// Lista productos por una categoría
productosRouter.get(
  "/categoria/:categoria",
  procesarErrores((req, res) => {
    let categoria = req.params.categoria;
    log.info(`Buscando productos en la categoría: ${categoria}`);
    return productoController
      .obtenerProductosPorCategoria(categoria)
      .then((productos) => {
        log.info(
          `Productos encontrados en la categoría '${categoria}':`,
          productos
        );
        res.json(productos);
      })
      .catch((error) => {
        log.error(
          `Error al buscar productos en la categoría '${categoria}':`,
          error
        );
        throw error;
      });
  })
);

// Listar productos por usuario específico
productosRouter.get(
  "/usuario/:usuario",
  procesarErrores((req, res) => {
    const usuarioEspecifico = req.params.usuario;
    log.info(`Buscando productos del usuario: ${usuarioEspecifico}`);
    return productoController
      .obtenerProductosPorUsuario(usuarioEspecifico)
      .then((productos) => {
        log.info(
          `Productos encontrados del usuario '${usuarioEspecifico}':`,
          productos
        );
        res.json(productos);
      })
      .catch((error) => {
        log.error(
          `Error al buscar productos del usuario '${usuarioEspecifico}':`,
          error
        );
        throw error;
      });
  })
);

module.exports = productosRouter;
