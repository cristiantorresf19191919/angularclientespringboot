import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal:boolean 
  // en typescript se le pone un _ para separar el atributo del getter
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }
  // cuando se sube la foto emitimos un evento usando el getter
  get notificarUpload():EventEmitter<any>{
    return this._notificarUpload;
  } 

  abrirModal(){
    this.modal = true;

  }

  cerrarModal(){
    this.modal = false;
  }
}
