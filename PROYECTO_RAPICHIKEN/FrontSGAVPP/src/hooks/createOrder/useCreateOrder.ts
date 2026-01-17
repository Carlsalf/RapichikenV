import {Cart} from "../../types/Cart";
import {api} from "../../utils/api";

export const useCreateOrder = () => {
    const buy = async (cart: Cart, user: any, metodoPago: string) => {
        const { data } = await api.post('/carrito/comprar', {
            data: { ...cart, user: { ...user, zona: 'Tienda', email: 'tienda@rapichicken.com' }, orderType: 'tienda', metodoPago, status: 'entregado' }
        }).catch(({ response }) => {
            return response;
        });

        return !(data.error && data.error.status === 400);
    };

    return {
        buy
    };
};
