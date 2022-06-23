import { Component, OnInit,Input } from '@angular/core';
import { Usuario } from 'src/app/entidades/usuario';
import { Turno } from 'src/app/entidades/turnos';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { HistoriaClinica } from 'src/app/entidades/historiaClinica';
import { throws } from 'assert';

@Component({
  selector: 'app-listado-historiales-clinicos',
  templateUrl: './listado-historiales-clinicos.component.html',
  styleUrls: ['./listado-historiales-clinicos.component.scss']
})
export class ListadoHistorialesClinicosComponent implements OnInit {

  currenUser:Usuario = new Usuario()
  historialesClinicos:HistoriaClinica[]=[]
  tieneHistorial:boolean = false
  loading:boolean = false
  @Input() idPaciente:string|undefined

  //recibir el id del paciente por input 
  //segun el id listo los historiales 
  constructor(private apiFB:FirebaseService) { 

    this.loading=true
    /*this.apiFB.getUserLogged().subscribe(res=>{
      if(res!=null){//EVENTO
         this.apiFB.getUser(res.uid).subscribe(resUSER=>{
    
          let objRta = resUSER.data()
          
          this.currenUser.uid = objRta?.['uid']
          this.currenUser.nombre = objRta?.['nombre']
          this.currenUser.apellido = objRta?.['apellido']
          this.currenUser.edad = objRta?.['edad']
          this.currenUser.dni = objRta?.['dni']
          this.currenUser.obraSocial = objRta?.['obraSocial']
          this.currenUser.especialidad = objRta?.['especialidad']
          this.currenUser.email = objRta?.['email']
          this.currenUser.fotosPerfil = objRta?.['fotosPerfil']
          this.currenUser.perfil = objRta?.['perfil']
          this.currenUser.isAdmin = objRta?.['isAdmin']
          this.currenUser.historialClinico = objRta?.['historialClinico']

          if(this.currenUser.historialClinico.length>0){
            this.tieneHistorial=true
            this.currenUser.historialClinico.forEach(value=>{          
              let auxHistoriaClinica:HistoriaClinica = value 
              this.historialesClinicos.push(auxHistoriaClinica)
            })
          }
          

          
          
         })
      }else{
      }
    })  */
    console.log('this.idPaciente  previo al SETTIMEOUT')
    console.log(this.idPaciente)
    setTimeout(() => {
      this.loading=false
      console.log('this.idPaciente EN EL  SETTIMEOUT')
    console.log(this.idPaciente)
      this.idPaciente? this.traerPaciente(this.idPaciente):null  
    }, 2500);
   
  }

  traerPaciente(id:string){
    this.apiFB.getUser(id).subscribe(resUSER=>{
    
      let objRta = resUSER.data()
      
      this.currenUser.uid = objRta?.['uid']
      this.currenUser.nombre = objRta?.['nombre']
      this.currenUser.apellido = objRta?.['apellido']
      this.currenUser.edad = objRta?.['edad']
      this.currenUser.dni = objRta?.['dni']
      this.currenUser.obraSocial = objRta?.['obraSocial']
      this.currenUser.especialidad = objRta?.['especialidad']
      this.currenUser.email = objRta?.['email']
      this.currenUser.fotosPerfil = objRta?.['fotosPerfil']
      this.currenUser.perfil = objRta?.['perfil']
      this.currenUser.isAdmin = objRta?.['isAdmin']
      this.currenUser.historialClinico = objRta?.['historialClinico']

      if(this.currenUser.historialClinico.length>0){
        this.tieneHistorial=true
        this.currenUser.historialClinico.forEach(value=>{          
          let auxHistoriaClinica:HistoriaClinica = value 
          this.historialesClinicos.push(auxHistoriaClinica)
        })
      }
      

      
      
     })
  }
  ngOnInit(): void {
  }

}
