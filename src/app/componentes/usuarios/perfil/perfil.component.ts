import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Usuario } from 'src/app/entidades/usuario';
import Swal from 'sweetalert2';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
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
export class PerfilComponent implements OnInit {

  usuarioLoggeado:any
  uidUser:string|boolean=false
  auxUsuario:Usuario=new Usuario()
  especialidadSelected:any={"especilidaD":'','disponibilidad':0,'id':0}
  newDisponibilidad:number=30
  diasSemana:any[]=[{id:1,name:'Lunes'},{id:2,name:'Martes'},{id:3,name:'Miercoles'},{id:4,name:'Jueves'},{id:5,name:'Viernes'},{id:6,name:'Sabados'}]
  diasSeleccionados:number[]=[]

  seleccionoDia:boolean = false

  constructor(private apiFB:FirebaseService) { 

    this.apiFB.getUserLogged().subscribe(res=>{ //observables
      this.apiFB.getUser(res?.uid).subscribe(resUser=>{
       let objFB =resUser.data()
       this.auxUsuario.uid = objFB?objFB['uid']:0
       this.auxUsuario.nombre = objFB?objFB['nombre']:''
       this.auxUsuario.apellido = objFB?objFB['apellido']:''
       this.auxUsuario.edad = objFB?objFB['edad']:0
       this.auxUsuario.dni = objFB?objFB['dni']:0
       this.auxUsuario.obraSocial = objFB?objFB['obraSocial']!= undefined?objFB['obraSocial']:'':''
       this.auxUsuario.especialidad = objFB?objFB['especialidad']:''
       this.auxUsuario.email = objFB?objFB['email']:''
       this.auxUsuario.fotosPerfil = objFB?objFB['fotosPerfil']:[]
       this.auxUsuario.perfil = objFB?objFB['perfil']:''
       this.auxUsuario.isAdmin = objFB?objFB['isAdmin']:false
       this.auxUsuario.valid = objFB?objFB['valid']:0
       this.auxUsuario.password = objFB?objFB['password']:''


      
      this.especialidadSelected = this.auxUsuario.especialidad[0]
       //console.log(this.auxUsuario)
        
      })
      
    })
  }

  selectedEspecialidad(id:string){
    this.auxUsuario.especialidad.forEach(value=>{
      if(value.id === id){
        this.especialidadSelected=value // obtengo la especialidad seleccionada
      }
    })
  }

  actualizarDuracionEspecialidad(idEspecialidad:string){

    // el especiaño
    let specialidades = this.auxUsuario.especialidad // obtengo el listado de especialidades del usuarios actual 
    
    let newEspecialidades = specialidades.map(value=>{ //obtengo un nuievo array de especialidades segun 
      
      
      if(idEspecialidad === value.id){ // obtengo la especialidad que quiero modificar. 
        if(this.seleccionoDia){
          value.disponibilidad = this.newDisponibilidad // seteo la nueva cantidad de minutos para el turno 
         value.diasDisponibles = this.diasSeleccionados
        }else{
          value.disponibilidad = this.newDisponibilidad
        }
      
      }
      return value
  })

  this.apiFB.updaterUsuarioProperty(this.auxUsuario.uid,{especialidad:newEspecialidades})
  .then(rta=>{
    console.log('editada la duracion')
    this.reLoad()
  })
  .catch(err=>{
    console.log('ocurrio un error edirtando la especialidad ' + err)
  })
  
  }

  reLoad(){
    this.apiFB.getUserLogged().subscribe(res=>{ //observables
      this.apiFB.getUser(res?.uid).subscribe(resUser=>{
       let objFB =resUser.data()
       this.auxUsuario.uid = objFB?objFB['uid']:0
       this.auxUsuario.nombre = objFB?objFB['nombre']:''
       this.auxUsuario.apellido = objFB?objFB['apellido']:''
       this.auxUsuario.edad = objFB?objFB['edad']:0
       this.auxUsuario.dni = objFB?objFB['dni']:0
       this.auxUsuario.obraSocial = objFB?objFB['obraSocial']:''
       this.auxUsuario.especialidad = objFB?objFB['especialidad']:''
       this.auxUsuario.email = objFB?objFB['email']:''
       this.auxUsuario.fotosPerfil = objFB?objFB['fotosPerfil']:[]
       this.auxUsuario.perfil = objFB?objFB['perfil']:''
       this.auxUsuario.isAdmin = objFB?objFB['isAdmin']:false
       this.auxUsuario.valid = objFB?objFB['valid']:0


      
       console.log(this.auxUsuario)
        
      })
      
    })
  }
  seleccionarDia(dia:number){
    
    this.seleccionoDia=true
    let valido= false

    if(this.diasSeleccionados.length>0){
      
      valido = this.diasSeleccionados.includes(dia)
      if(!valido){
        Swal.fire({
          title: 'listo!',
          text: 'Dia agregado a tus horarios!',
          icon: 'success',
          timer: 1000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        })
        this.diasSeleccionados.push(dia)
      }else{
        Swal.fire({
          title: 'Ups!',
          text: 'Ya seleccionaste este día!',
          icon: 'warning',
          timer: 1000,
          toast: true,
          backdrop: false,
          position: 'bottom',
          grow: 'row',
          timerProgressBar: true,
          showConfirmButton: false
        })
       
      }
    
    }else{
      this.diasSeleccionados.push(dia)
    }
    
    console.log(this.diasSeleccionados)
 
  }

  ngOnInit(): void {
  }

}
