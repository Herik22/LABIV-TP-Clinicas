import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AnyRecord } from 'dns';
import { Especialista } from 'src/app/entidades/especialista';
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
      'nombre2':['',[Validators.required,]],
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required,Validators.min(10)]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,]],
      'foto':['',[Validators.required,]],
      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })

    

  }

  ngOnInit(): void {
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

  cargarImagenLocalEspecialista(event:any){
    this.fotoEspecialista = event.target.files[0]  
    
    //this.subirImgEspecialista('pruebaAlbum','fotoPrueba2',event.target.files[0]  )  
  }

  subirImgEspecialista(nameAlbum:string,nameFoto:string,foto:any){
    let retorno = {status:false,url:''}

    
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
