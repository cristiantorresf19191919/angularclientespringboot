import { Region } from './region';
import { Factura } from '../facturas/models/factura';
export class Cliente {
    id:number;
    nombre: string;
    apellido: string;
    createdAt:string;
    email:string;
    foto:string;    
    region: Region;
    facturas: Array<Factura> = [];
}

export enum DatosUsuales {
    url = "http://localhost:8080/api",
    NO_PIC= "http://localhost:8080/images/no-user.png"
} 

