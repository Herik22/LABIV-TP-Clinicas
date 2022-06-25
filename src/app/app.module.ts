import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { TopNavBarComponent } from './componentes/top-nav-bar/top-nav-bar.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { environment } from 'src/environments/environment.prod';
import {AngularFireModule} from '@angular/fire/compat';
import { ModuloCompartidoModule } from './componentes/modulo-compartido/modulo-compartido.module';
import { PacientesComponent } from './componentes/pacientes/pacientes.component';

import { DestacarDirective } from './DIRECTIVAS/destacar.directive';





@NgModule({
  declarations: [
    AppComponent,
    BienvenidaComponent,
    TopNavBarComponent,
    LoginComponent,
    RegistroComponent,
    PacientesComponent,
    DestacarDirective,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,FormsModule,ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ModuloCompartidoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
