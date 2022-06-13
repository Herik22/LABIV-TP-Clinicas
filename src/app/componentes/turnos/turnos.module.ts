import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosClinicaComponent } from './turnos-clinica/turnos-clinica.component';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';


@NgModule({
  declarations: [
    SolicitarTurnoComponent,
    TurnosClinicaComponent,
    MisTurnosComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,ReactiveFormsModule 
  ]
})
export class TurnosModule { }
