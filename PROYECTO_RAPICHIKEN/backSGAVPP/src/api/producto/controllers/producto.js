'use strict';

/**
 * producto controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::producto.producto', ({ strapi }) => ({
  async getProductOptions (ctx) {
    try {
      const products = await strapi.entityService.findMany('api::producto.producto', {
        fields: ['nombre'],
      });

      const inventories = await strapi.entityService.findMany('api::inventario.inventario', {
        fields: ['productoId'],
      });

      const productIds = inventories.map(({ productoId }) => productoId);
      const options = [];

      for (let product of products) {
        if (!productIds.includes(`${product.id}`)) {
          options.push(product);
        }
      }

      ctx.body = options;
    } catch (e) {
      ctx.body = e;
    }
  },
}));
