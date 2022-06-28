import { Component, OnInit } from '@angular/core';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
  template: `
    <x-chartist
      [type]="type"
      [data]="data"
      [options]="options"
      [events]="events"
    ></x-chartist>
  `
})

export class EstadisticasComponent implements OnInit {
  type:ChartType ='Bar'
  data:IChartistData={
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    series:[
    ]
  }
  dataTurnosxDia:IChartistData={
    labels: [],
    series:[]
  }


  options: IBarChartOptions = {
    axisX: {
      showGrid: false
    },
    height: 300
  };

  events: ChartEvent = {
    draw: (data) => {
      if (data.type === 'bar') {
        data.element.animate({
          y2: <IChartistAnimationOptions>{
            dur: '0.5s',
            from: data.y1,
            to: data.y2,
            easing: 'easeOutQuad'
          }
        });
      }
    }
  };

  nameCEspecialidades:string='especialidades'
  nameCollectionUsers:string='UsuariosColeccion'
  nameCollectionTurnos:string='TurnosColeccion'
  listaTurnos:Turno[]=[]
  listaEspecialidades:any[]=[] //especialidades
  listaEspecialistas:Usuario[]=[]


  turnosCargados:boolean = false
  especialidadesCargadas:boolean=false

  datosListosTurnosxEspecialidades:boolean = false
  datosListosTurnosxDias:boolean = false

  fechaInicio:Date = new Date('06/28/2022')
  fechaFinal:Date = new Date('07/22/2022')

  showEspecialistas:boolean=false

  constructor(private apiFB:FirebaseService) {
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
            
            newArray.push(newTurno)
          /*  if(this.currenUser.perfil === 'Especialista'){
              if(newTurno.especialista.uid === this.currenUser.uid){
                newArray.push(newTurno)
              }  
            }else if(this.currenUser.perfil === 'Paciente'){
              if(newTurno.paciente.uid === this.currenUser.uid){
                newArray.push(newTurno)
              } 
            } */ 
                
        })
        //console.log(newArray)
        this.turnosCargados=true
        this.listaTurnos=newArray


    })
    this.apiFB.getCollection(this.nameCEspecialidades).subscribe(res=>{
      this.listaEspecialidades= res
      this.especialidadesCargadas=true
      
    })
    this.apiFB.getCollection(this.nameCollectionUsers).subscribe(res=>{
       
      let newArray:Usuario[]=[]

      res.forEach(value=>{
        if(value.perfil==='Especialista'){ 
          const newUser = new Usuario(value.nombre,value.apellido,value.edad,value.dni,value.email,value.password,value.fotosPerfil,value.isAdmin)
          newUser.especialidad = value.especialidad
          newUser.uid = value.uid
          newUser.pacientesAtendidos = value.pacientesAtendidos
          newArray.push(newUser)
        }
      }) 

    this.listaEspecialistas=newArray

    })

   }

  ngOnInit(): void {
  }

  generarEstadisticas(){
  //  new Chartist.Bar('#bar-chart', data, options, responsiveOptions);
  }


  
  mergeListaDias(lista:any[]){
    let listaMerge :any[]=[]

    lista.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!listaMerge.includes(auxDiaString)){
        listaMerge.push(auxDiaString)
      }
      
    })


    return listaMerge
  }

  clasificarTurnoxEspecialidad(){

    let auxListaEspecialidades = this.listaEspecialidades.map(value=>{
      return {id:value.id,name:value.especialidad,cantidad:0} 
    })

    //recorro los turnos
    this.listaTurnos.forEach(turno=>{
      auxListaEspecialidades.forEach(especialidad=>{
        if(especialidad.id === turno.especialidad.id){
          especialidad.cantidad++
        }
      })
    })


    let auxLabelsGraficoTurnoxEspecialidades:any[]=[]
    let auxValuesGraficoTurnoxEspecialidades:number[]=[]

    auxListaEspecialidades.forEach(value=>{
      auxLabelsGraficoTurnoxEspecialidades.push(value.name)
      auxValuesGraficoTurnoxEspecialidades.push(value.cantidad)
    })

    this.data.labels= auxLabelsGraficoTurnoxEspecialidades
    let auxSerie = [auxValuesGraficoTurnoxEspecialidades]

    this.data.series=auxSerie

    this.datosListosTurnosxEspecialidades=true
    
    //verifico 
  }
  clasificarTurnosxDia(){
    let auxListaDiasTurnos = this.listaTurnos.map(value=>{
      let auxDate = new Date(value.fecha)
      return {fecha:auxDate} 
    })

    console.log('DIAS DE LOS TURNOS ')
    console.log(auxListaDiasTurnos)

    let diasTurnosUnicos:any[]=[]

    auxListaDiasTurnos.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!diasTurnosUnicos.includes(auxDiaString)){
        diasTurnosUnicos.push(auxDiaString)
      }
      
    })

    console.log('DIAS DE LOS TURNOS UNICOS ')
    console.log(diasTurnosUnicos)

    //Lista de los dias SIN REPETIR de todos los turnos.
    let auxListaDiasTurnoConCantidad = diasTurnosUnicos.map(value=>{
      return {fecha:value,cantidad:0}
    })

    console.log('DIAS DE LOS TURNOS UNICOS SIN CANTIDADES ')
    console.log(auxListaDiasTurnoConCantidad) 

  
     //recorro los turnos buscando las fechas. 
     this.listaTurnos.forEach(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      auxListaDiasTurnoConCantidad.forEach(diaWithCantidad=>{
        if(diaWithCantidad.fecha === auxFechaTurnoActual.toLocaleDateString()){
          diaWithCantidad.cantidad++
        }
      })
    })

    console.log('DIAS DE LOS TURNOS UNICOS CON CANTIDADES ACTUALIZADAS ')
    console.log(auxListaDiasTurnoConCantidad) 

    let auxLabelsGraficoTurnoxDia:any[]=[]
    let auxValuesGraficoTurnoxDia:number[]=[]

    auxListaDiasTurnoConCantidad.forEach(value=>{
      auxLabelsGraficoTurnoxDia.push(value.fecha)
      auxValuesGraficoTurnoxDia.push(value.cantidad)
    })

    this.dataTurnosxDia.labels=auxLabelsGraficoTurnoxDia
    let auxSerie = [auxValuesGraficoTurnoxDia]
    this.dataTurnosxDia.series=auxSerie

    this.datosListosTurnosxDias=true

  }
  clasificarTurnosxDiaxEspecialista(idEspecialista:string | undefined){

    //TURNOS FILTRADOS POR ESPECIALISTA 
    let auxTurnosFiltradosxEspecialista = this.listaTurnos.filter(value=>{
      return value.especialista.uid===idEspecialista
    })

    console.log('TURNOS FILTRADOS POR ESPECIALISTA ' + idEspecialista )
    console.log(auxTurnosFiltradosxEspecialista)

     //TURNOS FILTRADOS POR ESPECIALISTA Y DENTRO DEL RANGO ESTABLECIDO
     let auxTurnosFiltradosxEspecialistayFechas = auxTurnosFiltradosxEspecialista.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      return auxFechaTurnoActual>= this.fechaInicio && auxFechaTurnoActual<= this.fechaFinal
    })


    //obtengo la lista de los dias segun los turnos filtrados por ESPECIALISTA Y POR EL RANGO DE FECHA
    let listaDiasTurnos = auxTurnosFiltradosxEspecialistayFechas.map(value=>{
      let auxDate = new Date(value.fecha)
      return {fecha:auxDate} 
    })
    //lista de los dias en los que se realiza turno SIN REPETIR DÍA
    let diasTurnosUnicos:any[] = this.mergeListaDias(listaDiasTurnos)

    //Mapeo la lista para agregarles cantidad.
    diasTurnosUnicos=diasTurnosUnicos.map(value=>{
      return {fecha:value,cantidad:0}
    })

   
    //recorro los turnos buscando las fechas dentro del rango 
    auxTurnosFiltradosxEspecialistayFechas.forEach(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      diasTurnosUnicos.forEach((diaConCant)=>{
        if(auxFechaTurnoActual>= this.fechaInicio && auxFechaTurnoActual<=this.fechaFinal){
          if(diaConCant.fecha === auxFechaTurnoActual.toLocaleDateString()){
            diaConCant.cantidad ++
          }
          //console.log(`la fecha ${auxFechaTurnoActual.toLocaleDateString()} esta dentro del rango ${this.fechaInicio.toLocaleDateString()} - ${this.fechaFinal.toLocaleDateString()}`)
        }else{
          console.log(`la fecha ${auxFechaTurnoActual.toLocaleDateString()} NO ESTA DENTRO DEL RANGO ${this.fechaInicio.toLocaleDateString()} - ${this.fechaFinal.toLocaleDateString()}`)
        }        
      })
    })

    console.log('DIAS DE LOS TURNOS UNICOS CON CANTIDADES ACTUALIZADAS DEL ESPECIALISTA ' + idEspecialista)
    console.log(diasTurnosUnicos) 
  }
  activarClasificarTurnosxDiaxEspecialista(){
    this.showEspecialistas = !this.showEspecialistas
  }
}
