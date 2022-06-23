import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Usuario } from 'src/app/entidades/usuario';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  usuarioLoggeado:any
  uidUser:string|boolean=false
  auxUsuario:Usuario=new Usuario()
  especialidadSelected:any={"especilidaD":'','disponibilidad':0,'id':0}
  newDisponibilidad:number=0
  diasSemana:any[]=[{id:1,name:'Lunes'},{id:2,name:'Martes'},{id:3,name:'Miercoles'},{id:4,name:'Jueves'},{id:5,name:'Viernes'},{id:6,name:'Sabados'}]
  diasSeleccionados:number[]=[]


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
        value.disponibilidad = this.newDisponibilidad // seteo la nueva cantidad de minutos para el turno 
        value.diasDisponibles = this.diasSeleccionados
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
  

  /*this.apiFB.updateDuracion(this.auxUsuario.uid,{... this.auxUsuario,especialidad:newEspecialidades})
  .then(rta=>{
    console.log('editada la duracion')
    this.reLoad()
  })
  .catch(err=>{
    console.log('ocurrio un error edirtando la duracion ' + err)
  }) */ 

 

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
    
    let valido= false

    if(this.diasSeleccionados.length>0){
      
      valido = this.diasSeleccionados.includes(dia)
      if(!valido){
        alert('Dia agregado a tus horarios!')
        this.diasSeleccionados.push(dia)
      }else{
        alert('ya seleccionaste este día') 
      }
    
    }else{
      this.diasSeleccionados.push(dia)
    }
    
    console.log(this.diasSeleccionados)
 
  }

  ngOnInit(): void {
  }

}
