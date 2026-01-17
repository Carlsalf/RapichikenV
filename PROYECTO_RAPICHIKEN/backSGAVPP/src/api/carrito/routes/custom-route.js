"use strict";

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/carrito/comprar",
      handler: "carrito.comprar",
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
}
