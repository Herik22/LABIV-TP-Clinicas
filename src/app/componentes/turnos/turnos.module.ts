import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosClinicaComponent } from './turnos-clinica/turnos-clinica.component';


@NgModule({
  declarations: [
    SolicitarTurnoComponent,
    TurnosClinicaComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule
  ]
})
export class TurnosModule { }
