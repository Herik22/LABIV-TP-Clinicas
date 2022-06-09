import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Especialista } from 'src/app/entidades/especialista';
import { Paciente } from 'src/app/entidades/paciente';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  listaEspecialidades:any

  fotosPaciente:any
  fotoEspecialista:any

  newEspecialista:Especialista
  newPaciente:Paciente

  formPaciente:boolean;
  formEspecialista:boolean;

  formaEspecialista:FormGroup;
  formaPaciente:FormGroup;

  constructor(private fb:FormBuilder,private firebaseApi:FirebaseService,private ruteo:Router ) { 
    this.firebaseApi.getCollection('especialidades').subscribe(data=>{
      this.listaEspecialidades=data // mapeo de productos
    })   
    this.formPaciente=false
    this.formEspecialista=true
    this.newEspecialista= new Especialista()
    this.newPaciente= new Paciente()
    this.formaEspecialista = this.fb.group({
      'nombre2':['',[Validators.required,]],
      'especialidad':['',[Validators.required,]],
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required,Validators.min(10)]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,]],
      'foto':['',[Validators.required,]],
      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })
    this.formaPaciente = this.fb.group({
      'dni_':['',[Validators.required, Validators.min(1)]],
      'nombrePaciente':['',[Validators.required,]],
      'apellidoP':['',Validators.required],
      'obraSocial':['',Validators.required],
      'edadP':['',[Validators.required,Validators.min(10)]],
      'emailP':['',[Validators.required,Validators.email]],
      'passwordP':['',[Validators.required,]],
      'fotosP':['',[Validators.required,]],

      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })

    

  }

  ngOnInit(): void {
  }

  registrarPaciente(){

    //console.log(this.formaEspecialista.value)
    this.newPaciente.nombre=this.formaPaciente.value.nombrePaciente
    this.newPaciente.apellido=this.formaPaciente.value.apellidoP
    this.newPaciente.edad=this.formaPaciente.value.edadP
    this.newPaciente.dni=this.formaPaciente.value.dni_
    this.newPaciente.obraSocial=this.formaPaciente.value.obraSocial
    this.newPaciente.email=this.formaPaciente.value.emailP
    this.newPaciente.password=this.formaPaciente.value.passwordP
    
    //console.log(this.newPaciente)

    for(let i = 0;i<this.fotosPaciente.length;i++){
      let reader =new FileReader()
      reader.readAsDataURL(this.fotosPaciente[i])
      reader.onloadend=()=>{
       this.firebaseApi.subirImages('fotosPacientes',`${this.newPaciente.dni}_${this.newPaciente.nombre}_img${i}`,reader.result)
       .then(rta=>{
        if(rta != null ){

          this.newPaciente.fotosPerfil.push(rta)
          // crear al nuevo especialista en fb.
          if(i==1){
          let rtaGuardarEspecilista = this.firebaseApi.addDataCollection('PacientesColl',JSON.parse(JSON.stringify(this.newPaciente)))
          rtaGuardarEspecilista.status && this.formaEspecialista.reset()
          rtaGuardarEspecilista.status && this.ruteo.navigate(['/login'])          
          }       
        }  
       })
       .catch(err =>{
         return false
       })
      }
    }

    
  }

  registrarEspecialista(){

    
    //console.log(this.formaEspecialista.value)
    this.newEspecialista.nombre=this.formaEspecialista.value.nombre
    this.newEspecialista.apellido=this.formaEspecialista.value.apellido
    this.newEspecialista.edad=this.formaEspecialista.value.edad
    this.newEspecialista.dni=this.formaEspecialista.value.nombre2
    this.newEspecialista.especialidad=this.formaEspecialista.value.especialidad
    this.newEspecialista.email=this.formaEspecialista.value.email
    this.newEspecialista.password=this.formaEspecialista.value.password

    let reader =new FileReader()
    reader.readAsDataURL(this.fotoEspecialista)
    reader.onloadend=()=>{
     this.firebaseApi.subirImages('fotosEspecialista',`${this.newEspecialista.dni}_${this.newEspecialista.nombre}`,reader.result)
     .then(rta=>{
      if(rta != null ){
        this.newEspecialista.fotoPerfil = rta
        console.log(this.newEspecialista)
        // crear al nuevo especialista en fb.
        let rtaGuardarEspecilista = this.firebaseApi.addDataCollection('especialistasColl',JSON.parse(JSON.stringify(this.newEspecialista)))
        rtaGuardarEspecilista.status && this.formaEspecialista.reset()
        rtaGuardarEspecilista.status && this.ruteo.navigate(['/login'])    
      }  
     })
     .catch(err =>{
       return false
     })
    }
  }


  correctCaptcha (response:any) {
    alert(response);
};

  cargarImagenLocalEspecialista(event:any){
    this.fotoEspecialista = event.target.files[0]  
    
  }
  cargarImagenesLocalPaciente(event:any){
    this.fotosPaciente = event.target.files
    console.log(typeof(this.fotosPaciente))
    console.log(this.fotosPaciente)

  }

  showFormPaciente(){
    this.formEspecialista=false
    this.formPaciente=true
  }
  showFormEspecialista(){
    this.formEspecialista=true
    this.formPaciente=false
  }

}
