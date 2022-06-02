import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {

  isAdmin:any
  isEspecialista:any
  isPaciente:any
  perfil:any
  constructor(private firebaseApi:FirebaseService,private ruteo:Router) {
    this.isAdmin = this.firebaseApi.isAdmin
    this.isEspecialista = this.firebaseApi.isEspecialista
    this.isPaciente=this.firebaseApi.isPaciente
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
