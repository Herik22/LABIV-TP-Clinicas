import { Component, OnInit,Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Usuario } from 'src/app/entidades/usuario';
import Swal from 'sweetalert2';

var uniqid = require('uniqid'); 

@Component({

  selector: 'app-form-u',
  templateUrl: './form-u.component.html',
  styleUrls: ['./form-u.component.scss']
})
export class FormUComponent implements OnInit {

  imgEspecialidadDefecto = 'https://firebasestorage.googleapis.com/v0/b/tp-clinicas.appspot.com/o/fotosEspecialidades%2Fgeneric.png?alt=media&token=39c5c3c9-962c-482f-bb92-0f7640e07067'

  listaEspecialidades:any[]=[]
  
  fotoEspecialista:any
  fotoAdmin:any

  auxUsuario:Usuario
  formaEspecialista:FormGroup;
  formaAdmin:FormGroup;
  formaNewEspecialidad:FormGroup;
  loading:boolean=false
  nameCollectionUsers :string ='UsuariosColeccion'

  agregarEspecialidad:boolean=false

  @Input() auxAdmin:Usuario 
  @Input() altaAdmin:boolean=false

  numeroRandom:number = Math.round(Math.random() * (9999 - 1111));
  numeroRandom2:number = Math.round(Math.random() * (9999 - 1111));

  constructor(private fb:FormBuilder,private firebaseApi:FirebaseService,private ruteo:Router ) {
    console.log(uniqid())
    this.firebaseApi.getCollection('especialidades').subscribe(data=>{
      this.listaEspecialidades=data // mapeo de productos
    })   
    this. auxAdmin = new Usuario()
    this.auxUsuario = new Usuario()

    this.formaEspecialista = this.fb.group({
      'nombre2':['',[Validators.required,]],
      'especialidad':['',[Validators.required,]],
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required,Validators.min(10)]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'foto':['',[Validators.required,]],
      'captcha':[''],
      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })
    this.formaAdmin = this.fb.group({
      'nombre2':['',[Validators.required,]],
      'nombre':['',[Validators.required,]],
      'apellido':['',Validators.required],
      'edad':['',[Validators.required,Validators.min(10)]],
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required,Validators.minLength(6)]],
      'foto':['',[Validators.required,]],
      'captcha':[''],
      //'pais':[this.newProducto.paisDeOrigen?.name?.common],
    })
    this.formaNewEspecialidad = this.fb.group({

      'nombreEspecialidad':['',[Validators.required,]],

    })
   
  }

  ngOnInit(): void {
  }
  imprimirForma(){
    console.log(this.formaEspecialista)
  }

  registrarEspecialista(){
    if(this.formaEspecialista.value.capcha === this.numeroRandom){
      this.loading=true
      //console.log(this.formaEspecialista.value)
      this.auxUsuario.nombre=this.formaEspecialista.value.nombre
      this.auxUsuario.apellido=this.formaEspecialista.value.apellido
      this.auxUsuario.edad=this.formaEspecialista.value.edad
      this.auxUsuario.dni=this.formaEspecialista.value.nombre2
      this.auxUsuario.email=this.formaEspecialista.value.email
      this.auxUsuario.password=this.formaEspecialista.value.password
  
      if(this.formaEspecialista.value.especialidad != 'addEspecialidad'){
        this.listaEspecialidades.forEach(value=>{
          if(value.id === this.formaEspecialista.value.especialidad){
            this.auxUsuario.especialidad.push({id:value.id,especialidad:value.especialidad,disponibilidad:30,diasDisponibles:[],img:value.img})
          }
        })
      }else{ 
        let newEspecialidad = {id:uniqid(),especialidad:this.formaNewEspecialidad.value.nombreEspecialidad,img:this.imgEspecialidadDefecto}
        let rtaGuardarEspecialidad = this.firebaseApi.addDataCollection('especialidades',newEspecialidad)
        if (rtaGuardarEspecialidad.status){
          this.auxUsuario.especialidad.push({...newEspecialidad,disponibilidad:30,diasDisponibles:[]})
        }else{
          console.log('error al guardar la especialidad') 
          return
        }  //agrego una especialidad.
        
      }
  
      let reader =new FileReader()
      reader.readAsDataURL(this.fotoEspecialista)
      reader.onloadend=()=>{
       this.firebaseApi.subirImages('fotosUsuarios',`${this.auxUsuario.dni}_${this.auxUsuario.nombre}`,reader.result)
       .then(rta=>{
        if(rta != null ){
          this.auxUsuario.fotosPerfil.push(rta) 
          console.log(this.auxUsuario)
          // Registrar al nuevo especialista en fb.
          this.firebaseApi.register(this.auxUsuario.email,this.auxUsuario.password)
          .then(rta=>{
            console.log('rta register fb ESPECIALISTA')
            console.log(rta)
            this.auxUsuario.uid = rta.user?.uid
            this.auxUsuario.perfil = 'Especialista'
            let rtaGuardarEspecilista = this.firebaseApi.addDocumentoaColeccion(this.nameCollectionUsers,`${rta.user?.uid}`,JSON.parse(JSON.stringify(this.auxUsuario)))
            if(rtaGuardarEspecilista.status){
              console.log('GUARDADO EN LA COLECCION')
              this.firebaseApi.enviarEmail()
              .then(value=>{
                console.log('ENVIADO EMAIL'+value)
                //this.firebaseApi.logOut()
                this.formaEspecialista.reset()
                setTimeout(()=>{
                  this.ruteo.navigate(['/login'])  
                },2000)
                
              })
              .catch(err=>{
                console.log('erro enviando el email'+err)
              })
  
            }
          })
          .catch(err=>{
            this.loading=false
            console.log('error al registar en fb ESPECIALISTA'+err)
          })
          
          
        }  
       })
       .catch(err =>{
         return false
       })
      }
   
    }else{
     
      Swal.fire({
        title: 'Ups!',
        text: 'Verifica el CAPTCHA y vuelve a intentarlo.',
        icon: 'error',
        timer: 4000,
        toast: true,
        backdrop: false,
        position: 'bottom',
        grow: 'row',
        timerProgressBar: true,
        showConfirmButton: false
      });
      this.numeroRandom= Math.round(Math.random() * (9999 - 1111));
    
    }
    
  
  }

  registrarAdmin(){

    this.loading=true
    //console.log(this.formaEspecialista.value)
    this.auxAdmin.nombre=this.formaAdmin.value.nombre
    this.auxAdmin.apellido=this.formaAdmin.value.apellido
    this.auxAdmin.edad=this.formaAdmin.value.edad
    this.auxAdmin.dni=this.formaAdmin.value.nombre2
    this.auxAdmin.email=this.formaAdmin.value.email
    this.auxAdmin.password=this.formaAdmin.value.password

    let reader =new FileReader()
    reader.readAsDataURL(this.fotoAdmin)
    reader.onloadend=()=>{
     this.firebaseApi.subirImages('fotosUsuarios',`${this.auxAdmin.dni}_${this.auxAdmin.nombre}`,reader.result)
     .then(rta=>{
      if(rta != null ){
        this.auxAdmin.fotosPerfil.push(rta)
        console.log(this.auxAdmin)
        // Registrar al nuevo especialista en fb.
        this.firebaseApi.register(this.auxAdmin.email,this.auxAdmin.password)
        .then(rta=>{
          this.auxAdmin.uid=rta.user?.uid
          this.auxAdmin.isAdmin = true
          console.log('rta register fb ADMIN')
          console.log(rta)

          //this.auxAdmin.uid = rta.user?.uid
          let rtaGuardarAdmin = this.firebaseApi.addDocumentoaColeccion(this.nameCollectionUsers,`${rta.user?.uid}`,JSON.parse(JSON.stringify(this.auxAdmin)))
        //this.loading=false
        if(rtaGuardarAdmin.status){
          console.log('GUARDADO EN LA COLECCION')
          this.firebaseApi.enviarEmail()
          .then(value=>{
            console.log('ENVIADO EMAIL'+value)
            //this.firebaseApi.logOut()
            this.formaEspecialista.reset()
            setTimeout(()=>{
              this.ruteo.navigate(['/login']) 
            },2000)
            
          })
          .catch(err=>{
            console.log('erro enviando el email'+err)
          })
        } 
        })
        .catch(err=>{
          this.loading=false
          console.log('error al registar en fb ESPECIALISTA'+err)
        })
        
      }  
     })
     .catch(err =>{
       return false
     })
    }
  }

  habilitarNewEspecialidad(){
    this.agregarEspecialidad= !this.agregarEspecialidad
  }

  cargarImagenLocalEspecialista(event:any){
    this.fotoEspecialista = event.target.files[0]  
    
  }
  cargarImagenLocalAdmin(event:any){
    this.fotoAdmin = event.target.files[0]  
    
  }
}
