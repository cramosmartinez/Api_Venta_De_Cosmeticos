const express = require("express");
const categoriasRouter = express.Router();
const categoriasController = require("./categorias.controller");

// Crear una nueva categoría de producto
categoriasRouter.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    const categoria = await categoriasController.crearCategoriaProducto(nombre);
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las categorías de productos
categoriasRouter.get("/", async (req, res) => {
  try {
    const categorias = await categoriasController.obtenerCategoriasProductos();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una categoría por su ID
categoriasRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await categoriasController.obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada." });
    }

    res.json(categoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = categoriasRouter;
