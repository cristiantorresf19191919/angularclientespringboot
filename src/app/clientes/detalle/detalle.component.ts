import Swal from 'sweetalert2';
import { ClienteService } from './../cliente.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Cliente, DatosUsuales } from '../cliente';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from '../../usuarios/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from '../../facturas/models/factura';
import swal from 'sweetalert2';

interface DialogData{
  cliente:Cliente
}

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
})
export class DetalleComponent implements OnInit {
  /* @Input() cliente: Cliente; */
  titulo: string = 'detalle del cliente';
  url: string;
  public progreso: number;
  private fotoSeleccionada: File;
  cliente:Cliente;

  // inyectar el servicio de cliente por el constructor
  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    public authService: AuthService,
    public dialogRef: MatDialogRef<DetalleComponent>,
    private facturaService:FacturaService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.url = DatosUsuales.url;
    this.cliente = this.data.cliente;
  }

 
  onNoClick(): void {
    this.dialogRef.close();
  }

  seleccionarFoto(evento): void {
    this.fotoSeleccionada = evento.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {
    this.clienteService
      .subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe((evento) => {
        if (evento.type === HttpEventType.UploadProgress) {
          
          // calcular el porcentaje de 1 a 100 de la carga de la pagina
          this.progreso = Math.round((evento.loaded / evento.total) * 100);
        } else if (evento.type === HttpEventType.Response) {
          let response: any = evento.body;
          this.cliente = response.cliente as Cliente;
          // aca es para que se cargue la foto automaticamente en el listado 
          // despues de subirla
          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire(
            'La foto se ha subido correctamente',
            `${response.mensaje}`,
            'success'
          );
        }
        // this.cliente = cliente;
      });
  }
  cerrarModal(){
    
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  deleteFactura(factura:Factura):void{

    swal.fire({
      title:'esta seguro?',
      text:`seguro desea eliminar la factura ${factura.descripcion}`,
      icon:'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'

    }).then((result)=>{
      if (result.value){
        this.facturaService.delete(factura.id).subscribe(_ => {
          this.cliente.facturas = this.cliente.facturas.filter(fact => fact !== factura);
          Swal.fire("factura eliminada");
        })
      }
    })

  }
}


