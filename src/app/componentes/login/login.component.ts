import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/entidades/usuario';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  nameColectionUsuarios:string ='UsuariosColeccion'

  listaUsuarios:any[]=[]
  formaLogin:FormGroup;
  nameLogsCollection :string='logsCollecion'
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
      if(value.email == this.formaLogin.value.email && value.password == this.formaLogin.value.password){
        
        if(value.perfil=='Especialista'){
           // si tiene el mail validado entra si no no 
           if(value.valid){
            console.log('creando log como :especialista')
              this.crearLog(value)
              this.logIn(value.email,value.password)
           }else{
             
             Swal.fire({
              title: 'Ups!',
              text: 'Debe validarte un ADMINISTRADOR',
              icon: 'info',
              timer: 4000,
              toast: true,
              backdrop: false,
              position: 'bottom',
              grow: 'row',
              timerProgressBar: true,
              showConfirmButton: false
            });
           }
        }else{
          console.log('creando log como')
          this.crearLog(value)
          this.logIn(value.email,value.password)
        }
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

  accesoRapido(perfil:number){
    switch(perfil){
      case 1:
        let email:HTMLElement | null = document.getElementById('floatingInput')
        if(email != null){
            email.nodeValue='hrh'
        } 
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }

  }
  crearLog(usuario:any){
    let hoy = new Date();
    let horario = hoy.getHours() < 10 ? '0'+hoy.getHours() + ':' : hoy.getHours() + ':';
    horario += hoy.getMinutes() < 10 ? '0'+hoy.getMinutes() + ':' : hoy.getMinutes() + ':';
    horario += hoy.getSeconds() < 10 ? '0'+hoy.getSeconds() : hoy.getSeconds();
    
    let datos = {
      usuario: usuario.nombre + " " + usuario.apellido,
      email: usuario.email,
      perfil: usuario.perfil?usuario.perfil:'',
      isAdmin: usuario.isAdmin,
      fecha: hoy.toDateString(),
      horario: horario,
      id:usuario.uid
    }
    console.log('Datos log',datos)

    let rtaLog = this.firebaseApi.addDataCollection(this.nameLogsCollection,datos) 
    console.log(rtaLog) 
    //this.fireStoreService.agregarLogIngreso("LogIngresos",datos);
  }
}
