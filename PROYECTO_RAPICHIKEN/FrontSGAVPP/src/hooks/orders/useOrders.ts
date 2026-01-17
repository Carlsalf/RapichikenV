import {useEffect, useState} from "react";
import {api} from "../../utils/api";
import {Order} from "../../types/Order";

export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);


    const getOrders = async (params: string = '') => {
        const { data } = await api.get(`/pedidos${params ? `?${params}` : ''}`);

        setOrders(data);
    };

    const updateStatus = async (id: number, orderStatus: any) => {
        const { status } = await api.put(`/pedidos/${id}`, {
            data: {
                estado: orderStatus,
            }
        });

        if (status === 200) {
            await getOrders();
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    return {
        orders,
        updateStatus,
        getOrders,
    };
};
