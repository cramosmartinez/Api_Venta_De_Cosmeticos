const express = require("express");
const categoriasRouter = express.Router();
const categoriasController = require("./categorias.controller");
const log = require("../../../utils/logger");

// Crear una nueva categoría de producto
categoriasRouter.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    log.info(`Creando nueva categoría de producto: ${nombre}`);
    const categoria = await categoriasController.crearCategoriaProducto(nombre);
    log.info(`Categoría creada con éxito: ${categoria}`);
    res.status(201).json(categoria);
  } catch (error) {
    log.error(`Error al crear una nueva categoría: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las categorías de productos
categoriasRouter.get("/", async (req, res) => {
  try {
    log.info("Obteniendo todas las categorías de productos");
    const categorias = await categoriasController.obtenerCategoriasProductos();
    log.info("Categorías obtenidas con éxito");
    res.json(categorias);
  } catch (error) {
    log.error(`Error al obtener todas las categorías: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Obtener una categoría por su ID
categoriasRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    log.info(`Obteniendo categoría por ID: ${id}`);
    const categoria = await categoriasController.obtenerCategoriaPorId(id);

    if (!categoria) {
      log.warn(`Categoría con ID ${id} no encontrada`);
      return res.status(404).json({ error: "Categoría no encontrada." });
    }

    log.info(`Categoría obtenida con éxito: ${categoria}`);
    res.json(categoria);
  } catch (error) {
    log.error(`Error al obtener una categoría por ID: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = categoriasRouter;
