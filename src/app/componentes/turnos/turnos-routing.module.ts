import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosClinicaComponent } from './turnos-clinica/turnos-clinica.component';
const routes: Routes = [
  {path:'solicitarTurno',component:SolicitarTurnoComponent },
  {path:'turnosClinica',component:TurnosClinicaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TurnosRoutingModule { }
