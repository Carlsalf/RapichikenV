import {Catalog} from "./Catalog";

export type CartProduct = Catalog & {
  cantidad: number;
};

export type Cart = {
    total: number;
    products: CartProduct[]
}
