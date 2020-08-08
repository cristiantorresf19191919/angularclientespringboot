import { Observable } from 'rxjs';
import { Cliente } from './../clientes/cliente';
import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../clientes/cliente.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Region } from '../clientes/region';

interface Response {
  cliente: Cliente;
  mensaje: string;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  titulo: string = 'forms';
  public errores: string[];
  public cliente: Cliente = new Cliente();
  public regiones: Region[];
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {

    

    this.cargarCliente();
    this.cargarRegiones();
  }

  cargarRegiones() {
    this.clienteService.getRegiones().subscribe((regiones) => {
      this.regiones = regiones;
    });
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }

  create(): void {
    console.log(this.cliente);
    //pausar el codigo 
    
    this.clienteService.create(this.cliente).subscribe(
      (cliente) => {      
       
        
        this.router.navigate(['/clientes']);
        swal.fire(
          'Nuevo cliente',
          `Cliente ${cliente.nombre} creado con exito`,
          'success'
        );
      },
      (err) => {
       
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
        console.error('codigo de error desde el backend ' + err.status);
      }
    );
  }

  update(): void {
    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(
      (json: any) => {
        this.router.navigate(['/clientes']);
        swal.fire(
          'Cliente actualizado',
          `Cliente ${json.mensaje} : ${json.cliente.nombre} actualizado con exito`,
          'success'
        );
      },
      (err) => {
        this.errores = err.error.errors as string[];
        console.error(err.error.errors);
        console.error('codigo de error desde el backend ' + err.status);
      }
    );
  }

  //OBJ1  a cada una de la iteraccion del ngfor
  //OBJ2 el objeto actual que viene del backend
  compararRegion(obj1: Region, obj2: Region): boolean {
    // este if funciona para el option select y poner mensaje de defecto
    // si no pone para que ponga que la region no puede ser vacia
    if (obj1 == undefined || obj2 == undefined){
      return true
    }
    // aca muestra automaticamente la lista que viene del backend
    return obj1 == null ||
      obj2 == null     
      ? false
      : obj1.id == obj2.id;
  }
}
