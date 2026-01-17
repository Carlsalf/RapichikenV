export type Inventory = {
    id: string;
    productoId: string;
    stock: number;
    disponible: boolean;
    producto: {
        id: string;
        nombre: string;
    }
};
