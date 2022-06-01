import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.scss']
})
export class BienvenidaComponent implements OnInit {

  constructor(private ruteo:Router) { }

  ngOnInit(): void {
   
  }
  goToLogin(){
    this.ruteo.navigate(['login'])
  }
  goToRegistro(){
    this.ruteo.navigate(['registro'])
  }

}
