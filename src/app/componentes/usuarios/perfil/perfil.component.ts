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

      
      this.especialidadSelected = this.auxUsuario.especialidad[0]
       //console.log(this.auxUsuario)
        
      })
      
    })
  }

  selectedEspecialidad(id:string){
    this.auxUsuario.especialidad.forEach(value=>{
      if(value.id === id){
        this.especialidadSelected=value
      }
    })
  }

  actualizarDuracionEspecialidad(idEspecialidad:string){
    let specialidades = this.auxUsuario.especialidad
    
    let newEspecialidades = specialidades.map(value=>{
      
      if(idEspecialidad === value.id){
        value.disponibilidad = this.newDisponibilidad
      }
      return value
  })

  
  this.apiFB.updateDuracion(this.auxUsuario.uid,{... this.auxUsuario,especialidad:newEspecialidades})
  .then(rta=>{
    console.log('editada la duracion')
    this.reLoad()
  })
  .catch(err=>{
    console.log('ocurrio un error edirtando la duracion ' + err)
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
  ngOnInit(): void {
  }

}
