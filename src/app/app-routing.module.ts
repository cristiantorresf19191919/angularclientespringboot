import { FormComponent } from './form/form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectivasComponent } from './directivas/directivas.component';
import { ClientesComponent } from './clientes/clientes.component';
import { DetalleComponent } from './clientes/detalle/detalle.component';

import { LoginFormComponent } from './usuarios/login-form/login-form.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  {path:'login',component:LoginFormComponent},
  { path: 'clientes/form', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'} },
  { path: 'clientes/:page', component: ClientesComponent },
  { path: 'clientes/form/:id', component: FormComponent, canActivate:[AuthGuard, RoleGuard], data:{role:'ROLE_ADMIN'} },
  { path: 'directivas', component: DirectivasComponent },
  { path: 'clientes', component: ClientesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
