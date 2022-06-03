import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss']
})
export class ListadoUsuariosComponent implements OnInit {

  listaUsuarios:any[]=[]

  
  nameColectionUsuarios:string ='UsuariosColeccion'
  constructor(private firebaseApi:FirebaseService,) {
    this.firebaseApi.getUsuariosColl().subscribe(data=>{
      data.forEach(value=>{
        this.listaUsuarios.push({...value.data(),idCollection:value.id})
      })
    })    
   }
   
  updateValidate(idEspecialista:string){
    this.firebaseApi.autorizarUsuario(idEspecialista)
    .then(rta=>{  
      this.actualizarListado()   
    })
  }
  actualizarListado(){
    this.listaUsuarios=[]
    this.firebaseApi.getUsuariosColl().subscribe(data=>{
      data.forEach(value=>{
        
        console.log({...value.data(),idCollection:value.id})
        this.listaUsuarios.push({...value.data(),idCollection:value.id})
      })
    })    
  }
  ngOnInit(): void {
  }

}
