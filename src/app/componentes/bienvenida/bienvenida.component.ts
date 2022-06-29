import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {

  isLogged:boolean=false;
  constructor(private firebaseApi:FirebaseService,private ruteo:Router) {
    this.firebaseApi.getUserLogged().subscribe(user=>{
      if(user!=null){
        this.isLogged=true
      }else{
        this.isLogged=false
      }
    })
   }

  
  ngOnInit(): void {
   
  }


  goToLogin(){
    this.ruteo.navigate(['login'])
  }
  goToRegistro(){
    this.ruteo.navigate(['registro'])
  }

}
