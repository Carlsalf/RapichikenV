import {useEffect, useState} from "react";
import qs from 'qs';
import {api} from "../../../utils/api";

export const useSelectProduct = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const query = qs.stringify({
            fields: ['nombre', 'descripcion', 'tipo_producto', 'unidad', 'piezas'],
            filters: {
                disponible: true
            }
        }, {
            encodeValuesOnly: true,
        });

        const { data: { data: dataRaw } } = await api.get(`/productos?${query}`);

        const productsMapping = dataRaw.map(({attributes, id}: { id: number; attributes: any }) => ({ ...attributes, id }));

        setProducts(productsMapping);
    };

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
    };
};
