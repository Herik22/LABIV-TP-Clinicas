import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent implements OnInit {

  listaEspedialidades:any[]=[]
  listaEspeciaoistas:any[]=[]
  nameCEspecialidades:string=''
  nameCEspecialistas:string='UsuariosColeccion'
  constructor(private apiFB:FirebaseService) {
    this.apiFB.getCollection(this.nameCEspecialistas).subscribe(res=>{
       
        let newArray:any[]=[]
        res.forEach(value=>{
          if(value.perfil!='Especialista'){
            newArray.push(value)
          }
        })
        console.log(newArray)
    })
   }

  ngOnInit(): void {
  }

  getProximosDias(){
    let fecha = new Date()
  }
}
