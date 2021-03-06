import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/entidades/usuario';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import * as XLSX from 'xlsx'; 
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

var uniqid = require('uniqid'); 

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.scss'],
  animations:[
    trigger('transicionUp-Down',[
      state('void',style({
        transform:'translateY(-100%)',
        opacity:0
      })),
      transition(':enter',[
        animate(500,style({
          transform:'translateY(0)',
          opacity:1
        }))
      ])
    ]),
    trigger('transicionDer-Izq',[
      state('void',style({
        transform:'translateX(200%)',
        opacity:0
      })),
      transition(':enter',[
        animate(500,style({
          transform:'translateY(0)',
          opacity:1
        }))
      ])
    ]),
   
  ],
})
export class ListadoUsuariosComponent implements OnInit {

  listaUsuarios:any[]=[]

  
  nameColectionUsuarios:string ='UsuariosColeccion'
  usuarioSeleccionado:Usuario = new Usuario()
  datosListos:boolean = false
  constructor(private firebaseApi:FirebaseService,) {
    this.firebaseApi.getUsuariosColl().subscribe(data=>{
      data.forEach(value=>{
       // console.log('value.data() LISTADO USUARIOS ')
       //  console.log(value.data())
      
        this.listaUsuarios.push({...value.data()})
       // this.listaUsuarios.push({...value.data(),idCollection:value.id})
      })
      this.datosListos=true

    })    
   }
   


  updateValidate(idEspecialista:string){
    this.firebaseApi.autorizarUsuario(idEspecialista)
    .then(rta=>{  
      this.actualizarListado()   
    })
  }
  actualizarListado(){
    this.listaUsuarios=[]
    this.firebaseApi.getUsuariosColl().subscribe(data=>{
      data.forEach(value=>{
        
       // console.log({...value.data(),idCollection:value.id})
        this.listaUsuarios.push({...value.data()})
      })
    })    
  }
  generarExcel(){
    
    let nameFile = `reporteUsers_${uniqid()}`
    
    let element = document.getElementById('excel-table'); // <----- ID 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  
    XLSX.writeFile(wb, nameFile);
   
  }
  seleccionarUsuario(usuario:Usuario){
    this.usuarioSeleccionado= usuario
  }

  limpiarUsuarioSeleccionado(){

    this.usuarioSeleccionado = new Usuario()
  }
  
  ngOnInit(): void {
  }

}
