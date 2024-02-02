class UsuarioNoEsDueño extends Error {
  constructor(message) {
    super(message);
    this.name = "UsuarioNoEsDueño";
  }
}

class ProductoNoExiste extends Error {
  constructor(message) {
    super(message);
    this.name = "ProductoNoExiste";
  }
}

module.exports = {
  UsuarioNoEsDueño,
  ProductoNoExiste,
};
