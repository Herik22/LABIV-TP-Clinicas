import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import { HistoriaClinica } from 'src/app/entidades/historiaClinica';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { Console } from 'console';
import { normalize } from 'path';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

var uniqid = require('uniqid'); 
@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.scss'],
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
export class MisTurnosComponent implements OnInit {


  auxHistoriaClinica = new HistoriaClinica()
  auxCalificacion:number=0
  rechazarTurno:boolean=false

  currenUser:Usuario = new Usuario()
  nameCollectionTurnos:string='TurnosColeccion'
  listaTurnos:Turno[]=[]
  listaAuxTurnos:Turno[]=[]
  turnosCargados:boolean = false

  listaEspedialidades:any[]=[] //especialidades
  listaEspeciaistas:Usuario[]=[] //especialista
  listaPacientes:Usuario[]=[] //especialista
  nameCEspecialidades:string='especialidades'
  nameCollectionUsers:string='UsuariosColeccion'
  nameCollectionHistoriaClinina:string='HistoriaClinicaColeccion'

  switchFiltroPaciente:boolean = false
  switchFiltroEspecialista:boolean = false
  switchFiltroEspecialidades:boolean = false
  switchActivarFiltros:boolean = false
  switchFiltroGenerico:boolean=false
  filtroAplicado:boolean = false
  turnoSelectedForComentary:Turno = new Turno()
  formaComentario:FormGroup;
  formaEncuesta:FormGroup;
  formaCalificacion:FormGroup
  formaFinalizarTurno:FormGroup
  formaHistorialClinico:FormGroup

  forma1erAgregado:FormGroup
  forma2erAgregado:FormGroup
  forma3erAgregado:FormGroup
  add1erDatoDinamico:boolean = false
  add2doDatoDinamico:boolean = false
  add3roDatoDinamico:boolean = false
  cantCamposNews = 0
  palabraBuscar:any
  
  constructor(private fb:FormBuilder,private apiFB:FirebaseService) {
    this.formaComentario = this.fb.group({
      'comentario':['',[Validators.required,]],
     
    })
    this.formaEncuesta = this.fb.group({

      'opinion':['',[Validators.required,]],
      'sugerencia':['',[Validators.required,]],
     
    })
    this.formaCalificacion = this.fb.group({
      'comentarioCalificacion':['',[Validators.required,]],
    })
    this.formaFinalizarTurno = this.fb.group({
      'comentario':['',[Validators.required,]],
      'diagnostico':['',[Validators.required,]],
    })
    this.formaHistorialClinico = this.fb.group({
      'altura':['',[Validators.required,]],
      'peso':['',[Validators.required,]],
      'temperatura':['',[Validators.required,]],
      'presion':['',[Validators.required,]],
    })
    this.forma1erAgregado = this.fb.group({
      'clave1':['',[Validators.required,]],
      'valor1':['',[Validators.required,]],
    })
    this.forma2erAgregado = this.fb.group({
      'clave2':['',[Validators.required,]],
      'valor2':['',[Validators.required,]],
    })
    this.forma3erAgregado = this.fb.group({
      'clave3':['',[Validators.required,]],
      'valor3':['',[Validators.required,]],
    })
    

    this.apiFB.getUserLogged().subscribe(res=>{ //observables
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
          this.currenUser.valid = objRta?.['valid']
          this.currenUser.historialClinico = objRta?.['historialClinico']
          this.currenUser.pacientesAtendidos = objRta?.['pacientesAtendidos']
          
          
          
          

          this.apiFB.getCollection(this.nameCollectionTurnos).subscribe(res=>{
       
            let newArray:Turno[]=[]
            res.forEach(value=>{
      
                let newTurno = new Turno()
                newTurno.duracion = value.duracion
                newTurno.encuestaCompletada= value.encuestaCompletada
                newTurno.encuesta=value.encuesta
               /* newTurno.especialista = new Usuario(value.especialista.nombre,value.especialista.apellido,value.especialista.edad,value.especialista.dni,value.especialista.email,'',value.especialista.foto) 
                newTurno.especialista.obraSocial = value.especialista.obraSocial
                newTurno.especialista.uid = value.especialista.uid
                newTurno.especialista.perfil = value.especialista.perfil 
                */ 
                newTurno.especialidad= value.especialidad
                newTurno.especialista = value.especialista
                newTurno.paciente = value.paciente
                newTurno.fecha = new Date(value.fecha) 
                newTurno.status= value.status // pendiente
                newTurno.id= value.id
                newTurno.calificacion=value.calificacion
                newTurno.comentario=value.comentario
                newTurno.resenia=value.resenia
                newTurno.historialGenerado = value.historialGenerado
                

                if(this.currenUser.perfil === 'Especialista'){
                  if(newTurno.especialista.uid === this.currenUser.uid){
                    newArray.push(newTurno)
                  }  
                }else if(this.currenUser.perfil === 'Paciente'){
                  if(newTurno.paciente.uid === this.currenUser.uid){
                    newArray.push(newTurno)
                  } 
                }
                    
            })
            
            this.listaTurnos=newArray
            this.listaAuxTurnos=newArray
            this.turnosCargados=true
      
        })
         })
      }else{
    
      }
    }) 
    
    this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
       
      let newArray:Usuario[]=[]
      let newArrayPacientes:Usuario[]=[]
      res.forEach(value=>{
        if(value.perfil==='Especialista'){ 
          const newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
          newUser.especialidad = value.especialidad
          newUser.uid = value.uid
          newUser.pacientesAtendidos = value.pacientesAtendidos
          newArray.push(newUser)
        }else if(value.perfil==='Paciente'){
          const newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
          newUser.obraSocial = value.obraSocial
          newUser.perfil= value.perfil
          newUser.uid = value.uid
          newUser.historialClinico = value.historialClinico

          newArrayPacientes.push(newUser)
        }
      }) 

    this.listaEspeciaistas=newArray
    this.listaPacientes=newArrayPacientes
    })
    this.apiFB.getCollection(this.nameCEspecialidades).subscribe(res=>{
      this.listaEspedialidades= res
    })

   }

   obtenerEstado(status:number){
    let estado = 'FALSO'

    switch(status){
      case 1:
        estado = 'PENDIENTE ⏰'
        break;
      case 2:
        estado = '👌🏼 ACEPTADO 👌🏼 '
        break;
      case 3:
        estado = ' ✅ REALIZADO ✅ '
        break;
      case 4:
          estado = ' ❌ RECHAZADO ❌'
          break;
      case 6:
        estado = '🚨 CANCELADO 🚨'
        break;     
    }
    return estado

  }

  activarFiltrosUnicos(){
    this.switchActivarFiltros =  !this.switchActivarFiltros 
   }
 
  activarFiltrosGenerico(filtro:string){
    switch(filtro){
      case 'Especialista':
        if(!this.switchFiltroEspecialista){
          this.switchFiltroEspecialidades=false       
        }
        this.switchFiltroEspecialista = !this.switchFiltroEspecialista       
        break;
      case 'Paciente':
        if(!this.switchFiltroPaciente){
          this.switchFiltroEspecialidades=false         
        }
        this.switchFiltroPaciente = !this.switchFiltroPaciente    
        break;
      case 'Especialidad':
        if(!this.switchFiltroEspecialidades){
          this.switchFiltroEspecialista=false
        }
        console.log(this.currenUser.perfil)
        console.log(this.currenUser.especialidad)
        if(this.currenUser.perfil=='Especialista'){
         this.listaEspedialidades = this.currenUser.especialidad
        }
        this.switchFiltroEspecialidades = !this.switchFiltroEspecialidades
        break;
    }
  }
 
  eliminarFiltros(){
     this.listaTurnos = this.listaAuxTurnos
     this.switchFiltroEspecialista=false
     this.switchFiltroEspecialidades=false
     this.switchFiltroGenerico= false
     this.filtroAplicado=false
 
  }
 
  seleccionarTurnoParaComentario(turno:Turno){
    this.turnoSelectedForComentary = turno
  }
  seleccionarPacienteParaFiltrar(paciente:Usuario){
    this.filtrarTurnosxPaciente(paciente)
    this.filtroAplicado=true
    this.switchFiltroPaciente=false
  }
   seleccionarEspecialistaParaFiltrar(especialista:Usuario){
     this.filtrarTurnosxEspecialista(especialista)
     this.filtroAplicado=true
     this.switchFiltroEspecialista=false
  }
   seleccionarEspecialidadParaFiltrar(especialidad:any){
     this.filtrarTurnosxEspecialidad(especialidad)
     this.filtroAplicado=true
     this.switchFiltroEspecialidades=false
  }
  filtrarTurnosxPaciente(esp:Usuario){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.paciente.uid == esp.uid 
      })
    this.listaTurnos=listaFiltrada
  }
  filtrarTurnosxEspecialista(esp:Usuario){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialista.uid == esp.uid 
      })
    this.listaTurnos=listaFiltrada
  }
  filtrarTurnosxEspecialidad(especialidad:any){
    let listaFiltrada = this.listaAuxTurnos.filter(value=> {
      return value.especialidad.id == especialidad.id 
      })
    this.listaTurnos=listaFiltrada
  }
  filtrarxPalabra(event:any){
    this.palabraBuscar = event.value
    console.log(this.palabraBuscar)
    let listaFiltrada:Turno[]=[] 

    this.listaAuxTurnos.forEach(value=>{
        if( value.comentario.includes(this.palabraBuscar)||
        value.resenia.includes(this.palabraBuscar)||
        //Filtros Pacientes
        value.paciente.uid?.includes(this.palabraBuscar)||
        value.paciente.nombre.includes(this.palabraBuscar)||
        value.paciente.apellido.includes(this.palabraBuscar)||
        value.paciente.edad.toString().includes(this.palabraBuscar)||
        value.paciente.dni.toString().includes(this.palabraBuscar)||
        value.paciente.obraSocial.includes(this.palabraBuscar)||
        value.paciente.email.includes(this.palabraBuscar) ||
        //FiltrosEspecialista
         value.especialista.uid?.includes(this.palabraBuscar)||
        value.especialista.nombre.includes(this.palabraBuscar)||
        value.especialista.apellido.includes(this.palabraBuscar)||
        value.especialista.edad.toString().includes(this.palabraBuscar)||
        value.especialista.dni.toString().includes(this.palabraBuscar)||
        value.especialista.obraSocial.includes(this.palabraBuscar)||
        value.especialista.email.includes(this.palabraBuscar) ||
        value.especialidad.especialidad.includes(this.palabraBuscar)||
        value.fecha.toLocaleDateString().includes(this.palabraBuscar) ||
        this.obtenerEstado(value.status).includes( this.palabraBuscar.toUpperCase())  ){
          this.switchFiltroGenerico=true
          this.filtroAplicado=true
          listaFiltrada.push(value)
        }
    })

    if(this.palabraBuscar==''){
      this.filtroAplicado=false
    }
    if(listaFiltrada.length>0){
      this.listaTurnos=listaFiltrada
    }
   
  }
  aceptarTurno(turno:Turno){
    this.apiFB.updaterTurnoProperty(turno.id,{status:2})
    .then(rta=>{
      console.log('ACEPTADO el turno ')
     //actualizar listados 
    })
    .catch(err=>{
      console.log('ocurrio un error ACEPTANDO EL TURNO  ' + err)
    })
  }
  preCancelarTurno(turno:Turno,rechazado=0){

  console.log(turno)
  this.seleccionarTurnoParaComentario(turno)
  
  if(rechazado){
    this.rechazarTurno=true
  }


  }
  cancelarTurnoDefinitivo(){
    
    this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{comentario:this.formaComentario.value.comentario})
    .then(rta=>{
      console.log('editado el  Comentario ')
      this.formaComentario.setValue({comentario:''})
      this.apiFB.updateStatus(this.turnoSelectedForComentary.id,this.rechazarTurno?4:6)
      .then(rta=>{
        console.log(this.rechazarTurno?'Rechazado el turno satisfactoriamente ':'Cancelado el turno ')
       //actualizar listados 
      })
      .catch(err=>{
        console.log('ocurrio un error editando el STATUS ' + err)
      })
    })
    .catch(err=>{
      console.log('ocurrio un error editando EL COMENTARIO ' + err)
    })
  }
  realizarEncuesta(turno:Turno){
    console.log(turno)
    this.seleccionarTurnoParaComentario(turno)
  }
  enviarEncuesta(){
     console.log(this.formaEncuesta.value)
     this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{encuestaCompletada:true,encuesta:{opinion:this.formaEncuesta.value.opinion,sugerencia:this.formaEncuesta.value.sugerencia}})
     .then(rta=>{
      this.formaEncuesta.setValue({opinion:' ',sugerencia:' '})

      console.log('Encuesta Actualizada con exito!')
     })
     .catch(err=>{
      console.log('error al enviar la encuesta'+ err)
     })
  }
  realizarCalificacion(turno:Turno){
    console.log(turno)
    this.seleccionarTurnoParaComentario(turno)
  }
  enviarCalificacion(){
    console.log(this.formaCalificacion.value)
     this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{calificacion:{puntaje:this.auxCalificacion,comentario:this.formaCalificacion.value.comentarioCalificacion}})
     .then(rta=>{
      this.formaCalificacion.setValue({comentarioCalificacion:'',})

      console.log('Calificacion Actualizada con exito!')
     })
     .catch(err=>{
      console.log('error al enviar la Calificacion'+ err)
     })
  }
  newFinalizarTurno(){
    // cierro el modal de finalizar y habilito el del historial clinico, al aceptar el historial ejecutro la funcion para finalizar turno y generar historial. 
    
  //exampleModalLabel5  ID MODAL FINALIZAR TURNO 
  //exampleModalLabel6  id modal HISTORIAL 

  //abre el modal para HISTORIAL CLINICO.
  console.log('cerrando')
    let modal =  (<HTMLInputElement> document.getElementById('exampleModal6'))   
    modal.setAttribute('data-bs-toggle','modal');
    modal.setAttribute('data-bs-target','#exampleModal6');
  
  }

  finalizarTurno(){
    let especialistaActual = this.listaEspeciaistas.find(value =>{return value.uid === this.turnoSelectedForComentary.especialista.uid})
    let arrayPacientesAtendidosxEspecialista = especialistaActual?especialistaActual.pacientesAtendidos:[]

 
    this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{status:3,diagnostico:this.formaFinalizarTurno.value.diagnostico,comentario:this.formaFinalizarTurno.value.comentario})
    .then(value=>{
      //agrego el paciente que recien tomo el turno al rray de pacientes del especialista encargaado del turno 
      //si el paciente ya esta en el array no lo pusheo 
      // si el paciente no esta LO PUSHEO
      if(arrayPacientesAtendidosxEspecialista.includes(this.turnoSelectedForComentary.paciente.uid)){
      }else{
        arrayPacientesAtendidosxEspecialista.push(this.turnoSelectedForComentary.paciente.uid)
        this.apiFB.updaterUsuarioProperty(this.turnoSelectedForComentary.especialista.uid,{pacientesAtendidos:arrayPacientesAtendidosxEspecialista})
        .then(value=>{})
        .catch(err=>{
          console.log('ERROR  al actualizar el array de los pacientes atendidos X el ESPECIALISTA'+err)
        })
      }
      
      console.log('turno finalizado con exito')
    })
    .catch(err=>{
      console.log('ERROR FINALIZANDO EL TURNO'+err)
    }) 
   



  }

  addCampoDinamico(){
    if(!this.add1erDatoDinamico){
      this.add1erDatoDinamico=true
    }else if(this.add1erDatoDinamico &&  !this.add2doDatoDinamico ){
      this.add2doDatoDinamico=true
    }else if(this.add2doDatoDinamico && !this.add3roDatoDinamico ){
      this.add3roDatoDinamico=true
    }
   
  }
  guardarHistorial(){
    //this.finalizarTurno()
    this.auxHistoriaClinica.turno = this.turnoSelectedForComentary
    this.auxHistoriaClinica.id=uniqid()
    this.auxHistoriaClinica.altura = this.formaHistorialClinico.value.altura
    this.auxHistoriaClinica.peso= this.formaHistorialClinico.value.peso
    this.auxHistoriaClinica.altura = this.formaHistorialClinico.value.altura 
    this.auxHistoriaClinica.temperatura = this.formaHistorialClinico.value.temperatura
    this.auxHistoriaClinica.presion = this.formaHistorialClinico.value.presion
    if(!this.forma1erAgregado.invalid){
      let auxClave:string = this.forma1erAgregado.value.clave1  //
      let auxValor = this.forma1erAgregado.value.valor1 
      let objAux  = {clave:auxClave,valor:auxValor}
      this.auxHistoriaClinica.anexos.push(objAux) 
    }
    if(!this.forma2erAgregado.invalid){
      let auxClave2 = this.forma2erAgregado.value.clave2
      let auxValor2 = this.forma2erAgregado.value.valor2
      let objAux  = {clave:auxClave2,valor:auxValor2}
      this.auxHistoriaClinica.anexos.push(objAux)
    }
    if(!this.forma3erAgregado.invalid){
      let auxClave3 = this.forma3erAgregado.value.clave3
      let auxValor3 = this.forma3erAgregado.value.valor3
      let objAux  = {clave:auxClave3,valor:auxValor3} 
      this.auxHistoriaClinica.anexos.push(objAux)
    }

    let pacienteActual = this.listaPacientes.find(value =>{
      return value.uid === this.turnoSelectedForComentary.paciente.uid
    })

    let arrayNuevo = pacienteActual?.historialClinico // traer al usuario actualmente. 
    
    arrayNuevo?arrayNuevo.push(JSON.parse(JSON.stringify(this.auxHistoriaClinica))):null 

    let pacienteActualizado = {historialClinico:arrayNuevo} 

     this.apiFB.updaterUsuarioProperty(this.turnoSelectedForComentary.paciente.uid,pacienteActualizado)
    .then(value=>{
      //actualizo el estado del turno
      this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{historialGenerado:true})
      .then(value=>{})
      .catch(err=>{console.log('error actualizando el estado del historial del TURNO.'+err)})
    })
    .catch(err=>{
      console.log('error guardando la historia clinica en el paciente.'+err)
      this.closeModalHistorialClinico()
    }) 
   

 }
 guardarHistorial2(){

  this.finalizarTurno()
  this.formaFinalizarTurno.reset()

  this.auxHistoriaClinica.turno = this.turnoSelectedForComentary
  this.auxHistoriaClinica.id=uniqid()
  this.auxHistoriaClinica.altura = this.formaHistorialClinico.value.altura
  this.auxHistoriaClinica.peso= this.formaHistorialClinico.value.peso
  this.auxHistoriaClinica.altura = this.formaHistorialClinico.value.altura 
  this.auxHistoriaClinica.temperatura = this.formaHistorialClinico.value.temperatura
  this.auxHistoriaClinica.presion = this.formaHistorialClinico.value.presion
  if(!this.forma1erAgregado.invalid){
    let auxClave:string = this.forma1erAgregado.value.clave1  //
    let auxValor = this.forma1erAgregado.value.valor1 
    let objAux  = {clave:auxClave,valor:auxValor}
    this.auxHistoriaClinica.anexos.push(objAux) 
  }
  if(!this.forma2erAgregado.invalid){
    let auxClave2 = this.forma2erAgregado.value.clave2
    let auxValor2 = this.forma2erAgregado.value.valor2
    let objAux  = {clave:auxClave2,valor:auxValor2}
    this.auxHistoriaClinica.anexos.push(objAux)
  }
  if(!this.forma3erAgregado.invalid){
    let auxClave3 = this.forma3erAgregado.value.clave3
    let auxValor3 = this.forma3erAgregado.value.valor3
    let objAux  = {clave:auxClave3,valor:auxValor3} 
    this.auxHistoriaClinica.anexos.push(objAux)
  }

  let pacienteActual = this.listaPacientes.find(value =>{
    return value.uid === this.turnoSelectedForComentary.paciente.uid
  })

  let arrayNuevo = pacienteActual?.historialClinico // traer al usuario actualmente. 
  
  arrayNuevo?arrayNuevo.push(JSON.parse(JSON.stringify(this.auxHistoriaClinica))):null 

  let pacienteActualizado = {historialClinico:arrayNuevo} 

   this.apiFB.updaterUsuarioProperty(this.turnoSelectedForComentary.paciente.uid,pacienteActualizado)
  .then(value=>{
    //actualizo el estado del turno
    this.apiFB.updaterTurnoProperty(this.turnoSelectedForComentary.id,{historialGenerado:true})
    .then(value=>{
      this.formaHistorialClinico.reset()
    })
    .catch(err=>{console.log('error actualizando el estado del historial del TURNO.'+err)})
  })
  .catch(err=>{
    console.log('error guardando la historia clinica en el paciente.'+err)
    this.closeModalHistorialClinico()
  }) 
 

}
  ngOnInit(): void {
  }
  

  closeModalHistorialClinico(){
    let modal =  (<HTMLInputElement> document.getElementById('exampleModal6'))   
    modal.setAttribute('data-bs-dismiss','modal');
    
  //.setAttribute('data-dismiss','modal');
  }


}
