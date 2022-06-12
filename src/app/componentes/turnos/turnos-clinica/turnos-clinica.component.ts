import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import { escapeRegExp } from '@angular/compiler/src/util';


@Component({
  selector: 'app-turnos-clinica',
  templateUrl: './turnos-clinica.component.html',
  styleUrls: ['./turnos-clinica.component.scss']
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

  switchFiltrosEspecialistas:boolean = false
  switchFiltrosEspecialidades:boolean = false
  
  turnosCargados:boolean = false
  constructor(private apiFB:FirebaseService) { 

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
        console.log('TURNO')
          console.log(value)
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

  activarFiltroEspecialistas(){
    this.switchFiltrosEspecialistas = !this.switchFiltrosEspecialistas
  }
  seleccionarEspecialistaParaFiltrar(especialista:Usuario){
    console.log('especialistaElegido')
    console.log(especialista)
    this.filtrarTurnosEspecialista(especialista)
  }


  filtrarTurnosEspecialista(esp:Usuario){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialista.uid == esp.uid 
      })
    this.listaTurnos=listaFiltrada
  }
  

}
