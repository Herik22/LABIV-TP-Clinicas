import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/entidades/usuario';
import { Turno } from 'src/app/entidades/turnos';
import { FirebaseService } from 'src/app/servicios/firebase.service';




@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {

  currenUser:Usuario = new Usuario()
  listaMisPacientes:Usuario[]=[] //especialista
  listaTurnos:Turno[]=[] 
  turnosPacienteClickeado:Turno[] =[] 
  nameCollectionUsers:string='UsuariosColeccion'
  nameCollectionTurnos:string='TurnosColeccion'
  tienePaciente:boolean=false
  pacienteSeleccionado:Usuario = new Usuario()
  turnoSelected:Turno=new Turno()
  constructor(private apiFB:FirebaseService) { 

    this.apiFB.getUserLogged().subscribe(res=>{ //observables
      if(res!=null){//EVENTO
         this.apiFB.getUser(res.uid).subscribe(resUSER=>{
    
          let objRta = resUSER.data()
      
          this.currenUser.uid = objRta?.['uid']
          this.currenUser.nombre = objRta?.['nombre']
          this.currenUser.apellido = objRta?.['apellido']
          this.currenUser.edad = objRta?.['edad']
          this.currenUser.dni = objRta?.['dni']
          this.currenUser.obraSocial = objRta?.['obraSocial']
          this.currenUser.especialidad = objRta?.['especialidad']
          this.currenUser.email = objRta?.['email']
          this.currenUser.fotosPerfil = objRta?.['fotosPerfil']
          this.currenUser.perfil = objRta?.['perfil']
          this.currenUser.isAdmin = objRta?.['isAdmin']
          this.currenUser.valid = objRta?.['valid']
          this.currenUser.historialClinico = objRta?.['historialClinico']
          this.currenUser.pacientesAtendidos = objRta?.['pacientesAtendidos']

          
        
          this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
     
          res.forEach(value=>{
            if(value.perfil==='Paciente'){
              const newUser:Usuario = value
     
              //si el especialista tiene pacientes atendidos
              if(this.currenUser.pacientesAtendidos.length >0){
                 // busco en el array de pacientes atendidos el id del paciente actual 
                if( this.currenUser.pacientesAtendidos.includes(newUser.uid) ){
                  //si existe pusheo en MIS PACIENTES el usuario.
                  this.listaMisPacientes.push(newUser)
                  this.tienePaciente=true
                }
              }
            }
          }) 
         
          })

        })
      }else{
    
      }
    }) 
    this.apiFB.getCollection(this.nameCollectionTurnos).subscribe(res=>{
       
      res.forEach(value=>{

          let newTurno = new Turno()
          newTurno.duracion = value.duracion
          newTurno.encuestaCompletada= value.encuestaCompletada
          newTurno.encuesta=value.encuesta
          newTurno.especialidad= value.especialidad
          newTurno.especialista = value.especialista
          newTurno.paciente = value.paciente
          newTurno.fecha = new Date(value.fecha) 
          newTurno.status= value.status // pendiente
          newTurno.id= value.id
          newTurno.calificacion=value.calificacion
          newTurno.comentario=value.comentario
          newTurno.resenia=value.resenia
          newTurno.historialGenerado = value.historialGenerado
        
          this.listaTurnos.push(newTurno)
      })

  })
 }

  clickearUsuario(paciente:Usuario){
    this.pacienteSeleccionado = paciente
    this.listaTurnos.forEach(value=>{
        if(value.paciente.uid === paciente.uid && value.especialista.uid === this.currenUser.uid){
          this.turnosPacienteClickeado.push(value)
      }  
    })

    
  }

  escucharTurnoSelecionado(turno:Turno){   
    this.turnoSelected= turno
  }

  cerrarModalyLimpiarData(){
    this.pacienteSeleccionado = new Usuario()
    this.turnosPacienteClickeado = []
  }


  ngOnInit(): void {
  }

}
