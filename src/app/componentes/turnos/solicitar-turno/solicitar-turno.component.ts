import { Component, OnInit } from '@angular/core';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { throws } from 'assert';
import { normalize } from 'path';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
var uniqid = require('uniqid'); 
import Swal from 'sweetalert2';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss'],
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
export class SolicitarTurnoComponent implements OnInit {
  
  currenUser:Usuario = new Usuario()

  // LISTADOS  Especialistas,Especialidades,proximos15 Días, Fechas disponi
  dias:Date[]=[] // proximos 15 dias apartir de la fecha
  listaPacientes:Usuario[]=[]
  listaEspedialidades:any[]=[] //especialidades
  listaEspeciaistas:Usuario[]=[] //especialista
  listaEspecialistasxEspecialidad:Usuario[]=[]

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
  especialidadSeleccionadaActualmente:any = false
  pacienteSelected:boolean = false
  isEspecialidadSelected:boolean = false
  horaSelected:boolean=false

  especialistaSeleccionado:Usuario = new Usuario()
  especialistaSeleccionado2:Usuario = new Usuario()
  isEspecialistaSeleccionado2:boolean = false
  especialidadSeleccionada:any
  especialidadSeleccionada2:any
  PacienteSeleccionado:Usuario = new Usuario()
  fechaTurnoSelecciada:Date=new Date()
  horaSeleccionada:Date = new Date ()

  duracionTurno:number = 0

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

   this.isEspecialistaSeleccionado2=true

    this.especialistaSeleccionado2= item
    
     //accedo a la lista de especialidades del especialista seleccionado y verifico si tiene disponibilidad 
      this.especialistaSeleccionado2.especialidad.forEach(value=>{
        if (value.id === this.especialidadSeleccionadaActualmente.id){
            if(value.diasDisponibles.length>0){
              this.disponibilidadEspecialista = value.diasDisponibles
              this.duracionTurno = value.disponibilidad
            }else{
              this.tieneDiasDisponibles=false
              Swal.fire({
                title: 'Ups!',
                text: 'EL ESPECIALISTA NO TIENE DISPONIBILIDAD HORARIA',
                icon: 'info',
                timer: 4000,
                toast: true,
                backdrop: false,
                position: 'bottom',
                grow: 'row',
                timerProgressBar: true,
                showConfirmButton: false
              });
            }
        }
      })

      this.filtrarFechasDisponibles()
  }

  seleccionarEspecialidad2(item:any){
    //al seleccionar una especialidad listo los especialistas que tengas esa especialidad 

   // this.isEspecialidadSelected=true

    this.especialidadSeleccionada2=true
    this.especialidadSeleccionadaActualmente = item
    
    let listaAuxEspecialistas:Usuario[]=[]
    //recorro la lsta de especialistas
    this.listaEspeciaistas.forEach(value=>{
      //recorro la lista de especialidades del especialista actual en la iteracion
      value.especialidad.forEach(especialidadEspcialista=>{

        if(especialidadEspcialista.id === item.id){
          listaAuxEspecialistas.push(value)
        }
      })
      
    })
    this.listaEspecialistasxEspecialidad = listaAuxEspecialistas

   

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

          Swal.fire({
            title: 'Ups!',
            text: 'EL ESPECIALISTA NO TIENE DISPONIBILIDAD HORARIA',
            icon: 'info',
            timer: 4000,
            toast: true,
            backdrop: false,
            position: 'bottom',
            grow: 'row',
            timerProgressBar: true,
            showConfirmButton: false
          });
        }

        
      }
    })

    this.filtrarFechasDisponibles()

   
  }

  seleccionarFechaTurno(dia:Date){

    this.fechaTurnoSelecciada = dia
    this.obtenerHoras(dia,this.duracionTurno)
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
    newTurno.duracion = this.especialidadSeleccionadaActualmente.disponibilidad
    newTurno.especialista = this.especialistaSeleccionado2
    newTurno.especialidad=this.especialidadSeleccionadaActualmente
    newTurno.fecha=this.horaSeleccionada
    newTurno.status=1 // pendiente
    newTurno.id=idTurno
  

    console.log('NEW TURNO')
    console.log(newTurno)
    //guardar en la coleccion el opbjeto
     //this.auxAdmin.uid = rta.user?.uid
     let rtaGuardarAdmin = this.apiFB.addDocumentoaColeccion(this.nameCollectionTurnos,idTurno,JSON.parse(JSON.stringify(newTurno)))
     //this.loading=false
     rtaGuardarAdmin.status
     ?
      Swal.fire({
      title: 'ENHORABUENA!',
      text: 'SE HA CREADO EL TURNO',
      icon: 'success',
      timer: 4000,
      toast: true,
      backdrop: false,
      position: 'bottom',
      grow: 'row',
      timerProgressBar: true,
      showConfirmButton: false
    })
    :
    Swal.fire({
      title: 'UPS!',
      text: 'NO SE HA PODIDO CREAR EL TURNO',
      icon: 'error',
      timer: 4000,
      toast: true,
      backdrop: false,
      position: 'center',
      grow: 'row',
      timerProgressBar: true,
      showConfirmButton: false
    })
     !rtaGuardarAdmin.status && setTimeout(()=>{
      window.location.reload()
    },2000)
 
     rtaGuardarAdmin.status && this.ruteo.navigate(['/bienvenida'])    
    
  }

}
