'use strict';

/**
 * pedido controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::pedido.pedido', ({ strapi }) => ({
  async find(ctx) {
    const { data } = await super.find(ctx);
    console.log(data);
    const orders = await Promise.all(data.map(async ({ attributes, id }) => {
      const orderDetails = await strapi.entityService.findMany('api::pedido-detaille.pedido-detaille', {
        filters: {
          pedidoId: id,
        }
      });

      const detail = await Promise.all(orderDetails.map(async (order) => {
        const product = await strapi.entityService.findOne('api::catologo.catologo', order.catalogoId);
        return { ...order, product };
      }));

      return { ...attributes, id, detail };
    }));

    ctx.body = orders;
  },
}));
