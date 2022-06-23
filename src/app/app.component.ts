import { Component } from '@angular/core';
import { FirebaseService } from './servicios/firebase.service';
import { Usuario } from './entidades/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currenUser:Usuario= new Usuario()
  title = 'tpClinicas';
  isLogged:boolean=false;
  isAdministrador:boolean=false;
  perfil:string=''

  constructor(private servicioLogin:FirebaseService,){
      
    this.servicioLogin.getUserLogged().subscribe( res=>{ //observables
      if(res!=null){//EVENTO

        this.servicioLogin.getUser(res.uid).subscribe(resUSER=>{
          console.log('USUARIO ACTUAL EN EL SISTEMA')
          let objRta = resUSER.data()
           console.log(resUSER.data())

          this.isAdministrador= objRta?.['isAdmin']
          this.isLogged=true 
          this.perfil = objRta?.['perfil']

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
          this.currenUser.pacientesAtendidos = objRta?.['pacientesAtendidos']


         
      })
    }else{
      this.isAdministrador=false
      this.isLogged=false
    }
  }
  )    
      
  }




}
