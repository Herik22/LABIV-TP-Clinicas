import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCompartidoComponent } from './form-compartido/form-compartido.component';
import { FormUComponent } from './form-u/form-u.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormCompartidoComponent,
    FormUComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    FormCompartidoComponent,
    FormUComponent
  ]
})
export class ModuloCompartidoModule { }
