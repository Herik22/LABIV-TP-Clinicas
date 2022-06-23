import { Component, OnInit,Input,Output,EventEmitter  } from '@angular/core';
import { Turno } from 'src/app/entidades/turnos';

@Component({
  selector: 'app-listado-turnos-paciente',
  templateUrl: './listado-turnos-paciente.component.html',
  styleUrls: ['./listado-turnos-paciente.component.scss']
})
export class ListadoTurnosPacienteComponent implements OnInit {
  @Input () listaTurnos:Turno[]=[]
  @Output() eventoTurnoSeleccionado = new EventEmitter<Turno>()

  constructor() { }

  ngOnInit(): void {
  }
  emitirEvento(turno:Turno){
    return this.eventoTurnoSeleccionado.emit(turno)
  }

}
