import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCompartidoComponent } from './form-compartido/form-compartido.component';
import { FormUComponent } from './form-u/form-u.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ListadoHistorialesClinicosComponent } from './listado-historiales-clinicos/listado-historiales-clinicos.component';
import { ListadoTurnosPacienteComponent } from './listado-turnos-paciente/listado-turnos-paciente.component';


@NgModule({
  declarations: [
    FormCompartidoComponent,
    FormUComponent,
    ListadoHistorialesClinicosComponent,
    ListadoTurnosPacienteComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    FormCompartidoComponent,
    FormUComponent,
    ListadoHistorialesClinicosComponent,
    ListadoTurnosPacienteComponent
  ]
})
export class ModuloCompartidoModule { }
