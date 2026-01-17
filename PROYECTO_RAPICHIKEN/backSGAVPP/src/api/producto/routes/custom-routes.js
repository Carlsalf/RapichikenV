"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/productos/options",
      handler: "producto.getProductOptions",
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ]
}
