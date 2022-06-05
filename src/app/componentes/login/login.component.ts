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

  nameColectionUsuarios:string ='UsuariosColeccion'

  listaUsuarios:any[]=[]
  formaLogin:FormGroup;

  constructor(private fb:FormBuilder,private firebaseApi:FirebaseService,private ruteo:Router ) { 
    this.firebaseApi.getCollection(this.nameColectionUsuarios).subscribe(data=>{
      this.listaUsuarios=data // mapeo de productos
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

    this.listaUsuarios.forEach(value=>{
      console.log(value)
      if(value.email == this.formaLogin.value.email && value.password == this.formaLogin.value.password){
        console.log('ENCONTRADO EN ESPECIALISTAS')
        if(value.perfil=='Especialista'){
           // si tiene el mail validado entra si no no 
           if(value.valid){
              this.logIn(value.email,value.password)
           }else{
             alert('Debe validarte un ADMINISTRADOR')
           }
        }else{
          this.logIn(value.email,value.password)
        }

        //this.logIn(value)
      }
    })
  }

  logIn(email:string,password:string){
    this.firebaseApi.login(email,password)
    .then(rta=>{
      console.log(rta)      
      this.ruteo.navigate(['/bienvenida'])
    })
    .finally(()=>{

    })

  }
}
