const Factura = require("./factura.model");
const OrdenCompra = require("../ordenCompra/ordenCompra.model");

async function generarFactura(ordenCompraId, nitConsumidor, correoElectronico) {
  try {
    // Obtener la orden de compra
    const ordenCompra = await OrdenCompra.findById(ordenCompraId);
    if (!ordenCompra) {
      throw new Error("No se encontró la orden de compra correspondiente");
    }

    // Crear una nueva factura basada en la orden de compra
    const nuevaFactura = new Factura({
      usuario: ordenCompra.usuario,
      productosOrdenCompra: ordenCompra.productos,
      totalOrdenCompra: ordenCompra.total,
      nitConsumidor: nitConsumidor,
      correoElectronico: correoElectronico
    });

    // Guardar la factura en la base de datos
    await nuevaFactura.save();

    return nuevaFactura; // Retornar la factura creada
  } catch (error) {
    throw new Error(`Error al generar la factura: ${error.message}`);
  }
}

module.exports = {
  generarFactura
};
