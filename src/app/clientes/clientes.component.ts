import { Component, OnInit } from '@angular/core';
import { Cliente, DatosUsuales } from './cliente';

import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginator: any;
  public url: string;
  public noPic: string;
  clienteSeleccionado: Cliente;
  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    
    this.url = DatosUsuales.url;
    this.noPic= DatosUsuales.NO_PIC;
    this.activatedRoute.paramMap.subscribe((params) => {
      let page: number = +params.get('page');
      if (!page) page = 0;
      this.clienteService.getClientes(page)
        .pipe(
          tap(
            // el json dentro de content esta el arreglo de clientes
            (clientes: any) => (this.clientes = clientes.content as Cliente[])
          ),
          tap((response) => {
            // totalElements, number, totalPages, 
            this.paginator = response;
          })
        )
        .subscribe();
    });

    this.modalService.notificarUpload.subscribe((cliente:Cliente)=>{
     this.clientes =  this.clientes.map(clienteOriginal => {
        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    })

  }

  delete(cliente: Cliente): void {
    this.clienteService
      .delete(cliente.id)
      .subscribe((clienteResponse: Cliente) => {
        if (clienteResponse) {
          let index = this.clientes.indexOf(clienteResponse);
          Swal.fire(
            'cliente eliminado',
            `cliente ${cliente.nombre} eliminado con exito`,
            'success'
          );
          this.clientes.splice(index, 1);
        } else {
          Swal.fire('error');
        }
      });
  }

  dispararPopUp(cliente) {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }
}
