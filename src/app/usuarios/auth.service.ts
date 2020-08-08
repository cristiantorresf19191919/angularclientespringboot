import { Injectable, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Usuario, TokenDecoded } from './usuario';
import { catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // va a tener un accessor metodo get
  private _usuario: Usuario;
  private _token: string | null;
  private _notificarLogin = new EventEmitter<any>();
  constructor(private httpClient: HttpClient) {}

  public get notificarLogin(){
    return this._notificarLogin;
  }

  hasRole(role:string):boolean{
    //getter
    if (this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }

  public get usuario(): Usuario {
    if (this._usuario !== null) {
      return this._usuario;
    } else if (this._usuario !== null && sessionStorage.getItem('Usuario')) {
      this._usuario = JSON.parse(sessionStorage.getItem('Usuario')) as Usuario;
      return this._usuario;
    } else {
      // si no hay nada votamos el usuario vacio
      return new Usuario();
    }
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token !== null && sessionStorage.getItem('Token')) {
      this._token = sessionStorage.getItem('Token');
      return this._token;
    } else {
      return null;
    } 
  }
  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = 'http://localhost:8080/oauth/token';
    const credenciales = btoa('ClientesApp' + ':' + '12345');
    const httpHeaders: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + credenciales,
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    return this.httpClient
      .post<any>(urlEndpoint, params.toString(), {
        headers: httpHeaders,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          error;
          return throwError(error.error.error_description);
        })
      );
  }

  public DecodificarToken(token: string): TokenDecoded {
    if (token != null) {
      // convierte en arreglo y selecciona el segundo elemento
      let arreglo: Array<string> = token.split('.');
      let segElement: string = arreglo[1];
      // decodificar de base64 a string
      let decods: string = window.atob(segElement);
      // de string pasarlo a objeto
      let objUsuario: TokenDecoded = JSON.parse(decods);
      return objUsuario;
    }

    return null;
  }

  refresh(): void{
      if (sessionStorage.getItem("Token") && sessionStorage.getItem("Token").length>5){
        if (this.estaAutenticado()){
          this.guardarUsuario(this.token);
        }
      }

  }
 

  guardarUsuario(token: string): void {
    let payload: TokenDecoded = this.DecodificarToken(token);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.username;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('Usuario', JSON.stringify(this._usuario));
  }
  guardarToken(token: string): void {
    this._token = token;
    sessionStorage.setItem('Token', this._token);
  }

  estaAutenticado():boolean{
    let payload:TokenDecoded = this.DecodificarToken(this.token);
    if (payload !== null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }

  logout(): void{
    this._token = null;
    this._usuario = null;
    sessionStorage.removeItem("Token");
    sessionStorage.removeItem("Usuario");

  }
}
