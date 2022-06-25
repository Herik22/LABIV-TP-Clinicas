import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TurnosRoutingModule } from './turnos-routing.module';
import { SolicitarTurnoComponent } from './solicitar-turno/solicitar-turno.component';
import { TurnosClinicaComponent } from './turnos-clinica/turnos-clinica.component';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TransformarFechaPipe } from 'src/app/PIPES/transformar-fecha.pipe';
import { FechaTurnoPipe } from 'src/app/PIPES/fecha-turno.pipe';
import { FormatoHoraPipe } from 'src/app/PIPES/formato-hora.pipe';
import { TransformarEstadoPipe } from 'src/app/PIPES/transformar-estado.pipe';

@NgModule({
  declarations: [
    SolicitarTurnoComponent,
    TurnosClinicaComponent,
    MisTurnosComponent,
    TransformarFechaPipe,
    FechaTurnoPipe,
    FormatoHoraPipe,
    TransformarEstadoPipe
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule,
    FormsModule,ReactiveFormsModule 
  ]
})
export class TurnosModule { }
