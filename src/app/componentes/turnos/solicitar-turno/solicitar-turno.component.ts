import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  listaEspedialidades:any[]=[]
  listaEspeciaistas:Usuario[]=[]
  nameCEspecialidades:string='especialidades'
  nameCEspecialistas:string='UsuariosColeccion'
  constructor(private apiFB:FirebaseService) {
    this.apiFB.getCollection(this.nameCEspecialistas).subscribe(res=>{
       
        let newArray:Usuario[]=[]
        res.forEach(value=>{
          if(value.perfil==='Especialista'){
            let newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotos,value.isAdmon)
            newArray.push(newUser)
          }
        })
        console.log(newArray)
        this.listaEspeciaistas=newArray
    })

    this.apiFB.getCollection(this.nameCEspecialidades).subscribe(res=>{
      this.listaEspedialidades= res
    })
   }

  ngOnInit(): void {
  }

  selectEspecialidad(){
    
  }
  getProximosDias(){
    let fecha = new Date()
  }
}
