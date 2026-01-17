import {Role} from "./Role";

export type User = {
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
    email: string;
    password: string;
    blocked: boolean;
    role: Role;
    direccion: string;
    zona: string;
};
