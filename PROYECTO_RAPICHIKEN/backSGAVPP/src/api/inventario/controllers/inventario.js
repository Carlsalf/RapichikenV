'use strict';

/**
 * inventario controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::inventario.inventario', ({ strapi }) => ({
  async find(ctx) {
    const { data } = await super.find(ctx);

    const inventories = await Promise.all(data.map(async ({ attributes, id }) => {
      const product = await strapi.entityService.findOne('api::producto.producto', attributes.productoId, {
        fields: ['nombre'],
      });

      return { ...attributes, id, producto: product };
    }));

    ctx.body = inventories;
  },
}));
