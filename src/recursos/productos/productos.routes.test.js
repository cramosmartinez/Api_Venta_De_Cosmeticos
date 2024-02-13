let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let request = require("supertest");
let mongoose = require("mongoose");

let config = require("../../../config");
let Producto = require("./productos.model");
let Usuario = require("../usuarios/usuarios.model");
let CategoriaProducto = require("../categorias/categorias.model");
let app = require("../../../index").app;
let server = require("../../../index").server;

let productoYaEnBaseDeDatos = {
  nombre: "Macbook Pro 13 Inches",
  precio: 1300,
  moneda: "USD",
  dueño: "daniel",
  stock: 10,
  categoria: "Cafe",
};

let nuevoProducto = {
  nombre: "Cuerda Mammut 60 metros",
  precio: 200,
  moneda: "USD",
  stock: 5,
  categoria: "Deportes",
};

let idInexistente = "5ab8dbcc6539f91c2288b0c1";

let testUsuario = {
  username: "daniel",
  email: "daniel@gmail.com",
  password: "holaquetal",
};

let authToken;
let tokenInvalido =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYmEzMjJiZGQ2NTRhN2RiZmNjNGUzMCIsImlhdCI6MTUyMjE1MTk3OSwiZXhwIjoxNTIyMjM4Mzc5fQ.AAtAAAAkYuAAAy9O-AA0sAkcAAAAqfXskJZxhGJuTIk";

beforeAll(async () => {
  await Usuario.deleteMany({});
  const response = await request(app)
    .post("/cosmetics-management/v1/usuarios")
    .send(testUsuario);
  expect(response.status).toBe(201);
  const loginResponse = await request(app)
    .post("/cosmetics-management/v1/usuarios/login")
    .send({
      username: testUsuario.username,
      password: testUsuario.password,
    });
  expect(loginResponse.status).toBe(200);
  authToken = loginResponse.body.token;
});

describe("Productos", () => {
  beforeEach(async () => {
    await Producto.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    await mongoose.disconnect();
  });

  describe("GET /cosmetics-management/v1/productos/:id", () => {
    it("Tratar de obtener un producto con un id inválido debería retornar 400", async () => {
      const response = await request(app).get(
        "/cosmetics-management/v1/productos/123"
      );
      expect(response.status).toBe(400);
    });

    it("Tratar de obtener un producto que no existe debería retornar 404", async () => {
      const response = await request(app).get(
        `/cosmetics-management/v1/productos/${idInexistente}`
      );
      expect(response.status).toBe(404);
    });

    it("Debería retornar un producto que sí existe exitósamente", async () => {
      const producto = await Producto(productoYaEnBaseDeDatos).save();
      const response = await request(app).get(
        `/cosmetics-management/v1/productos/${producto._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.nombre).toEqual(producto.nombre);
      expect(response.body.precio).toEqual(producto.precio);
      expect(response.body.moneda).toEqual(producto.moneda);
      expect(response.body.dueño).toEqual(producto.dueño);
      expect(response.body.stock).toEqual(producto.stock);
      expect(response.body.categoria).toEqual(producto.categoria);
    });
  });

  describe("POST /cosmetics-management/v1/productos", () => {
    // Test para la función crearProducto
    /*it("Si el usuario provee un token válido, el producto es válido y la categoría existe, debería ser creado", async () => {
      const response = await request(app)
        .post("/cosmetics-management/v1/productos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          ...nuevoProducto,
          stock: 10,
          categoria: "Electrónicos", // Pasar la nueva categoría
        });
      expect(response.status).toBe(400);
      expect(response.body.nombre).toEqual(nuevoProducto.nombre);
      expect(response.body.moneda).toEqual(nuevoProducto.moneda);
      expect(response.body.precio).toEqual(nuevoProducto.precio);
      expect(response.body.dueño).toEqual(testUsuario.username);
      expect(response.body.stock).toEqual(10); // Verificar el stock
      expect(response.body.categoria).toEqual("Electrónicos");
    });
    */
    it("Si el usuario no provee un token de autenticación válido, debería retornar 401", async () => {
      const response = await request(app)
        .post("/cosmetics-management/v1/productos")
        .set("Authorization", `Bearer ${tokenInvalido}`)
        .send(nuevoProducto);
      expect(response.status).toBe(401);
    });

    it("Si al producto le falta el título, no debería ser creado", async () => {
      const response = await request(app)
        .post("/cosmetics-management/v1/productos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          moneda: nuevoProducto.moneda,
          precio: nuevoProducto.precio,
          stock: nuevoProducto.stock,
          categoria: nuevoProducto.categoria,
        });
      expect(response.status).toBe(400);
    });

    it("Si al producto le falta el precio, no debería ser creado", async () => {
      const response = await request(app)
        .post("/cosmetics-management/v1/productos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          nombre: nuevoProducto.nombre,
          moneda: nuevoProducto.moneda,
          stock: nuevoProducto.stock,
          categoria: nuevoProducto.categoria,
        });
      expect(response.status).toBe(400);
    });

    it("Si al producto le falta la moneda, no debería ser creado", async () => {
      const response = await request(app)
        .post("/cosmetics-management/v1/productos")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          nombre: nuevoProducto.nombre,
          precio: nuevoProducto.precio,
          stock: nuevoProducto.stock,
          categoria: nuevoProducto.categoria,
        });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /cosmetics-management/v1/productos/:id", () => {
    let idDeProductoExistente;

    beforeEach(async () => {
      await Producto.deleteMany({});
      const producto = await Producto(productoYaEnBaseDeDatos).save();
      idDeProductoExistente = producto._id;
    });

    it("Tratar de obtener un producto con un id inválido debería retornar 400", async () => {
      const response = await request(app)
        .delete("/cosmetics-management/v1/productos/123")
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(400);
    });

    it("Tratar de borrar un producto que no existe debería retornar 404", async () => {
      const response = await request(app)
        .delete(`/cosmetics-management/v1/productos/${idInexistente}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(404);
    });

    it("Si el usuario no provee un token de autenticación válido, debería retornar 401", async () => {
      const response = await request(app)
        .delete(`/cosmetics-management/v1/productos/${idDeProductoExistente}`)
        .set("Authorization", `Bearer ${tokenInvalido}`);
      expect(response.status).toBe(401);
    });

    /*it("Si el usuario no es el dueño del producto, debería retornar 401", async () => {
      const producto = await Producto({
        nombre: "Adidas Gazelle",
        precio: 90,
        moneda: "USD",
        dueño: "ricardo98",
      }).save();
      const response = await request(app)
        .delete(`/cosmetics-management/v1/productos/${producto._id}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(401);
    });*/

    it("Si el usuario no es el dueño del producto, debería retornar 401", async () => {
      const producto = await Producto({
        nombre: "Adidas Gazelle",
        precio: 90,
        moneda: "USD",
        dueño: "ricardo98",
        stock: 10,
        categoria: "Deportes",
      }).save();

      const response = await request(app)
        .delete(`/cosmetics-management/v1/productos/${producto._id}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(401);
      expect(response.text.includes("No eres dueño del producto con id")).toBe(
        true
      );
    });

    it("Si el usuario es dueño del producto y entrega un token valido, el producto debería ser borrado", async () => {
      const response = await request(app)
        .delete(`/cosmetics-management/v1/productos/${idDeProductoExistente}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body.nombre).toEqual(productoYaEnBaseDeDatos.nombre);
      expect(response.body.precio).toEqual(productoYaEnBaseDeDatos.precio);
      expect(response.body.moneda).toEqual(productoYaEnBaseDeDatos.moneda);
      expect(response.body.dueño).toEqual(productoYaEnBaseDeDatos.dueño);
      expect(response.body.stock).toEqual(productoYaEnBaseDeDatos.stock);

      const producto = await Producto.findById(idDeProductoExistente);
      expect(producto).toBeNull();
    });
  });
});
