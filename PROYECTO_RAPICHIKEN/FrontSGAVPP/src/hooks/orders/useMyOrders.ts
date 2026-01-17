import {useEffect, useState} from "react";
import {api} from "../../utils/api";
import qs from "qs";
import {Order} from "../../types/Order";

export const useMyOrders = (userId: number | undefined) => {
    const [orders, setOrders] = useState<Order[]>([]);


    const getOrders = async () => {
        const query = qs.stringify({
            filters: {
                userId
            },
        }, {
            encodeValuesOnly: true,
        });

        const { data } = await api.get(`/pedidos?${query}`);

        setOrders(data);
    };

    useEffect(() => {
        if (userId) {
            getOrders();
        }
    }, [userId]);

    return {
        orders
    };
};
