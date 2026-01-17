export type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  tipoProducto: string;
  unidad: string;
  piezas?: number;
  disponible: boolean;
};
