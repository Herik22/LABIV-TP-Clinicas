import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
const routes: Routes = [
  {path:'bienvenida',component:BienvenidaComponent},
  {path:'login',component:LoginComponent},
  {path:'registro',component:RegistroComponent},
  {path:'usuarios',loadChildren:()=> import('./componentes/usuarios/usuarios.module').then(m => m.UsuariosModule)},
{path:'turnos',loadChildren:()=> import('./componentes/turnos/turnos.module').then(m=> m.TurnosModule)},
  {path:'',component:BienvenidaComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
