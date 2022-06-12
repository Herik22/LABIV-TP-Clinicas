import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { setInterval } from 'timers';
import { threadId } from 'worker_threads';
@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.scss']
})
export class TopNavBarComponent implements OnInit {

  @Input() isLogged:boolean=false
  @Input() isAdmin:boolean=false


  constructor(private ruteo:Router,private apiFB:FirebaseService) {


   }

  ngOnInit(): void {
  }
  
  goToTurnos(link:string){
    this.ruteo.navigate([`/turnos/${link}`])
  }
 
  goToUsuarios(link:string){
    this.ruteo.navigate([`/usuarios/${link}`])
  }
 
  closeSesion(){
    this.apiFB.logOut()
    this.ruteo.navigate(['bienvenida'])
  }
}
