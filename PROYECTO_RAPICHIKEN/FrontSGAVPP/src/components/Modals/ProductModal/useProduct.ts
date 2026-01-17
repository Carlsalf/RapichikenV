import {Product} from "../../../types/Product";
import {api} from "../../../utils/api";

export const useProduct = (): { createProduct: (product: Product) => Promise<boolean>; editProduct: (product: Product) => Promise<boolean>; } => {
    const createProduct = async ({ tipoProducto, ...product }: Product): Promise<boolean> => {
        const { status } = await api.post('/productos', {
            data: {
                ...product,
                tipo_producto: tipoProducto,
                disponible: true,
            }
        });

        return status === 200;
    };

    const editProduct = async ({ tipoProducto, ...product }: Product): Promise<boolean> => {
        const { status } = await api.put(`/productos/${product.id}`, {
            data: {
                ...product,
                tipo_producto: tipoProducto,
            }
        });

        return status === 200;
    };

    return {
        createProduct,
        editProduct,
    };
};
