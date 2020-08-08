import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Usuario, UsuarioResponse } from '../usuario';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  titulo:string = "Por favor Sign In";
  usuario:Usuario;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {

    if (this.authService.estaAutenticado()){
        let usuario = this.authService.usuario;  
          
      this.router.navigate(['/clientes']);
    }

  }

  login():void{

    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null){
      swal.fire('error Login','usuario y password nulo','error');
      return;
    }

    this.authService.login(this.usuario).subscribe((response:UsuarioResponse)=>{
      response;   
     
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      // el getter lo usa como si fuera un atributo aunque sea un metodo
      let usuario = this.authService.usuario;
      if (this.authService.estaAutenticado){
        this.authService.notificarLogin.emit("change");
      }
      swal.fire('Login',`Hola ${usuario.username}, has inciado sesion con exito`,'success');
      
      this.router.navigate(['/clientes']);


    },(error:string)=>{
      swal.fire('Login Failed',error,'error');
    })
    
  }

}
