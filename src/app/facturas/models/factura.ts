import { ItemFactura } from './item-factura';
import { Cliente } from '../../clientes/cliente';
export class Factura {
    id:number;
    descripcion:string;
    observacion:string;
    items:Array<ItemFactura> = [];
    cliente: Cliente;
    total:number;
    createdAt: Date;

    calcularGranTotal():number{
        this.total = 0;
        this.total = this.items.reduce(((ac,item:ItemFactura)=>{
            return ac + item.calcularImporte();
        }),0)
        return this.total;
    }
    
}
