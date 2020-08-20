import { Component, OnInit } from '@angular/core';
import { Factura } from '../models/factura';
import { ClienteService } from '../../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { startWith, map, flatMap } from 'rxjs/operators';
import { FacturaService } from '../services/factura.service';
import { Producto } from '../models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from '../models/item-factura';
import swal from 'sweetalert2';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss'],
})
export class FacturaComponent implements OnInit {
  titulo: string = 'nueva factura';
  factura: Factura = new Factura();

  onShowAllElements:boolean=false;
  products:Producto[] = [];
  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;
  productosFiltradosVarReact:Producto[];
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe((params) => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe((cliente) => {
        this.factura.cliente = cliente;
      });
    });
    
    // map( value ) = es cada letra que recive desde el input
    this.productosFiltrados = this.autoCompleteControl.valueChanges.pipe(    
      startWith(""),  
      map(value => {        
        this.onShowAllElements = false;  
        this.products.length = 0;
        return this._filter(value);        
      })  
    );

    
/*     const test = this._filter("a");
    console.log(test); */

  }


private _filter(value: string): Producto[]  {

  this.onShowAllElements = false;
  let filterValue = value.toLowerCase();
  if (filterValue == null || filterValue == undefined){
    filterValue = " ";
  }
  let prodFiltradosRe:Producto[] = [];
  this.facturaService.filtrarProductos(filterValue).subscribe(
    (prodFiltrados) => {
      prodFiltradosRe.push(...prodFiltrados);
    }
  );
  
  return prodFiltradosRe;  
} 

mostrarNombre(producto?:Producto):string | undefined {
  producto;
  /* debugger; */
  return undefined;

}

seleccionarProducto(event:MatAutocompleteSelectedEvent):void{
  console.log(event);
}

seleccionarProductoTest(producto?:Producto){
 

  
  if(this.existeItem(producto.id)){   
    this.incrementaCantidad(producto.id);
  } else {
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;    
    this.factura.items.push(nuevoItem);
    this.autoCompleteControl.setValue(''); 
  }

}

actualizarCantidad(id,event:any):void{
  let cantidad = event.target.value as number;

  if (cantidad == 0){
    return this.eliminarItem(id);
  }

  this.factura.items = this.factura.items.map((item:ItemFactura) =>{
    if (id == item.producto.id){
      item.cantidad = cantidad;
    }
    return item;
  } );

 

}

existeItem(id:number):boolean{
  let exist = false;
  this.factura.items.forEach((item:ItemFactura)=>{
    if (id === item.producto.id){
      exist = true;
    }
  });
  return exist;
}

incrementaCantidad(id:number):void{
  this.factura.items.map((item:ItemFactura)=>{
    if (id === item.producto.id){
      ++item.cantidad ;
    }
    return item;
  })

}

eliminarItem(id:number):void{
  this.factura.items = this.factura.items.filter((item:ItemFactura)=>{
    return item.producto.id !== id; 
  });

}

crearFactura(facturaForm):void{

  if (this.factura.items.length == 0){
    this.autoCompleteControl.setErrors({'invalid':true});
  }

  if(facturaForm.form.valid && this.factura.items.length > 0){
    //@JsonIgnoreProperties(value={"facturas", "hibernateLazyInitializer", "handler"}, allowSetters=true)
    this.factura.cliente.facturas = [];
    this.facturaService.crearFactura(this.factura).subscribe(factura => {
      console.log(factura);
      swal.fire(this.titulo, `factura ${factura.descripcion} creada con exito`,'success');
      this.router.navigate(['/facturas',factura.id]);
    })
  }
 
}

showAllProductsOnClick(){

this.facturaService.showAllProducts().subscribe((products:any)=>{
    
    this.products.push(...products.productos as Producto[]);
    if (this.products.length > 0){
      this.onShowAllElements = true;
      
    }
})
}





}

