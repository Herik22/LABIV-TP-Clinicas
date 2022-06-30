import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';


@Component({
  selector: 'app-turnos-clinica',
  templateUrl: './turnos-clinica.component.html',
  styleUrls: ['./turnos-clinica.component.scss'],
  animations:[
    trigger('transicionUp-Down',[
      state('void',style({
        transform:'translateY(-100%)',
        opacity:0
      })),
      transition(':enter',[
        animate(500,style({
          transform:'translateY(0)',
          opacity:1
        }))
      ])
    ]),
    trigger('transicionDer-Izq',[
      state('void',style({
        transform:'translateX(200%)',
        opacity:0
      })),
      transition(':enter',[
        animate(500,style({
          transform:'translateY(0)',
          opacity:1
        }))
      ])
    ]),
   
  ],
})
export class TurnosClinicaComponent implements OnInit {

  currenUser:Usuario = new Usuario()
  nameCollectionTurnos:string='TurnosColeccion'
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]

  listaEspedialidades:any[]=[] //especialidades
  listaEspeciaistas:Usuario[]=[] //especialista
  nameCEspecialidades:string='especialidades'
  nameCollectionUsers:string='UsuariosColeccion'

  switchFiltroEspecialista:boolean = false
  switchFiltroEspecialidades:boolean = false
  switchActivarFiltros:boolean = false
  filtroAplicado:boolean = false
  
  turnosCargados:boolean = false
  turnoSelectedForComentary:Turno = new Turno()

  formaComentario:FormGroup;
  constructor(private fb:FormBuilder,private apiFB:FirebaseService) { 

    this.formaComentario = this.fb.group({
      'comentario':['',[Validators.required,]],
     
    })

    
    this.apiFB.getUserLogged().subscribe(res=>{ //observables
      if(res!=null){//EVENTO

         this.apiFB.getUser(res.uid).subscribe(resUSER=>{
    
          let objRta = resUSER.data()
      
          this.currenUser.nombre = objRta?.['nombre']
          this.currenUser.apellido = objRta?.['apellido']
          this.currenUser.dni = objRta?.['dni']
          this.currenUser.edad = objRta?.['edad']
          this.currenUser.email = objRta?.['email']
          this.currenUser.fotosPerfil = objRta?.['fotosPerfil']
          this.currenUser.isAdmin = objRta?.['isAdmin']
          this.currenUser.obraSocial = objRta?.['obraSocial']
          this.currenUser.perfil = objRta?.['perfil']
          this.currenUser.uid = objRta?.['uid']
          this.currenUser.especialidad = objRta?.['especialidad']
         })
      }else{
    
      }
    }) 
    this.apiFB.getCollection(this.nameCollectionTurnos).subscribe(res=>{
       
      let newArray:Turno[]=[]
      res.forEach(value=>{

          let newTurno = new Turno()
          newTurno.duracion = value.duracion
         /* newTurno.especialista = new Usuario(value.especialista.nombre,value.especialista.apellido,value.especialista.edad,value.especialista.dni,value.especialista.email,'',value.especialista.foto) 
          newTurno.especialista.obraSocial = value.especialista.obraSocial
          newTurno.especialista.uid = value.especialista.uid
          newTurno.especialista.perfil = value.especialista.perfil 
          */ 
          newTurno.especialidad= value.especialidad
          newTurno.especialista = value.especialista
          newTurno.paciente = value.paciente
          newTurno.fecha = new Date(value.fecha) 
          newTurno.status= value.status // pendiente
          newTurno.id= value.id

          newArray.push(newTurno)
        
      })
      
      this.listaTurnos=newArray
      this.listaAuxTurnos=newArray
      this.turnosCargados=true

  })
    this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
       
      let newArray:Usuario[]=[]
      res.forEach(value=>{
        if(value.perfil==='Especialista'){
          let newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
          newUser.especialidad = value.especialidad
          newUser.uid = value.uid
          newArray.push(newUser)
        }
      })
    
    this.listaEspeciaistas=newArray
  })
  this.apiFB.getCollection(this.nameCEspecialidades).subscribe(res=>{
    this.listaEspedialidades= res
  })

  }

  ngOnInit(): void {
  }

  obtenerEstado(status:number){
    let estado = 'FALSO'

    switch(status){
      case 1:
        estado = 'PENDIENTE ⏰'
        break;
      case 2:
        estado = '☑️ ACEPTADO ☑️'
        break;
      case 3:
        estado = ' ✅ REALIZADO ✅ '
        break;
      case 6:
        estado = '🚨 CANCELADO 🚨'
        break;     
    }
    return estado

  }


  activarFiltrosUnicos(){
   this.switchActivarFiltros =  !this.switchActivarFiltros 
  }

  activarFiltroEspecialistas(){
    if(!this.switchFiltroEspecialista){
      this.switchFiltroEspecialidades=false
    }
    this.switchFiltroEspecialista = !this.switchFiltroEspecialista
    
  }
  activarFiltroEspecialidades(){
    if(!this.switchFiltroEspecialidades){
      this.switchFiltroEspecialista=false
    }
    this.switchFiltroEspecialidades = !this.switchFiltroEspecialidades
  }

  eliminarFiltros(){
    this.listaTurnos = this.listaAuxTurnos
    this.switchFiltroEspecialista=false
    this.switchFiltroEspecialidades=false
    this.filtroAplicado=false

  }


  seleccionarEspecialistaParaFiltrar(especialista:Usuario){
    this.filtrarTurnosEspecialista(especialista)
    this.filtroAplicado=true
    this.switchFiltroEspecialista=false
  }
  seleccionarEspecialidadParaFiltrar(especialidad:any){
    this.filtrarTurnosxEspecialidad(especialidad)
    this.filtroAplicado=true
    this.switchFiltroEspecialidades=false
  }
  seleccionarTurnoParaComentario(turno:Turno){
    this.turnoSelectedForComentary = turno
  }


  filtrarTurnosEspecialista(esp:Usuario){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialista.uid == esp.uid 
      })
    this.listaTurnos=listaFiltrada
  }

  filtrarTurnosxEspecialidad(especialidad:any){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialidad.id == especialidad.id 
      })
    this.listaTurnos=listaFiltrada
  }


  preCancelarTurno(turno:Turno){

    /*let specialidades = this.auxUsuario.especialidad // obtengo el listado de especialidades del usuarios actual 
      
      let newEspecialidades = specialidades.map(value=>{ //obtengo un nuievo array de especialidades segun 
        
        if(idEspecialidad === value.id){ // obtengo la especialidad que quiero modificar. 
          value.disponibilidad = this.newDisponibilidad // seteo la nueva cantidad de minutos para el turno 
          value.diasDisponibles = this.diasSeleccionados
        }
        return value
    }) */  // el especiaño
  //turno.fecha = new Date(turno.fecha.getTime())
  console.log(turno)
  this.seleccionarTurnoParaComentario(turno)


  }

  cancelarTurnoDefinitivo(){
    
    this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      console.log('editado el  Comentario ')
      this.formaComentario.setValue({comentario:''})
      this.apiFB.updateStatus(this.turnoSelectedForComentary.id,6)
      .then(rta=>{
        console.log('Cancelado el turno ')
       //actualizar listados 
      })
      .catch(err=>{
        console.log('ocurrio un error editando el STATUS ' + err)
      })
    })
    .catch(err=>{
      console.log('ocurrio un error editando EL COMENTARIO ' + err)
    })
  }




}
