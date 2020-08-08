import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Cliente } from './cliente';
import { Observable, of, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { formatDate, DatePipe } from '@angular/common';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private urlEndPoint: string = 'http://localhost:8080/api/clientes/';
  // private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' }); lo hace por defecto

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

/*  
esto lo hace el interceptor
private agregarAuthorizationHeader() {
    let token  = this.authService.token;
    if (token !== null){
      return this.httpHeaders.append('Authorization','Bearer '+token);
    } else {
      return this.httpHeaders;
    }
  } */



  getClientes(page: Number): Observable<any> {
    return this.httpClient.get(this.urlEndPoint + 'page/' + page).pipe(
      tap((response: any) => {
        console.log('cliente service: tap 1');
        (response.content as Cliente[]).forEach((cliente) => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // cliente.createdAt = formatDate(cliente.createdAt, 'dd-MM-yyyy','en-US');
          // let datePipe = new DatePipe('es');
          // cliente.createdAt = datePipe.transform(cliente.createdAt, 'fullDate');
          // cliente.createdAt = datePipe.transform(cliente.createdAt, 'EEEE dd, MMMM yyyy');
          return cliente;
        });
        return response;
      })
    );
  }

  getRegiones(): Observable<Region[]> {
    

    return this.httpClient.get<Region[]>(`${this.urlEndPoint}regiones`)
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient
      .post(this.urlEndPoint, cliente)
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(e);            
            return throwError(e);
          }
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}${id}`).pipe(
      catchError(e =>{
        if (e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.errror.mensaje);
          return throwError(e);

        }
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    return this.httpClient
      .put<any>(`${this.urlEndPoint}${cliente.id}`, cliente )
      ;
  }

  delete(id: number): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}${id}`)
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<Object>> {
    let formData = new FormData();

    formData.append('archivo', archivo);
    formData.append('id', id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;
    if (token !== null){
      httpHeaders = httpHeaders.append('Authorization','Bearer '+token);
    }
    /*  let url = "http://localhost:8080/api/uploads/img"; */
    // esto es para hacer una barra de progreso esto le tira booleano
    // dependiendo como va la vuelta en la comunicacion
    const req = new HttpRequest(
      'POST',
      `${this.urlEndPoint}upload`,
      formData,
      {
        reportProgress: true,
        headers: httpHeaders
      }
    );
    return this.httpClient.request(req);
  }
}
