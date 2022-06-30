import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'


@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss'],
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
