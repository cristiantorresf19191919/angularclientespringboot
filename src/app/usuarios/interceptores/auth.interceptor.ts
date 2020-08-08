import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.authService.token;

    return next.handle(req).pipe(
      catchError((e) => {
        //no autenticado
        if (e.status == 401) {
          swal.fire('Acceso denegado', 'inicia Sesion', 'warning');
          // si el token espira bota error 401 y toca preguntar y desloguearse

          if (this.authService.estaAutenticado()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        // acceso forbidden
        if (e.status == 403) {
          swal.fire(
            'Acceso denegado',
            'no tienes acceso o permisos a este recurso',
            'warning'
          );
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }
}
