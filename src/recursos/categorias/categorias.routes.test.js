/*const request = require("supertest");
const app = require("../../../index").app;

describe("Categorías de Productos", () => {
  describe("POST /categorias", () => {
    it("Debería crear una nueva categoría de producto", async () => {
      const nuevaCategoria = { nombre: "Electrónicos" };
      const response = await request(app)
        .post("/categorias")
        .send(nuevaCategoria);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
      expect(response.body.nombre).toBe(nuevaCategoria.nombre);
    });
  });

  describe("GET /categorias", () => {
    it("Debería obtener todas las categorías de productos", async () => {
      const response = await request(app).get("/categorias");
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /categorias/:id", () => {
    it("Debería obtener una categoría de producto por su ID", async () => {
      // Primero creamos una categoría para obtener su ID
      const nuevaCategoria = { nombre: "Ropa" };
      const categoriaResponse = await request(app)
        .post("/categorias")
        .send(nuevaCategoria);

      const idCategoria = categoriaResponse.body._id;
      const response = await request(app).get(`/categorias/${idCategoria}`);
      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe(nuevaCategoria.nombre);
    });
  });
});
*/