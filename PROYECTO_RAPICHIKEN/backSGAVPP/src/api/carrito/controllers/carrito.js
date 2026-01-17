'use strict';

/**
 * carrito controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::carrito.carrito', ({strapi}) => ({
  async comprar(ctx) {
    const { total, products, user, orderType, metodoPago, status } = ctx.request.body.data;

    const productos = products.reduce((acc, producto) => {
      const prods = producto.productos.map(prod => ({ ...prod, cantidadComprar: producto.cantidad }));
      return [...acc, ...prods];
    }, []);

    const inventarios = await strapi.entityService.findMany('api::inventario.inventario', {
      fields: ['productoId', 'stock'],
    });

    const inventories = productos.map(producto => {
      const inventory = inventarios.find(inventory => Number(inventory.productoId) === producto.id);
      if (inventory) {
            return {
              inventoryId: inventory.id,
              qty: producto.cantidad,
              stock: Number(inventory.stock),
              cantidadComprar: producto.cantidadComprar,
            }
      }

      return null;
    });

    const inv = inventories.filter(inventory => inventory).reduce((acc, value) => {
      if (acc[value.inventoryId]) {
        acc[value.inventoryId] = {
          ...acc[value.inventoryId],
          qty: acc[value.inventoryId].qty + (value.qty * value.cantidadComprar),
        }
      } else {
        acc[value.inventoryId] = {
          qty: (value.qty * value.cantidadComprar),
          stock: value.stock,
        }
      }
      return acc;
    }, {});

    for (const inventoryId in inv) {
      await strapi.db.query('api::inventario.inventario').update({
        where: { id: inventoryId },
        data: {
          stock: inv[inventoryId].stock - inv[inventoryId].qty,
        },
      });
    }

    const orders = await strapi.entityService.findMany('api::pedido.pedido', {
      fields: ['numeroPedido'],
      filters: {
        numeroPedido: {
          $startsWith: `${orderType === 'virtual' ? 'V' : 'T'}`
        }
      },
      sort: { numeroPedido: 'desc' }
    });

    let lastOrderNumber = '';

    if (!orders.length) {
      lastOrderNumber = `${orderType === 'virtual' ? 'V' : 'T'}00001`;
    } else {
      const orderNumber = Number(orders[0].numeroPedido.substring(1)) + 1;
      lastOrderNumber = `${orderType === 'virtual' ? 'V' : 'T'}${String(orderNumber).padStart(5, '0')}`
    }


    const order = await strapi.entityService.create('api::pedido.pedido', {
      data: {
        tipoPedido: orderType,
        estado: status ?? 'creado',
        numeroPedido: lastOrderNumber,
        userId: user.id ? `${user.id}` : '',
        total,
        direccion: user.direccion ?? '',
        zona: user.zona ?? '',
        nombreCompleto: `${user.nombre} ${user.apellido}`,
        dni: user.dni,
        email: user.email ?? '',
        publishedAt: new Date(),
        date: new Date().toISOString(),
        metodoPago,
      }
    });

    for (const product of products) {
      await strapi.entityService.create('api::pedido-detaille.pedido-detaille', {
        data : {
          pedidoId: `${order.id}`,
          catalogoId: `${product.id}`,
          monto: product.precio,
          cantidad: product.cantidad,
          descuento: Number(product.descuento),
          publishedAt: new Date(),
        }
      });
    }

    return true;
  },
}));
