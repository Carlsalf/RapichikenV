import {useEffect, useState} from "react";
import {Product} from "../../types/Product";
import {api} from "../../utils/api";

export const useProducts = (): { products: Product[], getProducts: () => void; removeProduct: (productId: string) => void;  enabledProduct: (productId: string) => void; } => {
  const [products, setProducts] = useState<Product[]>([]);

  const getProducts = async () => {
      const response = await api.get('/productos');

      const productsMapping = response.data.data.map((product: any) => {
          const { attributes } = product;

          return {
              ...attributes,
              id: product.id,
              tipoProducto: attributes.tipo_producto,
          }
      });

      setProducts(productsMapping);
  };

  const removeProduct = async (productId: string) => {
    await api.put(`/productos/${productId}`, {
        data: {
            disponible: false,
        }
    });

    await getProducts();
  };

    const enabledProduct = async (productId: string) => {
        await api.put(`/productos/${productId}`, {
            data: {
                disponible: true,
            }
        });

        await getProducts();
    };

  useEffect(() => {
      console.log('get products');
    getProducts();
  }, []);

  return {
      products,
      getProducts,
      removeProduct,
      enabledProduct,
  }
};
