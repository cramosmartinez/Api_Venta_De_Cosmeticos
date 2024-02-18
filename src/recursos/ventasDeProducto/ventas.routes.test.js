const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../../../index");
const ventasController = require("./ventas.controller");
const OrdenVenta = require("../ventasDeProducto/ventas.model");

describe("Ventas", () => {
  beforeEach(async () => {
    await OrdenVenta.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    await mongoose.disconnect();
  });

  describe("GET /cosmetics-management/v1/ventas/", () => {
    it("Debería obtener todas las ordenes de venta", async () => {
      // Agregar algunas ordenes de venta de prueba antes de realizar la solicitud GET
      await ventasController.obtenerTodasLasOrdenesVenta();

      const response = await request(app).get("/ventas");
      expect(response.status).toBe(404);
      expect(response.body.length);
    });
  });
});
