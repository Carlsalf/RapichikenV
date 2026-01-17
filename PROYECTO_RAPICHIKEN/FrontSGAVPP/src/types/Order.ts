import {Catalog} from "./Catalog";

export enum ORDER_STATUS {
    CREADO = 'creado',
    RECOGER = 'recogido',
    CAMINO = 'camino',
    LLEGUE = 'llegue',
    ENTREGADO = 'entregado',
    RECHAZADO = 'rechazado',
    NO_ENCONTRADO = 'no_encontrado',
}

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.CREADO]: 'Creado',
    [ORDER_STATUS.RECOGER]: 'Ya fue recogido',
    [ORDER_STATUS.CAMINO]: 'En camino',
    [ORDER_STATUS.LLEGUE]: 'El delivery llego al domicilio',
    [ORDER_STATUS.ENTREGADO]: 'Entregado',
    [ORDER_STATUS.RECHAZADO]: 'Rechazado',
    [ORDER_STATUS.NO_ENCONTRADO]: 'No se encontro el domicilio',
}

export type OrderDetail = {
    id: number;
    monto: number;
    cantidad: number;
    descuento: number;
    product: Catalog
};

export enum PAYMENT_METHODS {
  YAPE = 'yape',
  CASH = 'efectivo',
  POS = 'pos',
}

export type Order = {
    createdAt: Date;
    estado: ORDER_STATUS;
    numeroPedido: string;
    userId: string;
    total: number;
    direccion: string;
    zona: string;
    nombreCompleto: string;
    dni: string;
    email: string;
    id: number;
    date: Date;
    metodoPago: PAYMENT_METHODS;
    detail: OrderDetail[];
}
