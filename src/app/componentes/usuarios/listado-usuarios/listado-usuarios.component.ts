import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  listaPacientes:any[]=[]
  listaEspecialistas:any[]=[]
  constructor(private firebaseApi:FirebaseService,) {
    this.firebaseApi.getCollection('PacientesColl').subscribe(data=>{
      this.listaPacientes=data // mapeo de productos
    }) 
    this.firebaseApi.getCollection('especialistasColl').subscribe(data=>{
      this.listaEspecialistas=data // mapeo de productos
    }) 
    
   }

  ngOnInit(): void {
  }

}
