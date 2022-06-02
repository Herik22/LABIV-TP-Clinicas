import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AltaUsuarioComponent } from './alta-usuario/alta-usuario.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';

const routes: Routes = [
  {path:'alta',component:AltaUsuarioComponent},
  {path:'listado',component:ListadoUsuariosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
