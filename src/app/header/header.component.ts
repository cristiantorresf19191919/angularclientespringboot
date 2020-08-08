import { Component, OnInit, OnChanges } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  estaAutenticado:boolean =true;
  usuario:Usuario;
  constructor(
    private authService:AuthService,
    private router: Router
    

  ) { }

  ngOnInit(): void {
    this.authService.refresh();
    this.estaAutenticado = this.authService.estaAutenticado();
    this.usuario = this.authService.usuario;
    
    this.authService.notificarLogin.subscribe(e =>{
      if (e == "change"){
        this.estaAutenticado = true;
        this.usuario = this.authService.usuario;

      }
    })
    
    
  }
  
  



  logout(){    
    swal.fire('Hola','has cerrado sesion con exito');  
    this.router.navigate(['/login']);
    this.estaAutenticado = !this.estaAutenticado;
    this.authService.logout();  
  }

}
