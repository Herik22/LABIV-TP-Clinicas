import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  isLogged:boolean=false;
  isAdministrador:boolean=false;
  constructor(private servicioLogin:FirebaseService) {
    this.servicioLogin.getUserLogged().subscribe(res=>{ //observables
      if(res!=null){//EVENTO     
         this.isAdministrador=this.servicioLogin.isAdministrador(res)
         this.isLogged=true
      }else{
       this.isLogged=false
       this.isAdministrador=false
      }
  })  
   }
}