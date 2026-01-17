import {useEffect, useState} from "react";
import {api} from "../../utils/api";
import {Inventory} from "../../types/Inventario";

export const useInventory = () => {
    const [products, setProducts] = useState<{ id:string; nombre: string; }[]>([]);
    const [inventories, setInventories] = useState<Inventory[]>([]);

    const getProducts = async () => {
      const { data } = await api.get('/productos/options');

      setProducts(data);
    };

    const getInventories = async () => {
        const { data } = await api.get('/inventarios');

        setInventories(data);
    };

    const createInventory = async (inventory: Inventory) => {
        await api.post('/inventarios', {
            data: inventory
        });

        await getInventories();
    };

    const removeInventory = async (inventoryId: string) => {
        await api.put(`/inventarios/${inventoryId}`, {
            data: {
                disponible: false,
            }
        });

        await getInventories();
    };

    const updateInventory = async (inventory: Omit<Inventory, 'producto'>) => {
        await api.put(`/inventarios/${inventory.id}`, {
            data: {
                stock: inventory.stock,
                disponible: inventory.disponible,
            }
        });

        await getInventories();
    };

    useEffect(() => {
        getInventories();
    }, []);

    return {
      products,
        inventories,
        createInventory,
        getProducts,
        removeInventory,
        updateInventory
    };
};
