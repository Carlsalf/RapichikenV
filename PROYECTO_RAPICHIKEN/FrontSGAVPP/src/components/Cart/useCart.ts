import {Cart as CartType, Cart} from "../../types/Cart";
import {api} from "../../utils/api";
import {useEffect, useMemo, useState} from "react";
import axios from 'axios';
import {Catalog} from "../../types/Catalog";

export const useCart = () => {
    const [cart, setCart] = useState<CartType | null>(null);

    const [total, discount] = useMemo<number[]>(() => {
        if (cart) {
            const total = cart.products.reduce((acc, product) => acc + product.cantidad * (product.precio - product.descuento), 0);
            const discount = cart.products.reduce((acc, product) => acc + product.cantidad * product.descuento, 0);
            return [total, discount];
        }

        return [0, 0];
    }, [cart]);

    const buy = async (cart: Cart, user: any,  token: any) => {
        const { data } = await api.post('/carrito/comprar', {
            data: { ...cart, user, orderType: 'virtual', metodoPago: 'online' }
        }).catch(({ response }) => {
            return response;
        });

        if (data.error && data.error.status === 400) {
            return data.error.message;
        }

        if (data) {
            const { id } = token;

            const { data: culqiResponse } = await axios.post('https://api.culqi.com/v2/charges', {
                amount: (cart.total * 100),
                currency_code: 'PEN',
                email: user.email,
                source_id: id,
            }, {
                headers: {
                    'Authorization': 'Bearer sk_test_V1bcjWypx8H2BUFc'
                }
            });

            const { outcome: { type: response_code } } = culqiResponse || {};

            if (response_code === 'venta_exitosa') {
                return true;
            }
        }

        return false;
    };

    const addProductToCart = (catalog: Catalog) => {
        if (cart) {
            const productIds = cart.products.map(product => product.id);
            const indexProduct = productIds.indexOf(catalog.id);

            if (indexProduct > -1) {
                cart.products[indexProduct].cantidad = cart.products[indexProduct].cantidad +1;
            } else {
                cart.products.push({ ...catalog, cantidad: 1 });
            }

            const total = catalog.descuento > 0 ? (cart.total + (catalog.precio - catalog.descuento)) : (cart.total + catalog.precio);

            localStorage.setItem('cart', JSON.stringify({ ...cart, total }));
            setCart({ ...cart, total });
        } else {
            localStorage.setItem('cart', JSON.stringify({
                products: [{ ...catalog, cantidad: 1 }],
                total: catalog.descuento > 0 ? (catalog.precio - catalog.descuento) : catalog.precio,
            }));
            setCart({
                products: [{ ...catalog, cantidad: 1 }],
                total: catalog.descuento > 0 ? (catalog.precio - catalog.descuento) : catalog.precio,
            });
        }
    };

    useEffect(() => {
        const cartRaw = localStorage.getItem('cart');

        if (cartRaw) {
            const cart = JSON.parse(cartRaw) as CartType;
            setCart(cart);
        }
    }, []);

    return {
        buy,
        cart,
        total,
        discount,
        addProductToCart,
    };
};
