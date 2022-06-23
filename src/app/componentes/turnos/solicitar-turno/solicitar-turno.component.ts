import { Component, OnInit } from '@angular/core';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { throws } from 'assert';
import { normalize } from 'path';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
var uniqid = require('uniqid'); 

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {
  
  currenUser:Usuario = new Usuario()

  // LISTADOS  Especialistas,Especialidades,proximos15 Días, Fechas disponi
  dias:Date[]=[] // proximos 15 dias apartir de la fecha
  listaPacientes:Usuario[]=[]
  listaEspedialidades:any[]=[] //especialidades
  listaEspeciaistas:Usuario[]=[] //especialista
  disponibilidadEspecialista:number[]=[] // dias que trabaja el especialista segun la especialidad 
  fechasDisponiblesParaTurno:Date[] = [] // fechas disponibles segun los dias que trabaja el especialista
  horasDisponibles:Date[]=[] // horas disponibles para el turno segun los horarios de APERTURA , CIERRE y la duración del turno 

  //Nombres colecciones
  nameCEspecialidades:string='especialidades'
  nameCollectionUsers:string='UsuariosColeccion'
  nameCollectionTurnos:string='TurnosColeccion'

  //Selecciones
  tieneDiasDisponibles:boolean = true
  especialistaSelected:boolean = false //true user seleccionado false contrario 
  pacienteSelected:boolean = false
  isEspecialidadSelected:boolean = false
  horaSelected:boolean=false

  especialistaSeleccionado:Usuario = new Usuario()
  especialidadSeleccionada:any
  PacienteSeleccionado:Usuario = new Usuario()
  fechaTurnoSelecciada:Date=new Date()
  horaSeleccionada:Date = new Date ()

  constructor(private apiFB:FirebaseService,private ruteo:Router) {
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
          this.currenUser.password = objRta?.['password']
          this.currenUser.historialClinico = objRta?.['historialClinico']
         })
      }else{
    
      }
    }) 

    this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
       
        let newArray:Usuario[]=[]
        res.forEach(value=>{
          if(value.perfil==='Especialista'){
            let newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
            newUser.especialidad = value.especialidad
            newUser.uid = value.uid
            newUser.perfil = value.perfil
            newArray.push(newUser)
          }
        })
        
        this.listaEspeciaistas=newArray
    })
    //Lista pacientes
    this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
       
      let newArray:Usuario[]=[]
      res.forEach(value=>{
        if(value.perfil==='Paciente'){
          let newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
          newUser.obraSocial = value.obraSocial
          newUser.uid = value.uid
          newUser.perfil = value.perfil
          newUser.historialClinico = value.historialClinico
          newArray.push(newUser)
        }
      })
      
      this.listaPacientes=newArray
    })

    this.apiFB.getCollection(this.nameCEspecialidades).subscribe(res=>{
      this.listaEspedialidades = res
    })
   }

  ngOnInit(): void {
    this.obtenerProximosDias()
  }

  seleccionarEspecialista(item:Usuario){
    this.listaEspedialidades = item.especialidad
    this.especialistaSelected=true
    this.especialistaSeleccionado= item
    
  }
  seleccionarEspecialista2(item:Usuario){
    //this.listaEspedialidades = item.especialidad
    this.especialistaSelected=true
    this.especialistaSeleccionado= item
    
  }

  seleccionarEspecialidad2(item:any){
    this.isEspecialidadSelected=true
    this.especialidadSeleccionada=true
    
    let listaAuxEspecialistas:Usuario[]=[]
    this.listaEspeciaistas.forEach(value=>{
      
      value.especialidad.forEach(especialidadEspcialista=>{
        if(especialidadEspcialista.id === item.id){
          listaAuxEspecialistas.push(value)
        }
      })
      
    })
    this.listaEspeciaistas = listaAuxEspecialistas

  }

  seleccionarEspecialidad(item:any){
    //this.listaEspedialidades = item.especialidad
    this.isEspecialidadSelected=true

    //recorro las especialidades del usuario seleccionado, y comparo la especialidad seleccionada para obtener los diasDisponibles de la misma.  
    this.especialistaSeleccionado.especialidad.forEach(value=>{
      if(value.id === item.id){
        this.especialidadSeleccionada = value
        if(value.diasDisponibles.length>0)
        {
          this.disponibilidadEspecialista = value.diasDisponibles
        }else{
          this.tieneDiasDisponibles=false
          //alert('EL ESPECIALISTA NO TIENE DISPONIBILIDAD HORARIA')
        }

        
      }
    })

    this.filtrarFechasDisponibles()

   
  }

  seleccionarFechaTurno(dia:Date){
    console.log('FECHA SELECCIONADA')
    console.log(dia)

    this.fechaTurnoSelecciada = dia
    this.obtenerHoras(dia,this.especialidadSeleccionada.disponibilidad)
  }
  seleccionarHora(hora:Date){
    this.horaSeleccionada = hora
    this.horaSelected=true
    console.log('HORA SELECCIONADA')
    console.log(hora)
  }
  seleccionarPaciente(Paciente:Usuario){
    this.pacienteSelected=true
    this.PacienteSeleccionado= Paciente
  }


  //guarda los proximos 15 días a partir de la fecha.  
  obtenerProximosDias(){
    let date:Date = new Date();
    let dia:Date;

    for(let i = 1; i < 16; i++)
    {
      dia = new Date(date.getFullYear(), date.getMonth(), date.getDate() + i);

      if(dia.toDateString().split(" ")[0] != "Sun") // validamos que en el día si abra la clinica
      {
        this.dias.push(dia);
      }
      
    }


    
    
    
  }

  //almacena las fechas disponibles segun los proximos días. 
  filtrarFechasDisponibles(){

    //itero los proximos 15 dias
    this.dias.forEach(proximoDia=>{
        // itero los dias que atiende el Especialista
      this.disponibilidadEspecialista.forEach(diaDisponibleEspecialista=>{
          if(proximoDia.getDay() === diaDisponibleEspecialista){
            //alert('fecha disponible ')
            this.fechasDisponiblesParaTurno.push(proximoDia)
          }
      })
    })
    
   console.log('Hora actual')
   let fech = new Date()
   //let hr = `${fech.getHours()}:${fech.getMinutes()}`
   let hr2 = fech.setHours(8,0)

   console.log(fech)
 
  
  }

  obtenerHoras(diaActual:Date,minutos:number){
    // https://parzibyte.me/blog
  const inicio =  new Date(diaActual)
  inicio.setHours(8,0)

  const fin =  new Date(diaActual)
  fin.setHours(19,0)

  const UN_MINUTO_EN_MILISEGUNDOS = 1000 * 60;
  const INTERVALO = UN_MINUTO_EN_MILISEGUNDOS * minutos;// minutos variables

  for (let i = inicio; i <= fin; i = new Date(i.getTime() + INTERVALO)) {
    this.horasDisponibles.push(i)
    console.log(`${i.getHours()}:${i.getMinutes()}`);//formateadorFecha.format(i)
  }
  }

  crearTurno(){
    //Paciente seleccionado
    //Especialista seleccionado
    //Especialidad seleccionada
    //fechaTurno seleccionada
    let newTurno = new Turno()
    let idTurno = uniqid()

    if(!this.currenUser.isAdmin){
      newTurno.paciente = this.currenUser
    }else{
      newTurno.paciente = this.PacienteSeleccionado
    }
    newTurno.duracion = this.especialidadSeleccionada.disponibilidad
    newTurno.especialista = this.especialistaSeleccionado
    newTurno.especialidad=this.especialidadSeleccionada
    newTurno.fecha=this.horaSeleccionada
    newTurno.status=1 // pendiente
    newTurno.id=idTurno
  

    console.log('NEW TURNO')
    console.log(newTurno)
    //guardar en la coleccion el opbjeto
     //this.auxAdmin.uid = rta.user?.uid
     let rtaGuardarAdmin = this.apiFB.addDocumentoaColeccion(this.nameCollectionTurnos,idTurno,JSON.parse(JSON.stringify(newTurno)))
     //this.loading=false
     rtaGuardarAdmin.status? alert('Se ha creado el turno'):alert('ERROR AL CREAR EL TURNO ')
     !rtaGuardarAdmin.status && setTimeout(()=>{
      window.location.reload()
    },2000)
 
     rtaGuardarAdmin.status && this.ruteo.navigate(['/bienvenida'])    
    
  }

}
