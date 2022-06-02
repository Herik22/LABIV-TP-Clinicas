import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  listaPacientes:any[]=[]
  listaEspecialistas:any[]=[]

  formaLogin:FormGroup;

  constructor(private fb:FormBuilder,private firebaseApi:FirebaseService,private ruteo:Router ) { 
    this.firebaseApi.getCollection('PacientesColl').subscribe(data=>{
      this.listaPacientes=data // mapeo de productos
    }) 
    this.firebaseApi.getCollection('especialistasColl').subscribe(data=>{
      this.listaEspecialistas=data // mapeo de productos
    }) 
    this.formaLogin = this.fb.group({
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,]],
    })
  }

  ngOnInit(): void {
  }

  verificarLogin(){
    console.log(
      this.formaLogin.value
    )
    let encontrado = false

    this.listaEspecialistas.forEach(value=>{
      if(value.email == this.formaLogin.value.email && value.password == this.formaLogin.value.password){
        console.log('ENCONTRADO EN ESPECIALISTAS')
        console.log(value)
        this.firebaseApi.isEspecialistafn(value)
        this.firebaseApi.isAdministrador(value)
        encontrado=true
        
        this.ruteo.navigate(['/bienvenida'])

      }
    })
    
   !encontrado && this.listaPacientes.forEach(value=>{
      if(value.email == this.formaLogin.value.email && value.password == this.formaLogin.value.password){
        console.log('ENCONTRADO EN PACIENTES')
        console.log(value)
        this.firebaseApi.isPacientefn(value)
        encontrado=true
        this.ruteo.navigate(['/bienvenida'])
      }
    })

    !encontrado && alert('NO SE ENCONTRO COINCIDENCIA.')

  }

}
