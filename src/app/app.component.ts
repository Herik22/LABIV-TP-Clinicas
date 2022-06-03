import { Component } from '@angular/core';
import { FirebaseService } from './servicios/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tpClinicas';
  isLogged:boolean=false;
  isAdministrador:boolean=false;

  constructor(private servicioLogin:FirebaseService,){
      
    this.servicioLogin.getUserLogged().subscribe(res=>{ //observables
      if(res!=null){//EVENTO
         
        console.log(res)
        console.log(this.servicioLogin.auxUser)
         this.isAdministrador=this.servicioLogin.isAdmin //this.servicioLogin.isAdministradorBeta(this.servicioLogin.auxUser)
         this.isLogged=true
      }else{
       this.isLogged=false
       this.isAdministrador=false
      }
    })    
  }
}
