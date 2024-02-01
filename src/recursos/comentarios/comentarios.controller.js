const Comentario = require("./comentarios.model");
const Producto = require("../productos/productos.model");

async function agregarComentario(idProducto, usuario, comentario) {
  try {
    const producto = await Producto.findById(idProducto);

    if (!producto) {
      throw new Error(`El producto con ID [${idProducto}] no existe.`);
    }

    producto.comentarios.push({
      usuario,
      comentario,
    });

    await producto.save();

    return producto.comentarios;
  } catch (error) {
    throw error;
  }
}

async function obtenerComentarios(idProducto) {
  const producto = await Producto.findById(idProducto);

  if (!producto) {
    throw new Error(`El producto con ID [${idProducto}] no existe.`);
  }

  return producto.comentarios;
}


module.exports = {
  obtenerComentarios,
  agregarComentario,
};
