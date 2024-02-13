let request = require("supertest");
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

let config = require("../../../config");
let Producto = require("../productos/productos.model");
let Comentario = require("../comentarios/comentarios.model");
let app = require("../../../index").app;
let server = require("../../../index").server;

describe("Comentarios", () => {
  let authToken;

  beforeAll(async () => {
    // Crea un token de autenticación para simular la autenticación del usuario
    authToken = jwt.sign({ username: "usuario_prueba" }, config.jwtSecret);
  });

  beforeEach(async () => {
    // Limpia la base de datos antes de cada prueba
    await Producto.deleteMany({});
    await Comentario.deleteMany({});
  });

  afterAll(async () => {
    // Cierra el servidor y la conexión con la base de datos al finalizar todas las pruebas
    server.close();
    await mongoose.disconnect();
  });

  describe("POST /cosmetics-management/v1/comentarios/:idProducto", () => {
    it("Debería agregar un nuevo comentario a un producto existente", async () => {
      // Crea un producto de prueba
      const producto = await Producto.create({
        nombre: "Producto de prueba",
        descripcion: "Descripción del producto de prueba",
        precio: 100,
        stock: 10,
      });

      const idProducto = producto._id;

      const nuevoComentario = {
        comentario: "Este es un comentario de prueba",
      };

      // Realiza la solicitud POST para agregar un comentario al producto
      const response = await request(app)
        .post(`/cosmetics-management/v1/comentarios/${idProducto}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(nuevoComentario);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("usuario", "usuario_prueba");
      expect(response.body[0]).toHaveProperty(
        "comentario",
        nuevoComentario.comentario
      );
    });

    it("Debería devolver un error 500 si ocurre un error al agregar el comentario", async () => {
      // Simula un error al agregar el comentario
      const mockError = new Error("Error simulado al agregar comentario");
      jest.spyOn(Comentario, "create").mockRejectedValueOnce(mockError);

      const producto = await Producto.create({
        nombre: "Producto de prueba",
        descripcion: "Descripción del producto de prueba",
        precio: 100,
        stock: 10,
      });

      const idProducto = producto._id;

      const nuevoComentario = {
        comentario: "Este es un comentario de prueba",
      };

      // Realiza la solicitud POST para agregar un comentario al producto
      const response = await request(app)
        .post(`/cosmetics-management/v1/comentarios/${idProducto}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(nuevoComentario);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("GET /cosmetics-management/v1/comentarios/:idProducto", () => {
    it("Debería obtener todos los comentarios de un producto existente", async () => {
      // Crea un producto de prueba
      const producto = await Producto.create({
        nombre: "Producto de prueba",
        descripcion: "Descripción del producto de prueba",
        precio: 100,
        stock: 10,
      });

      const idProducto = producto._id;

      // Agrega algunos comentarios al producto
      await Comentario.create([
        {
          usuario: "usuario1",
          comentario: "Comentario 1",
          producto: idProducto,
        },
        {
          usuario: "usuario2",
          comentario: "Comentario 2",
          producto: idProducto,
        },
      ]);

      // Realiza la solicitud GET para obtener los comentarios del producto
      const response = await request(app).get(
        `/cosmetics-management/v1/comentarios/${idProducto}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty("usuario", "usuario1");
      expect(response.body[0]).toHaveProperty("comentario", "Comentario 1");
      expect(response.body[1]).toHaveProperty("usuario", "usuario2");
      expect(response.body[1]).toHaveProperty("comentario", "Comentario 2");
    });

    it("Debería devolver un error 500 si ocurre un error al obtener los comentarios", async () => {
      // Simula un error al obtener los comentarios
      const mockError = new Error("Error simulado al obtener comentarios");
      jest.spyOn(Comentario, "find").mockRejectedValueOnce(mockError);

      // Crea un producto de prueba
      const producto = await Producto.create({
        nombre: "Producto de prueba",
        descripcion: "Descripción del producto de prueba",
        precio: 100,
        stock: 10,
      });

      const idProducto = producto._id;

      // Realiza la solicitud GET para obtener los comentarios del producto
      const response = await request(app).get(
        `/cosmetics-management/v1/comentarios/${idProducto}`
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("Debería devolver un error 404 si el producto no existe", async () => {
      // Define un ID de producto inexistente
      const idProductoInexistente = "123456789012";

      // Realiza la solicitud GET para obtener los comentarios de un producto inexistente
      const response = await request(app).get(
        `/cosmetics-management/v1/comentarios/${idProductoInexistente}`
      );

      expect(response.status).toBe;
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "El producto con ID [123456789012] no existe.",
      });
    });
  });
});
