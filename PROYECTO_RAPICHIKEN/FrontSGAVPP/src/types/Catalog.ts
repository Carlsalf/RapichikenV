export type ProductCatalog = {
    id: string;
    cantidad: number;
    isPieces: boolean;
};

export type Catalog = {
  id: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  descuento: number;
  precio: number;
  productos: ProductCatalog[]
};
