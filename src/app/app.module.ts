import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { HeaderComponent } from './header/header.component';
import { DirectivasComponent } from './directivas/directivas.component';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PaginatorComponent } from './paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModulePapa } from './material.module/material.module';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './usuarios/login-form/login-form.component';
import { TokenInterceptor } from './usuarios/interceptores/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptores/auth.interceptor';
import { LabelComponentComponent } from './label-component/label-component.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturaComponent } from './facturas/factura/factura.component';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    HeaderComponent,
    DirectivasComponent,
    FormComponent,
    FooterComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    LoginFormComponent,
    LabelComponentComponent,
    DetalleFacturaComponent,
    FacturaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModulePapa,
    ReactiveFormsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' },
  {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,multi:true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor,multi:true}
],
  bootstrap: [AppComponent],
})
export class AppModule {}
