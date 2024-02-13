let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let request = require("supertest");
let mongoose = require("mongoose");

let config = require("../../../config");
let CategoriaProducto = require("../categorias/categorias.model");
let app = require("../../../index").app;
let server = require("../../../index").server;

describe("Categorias", () => {
  beforeEach(async () => {
    await CategoriaProducto.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    await mongoose.disconnect();
  });

  describe("Categorías de Productos", () => {
    describe("POST /cosmetics-management/v1/categorias", () => {
      it("Debería crear una nueva categoría de producto", async () => {
        const nuevaCategoria = { nombre: "Electrónicos" };
        const response = await request(app)
          .post("/cosmetics-management/v1/categorias")
          .send(nuevaCategoria);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.nombre).toBe(nuevaCategoria.nombre);
      });
    });

    describe("GET /cosmetics-management/v1/categorias", () => {
      it("Debería obtener todas las categorías de productos", async () => {
        // Crea algunas categorías de prueba antes de realizar la solicitud GET
        await crearCategoriasDePrueba();

        const response = await request(app).get(
          "/cosmetics-management/v1/categorias"
        );
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
      });
    });

    describe("GET /cosmetics-management/v1/categorias/:id", () => {
      it("Debería obtener una categoría de producto por su ID", async () => {
        // Primero creamos una categoría para obtener su ID
        const nuevaCategoria = { nombre: "Ropa" };
        const categoriaResponse = await request(app)
          .post("/cosmetics-management/v1/categorias")
          .send(nuevaCategoria);

        const idCategoria = categoriaResponse.body._id;
        const response = await request(app).get(
          `/cosmetics-management/v1/categorias/${idCategoria}`
        );
        expect(response.status).toBe(200);
        expect(response.body.nombre).toBe(nuevaCategoria.nombre);
      });
    });
  });
});

// Función para crear categorías de prueba
async function crearCategoriasDePrueba() {
  await CategoriaProducto.create([
    { nombre: "Categoría 1" },
    { nombre: "Categoría 2" },
    { nombre: "Categoría 3" },
  ]);
}
