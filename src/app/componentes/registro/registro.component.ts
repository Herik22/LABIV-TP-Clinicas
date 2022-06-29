import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  listaEspecialidades:any
  fotosPaciente:any
 
  auxUsuario:Usuario
  formPaciente:boolean;
  formEspecialista:boolean;

  formaPaciente:FormGroup;
  loading:boolean=false
  nameCollectionUsers :string ='UsuariosColeccion'

  constructor(private fb:FormBuilder,private firebaseApi:FirebaseService,private ruteo:Router ) { 
    this.firebaseApi.getCollection('especialidades').subscribe(data=>{
      this.listaEspecialidades=data // mapeo de productos
    })   
    this.formPaciente=false
    this.formEspecialista=true


    this. auxUsuario= new Usuario()

    this.formaPaciente = this.fb.group({
      'dni_':['',[Validators.required, Validators.min(1)]],
      'nombrePaciente':['',[Validators.required,]],
      'apellidoP':['',Validators.required],
      'obraSocial':['',Validators.required],
      'edadP':['',[Validators.required,Validators.min(10)]],
      'emailP':['',[Validators.required,Validators.email]],
      'passwordP':['',[Validators.required,Validators.minLength(6)]],
      'fotosP':['',[Validators.required,]],

      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })

    

  }

  ngOnInit(): void {
  }

  registrarPaciente(){

    this.loading=true
    //console.log(this.formaEspecialista.value)
    this.auxUsuario.nombre=this.formaPaciente.value.nombrePaciente
    this.auxUsuario.apellido=this.formaPaciente.value.apellidoP
    this.auxUsuario.edad=this.formaPaciente.value.edadP
    this.auxUsuario.dni=this.formaPaciente.value.dni_
    this.auxUsuario.obraSocial=this.formaPaciente.value.obraSocial
    this.auxUsuario.email=this.formaPaciente.value.emailP
    this.auxUsuario.password=this.formaPaciente.value.passwordP
    
    //console.log(this.auxUsuario)

    for(let i = 0;i<this.fotosPaciente.length;i++){
      let reader =new FileReader()
      reader.readAsDataURL(this.fotosPaciente[i])
      reader.onloadend=()=>{
       this.firebaseApi.subirImages('fotosUsuarios',`${this.auxUsuario.dni}_${this.auxUsuario.nombre}_img${i}`,reader.result)
       .then(rta=>{
        if(rta != null ){

          this.auxUsuario.fotosPerfil.push(rta)
          // crear al nuevo especialista en fb.
          if(i==1){
          this.firebaseApi.register(this.auxUsuario.email,this.auxUsuario.password)
          .then(rta=>{

            //this.firebaseApi.enviarEmail()
            //this.firebaseApi.logOut() 
 
            this.auxUsuario.uid = rta.user?.uid
            this.auxUsuario.perfil='Paciente'
            let rtaGuardarEspecilista = this.firebaseApi.addDocumentoaColeccion(this.nameCollectionUsers,`${rta.user?.uid}`,JSON.parse(JSON.stringify(this.auxUsuario)))
            //this.loading=false   
            if(rtaGuardarEspecilista.status){
              console.log('GUARDADO EN LA COLECCION')
              this.firebaseApi.enviarEmail()
              .then(value=>{
                console.log('ENVIADO EMAIL'+value)
               // this.firebaseApi.logOut()
                this.formaPaciente.reset()
                setTimeout(()=>{
                  this.ruteo.navigate(['/login'])  
                },2000)
                
              })
              .catch(err=>{
                console.log('erro enviando el email'+err)
              })
            }
          })
          .catch(err =>{
            this.loading=false   
            console.log('error al crear usuario fb'+err)
          })           
          }       
        }  
       })
       .catch(err =>{
         return false
       })
      }
    }

    
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
