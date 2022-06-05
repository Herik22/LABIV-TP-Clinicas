import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { ModuloCompartidoModule } from '../modulo-compartido/modulo-compartido.module';
import { PerfilComponent } from './perfil/perfil.component';

@NgModule({
  declarations: [
    ListadoUsuariosComponent,
    AltaUsuarioComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ModuloCompartidoModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
