import { Component, OnInit,ViewChild,ElementRef  } from '@angular/core';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData,
  IPieChartOptions
} from 'chartist';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,FormControl } from '@angular/forms';
import { ChartEvent, ChartType } from 'ng-chartist';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { Turno } from 'src/app/entidades/turnos';
import { Usuario } from 'src/app/entidades/usuario';
import { DateAdapter } from '@angular/material/core';
import { throws } from 'assert';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import jsPDF from 'jspdf'; 
import * as XLSX from 'xlsx'; 
var uniqid = require('uniqid');
//import { Chart } from 'node_modules/chart.js'
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import{trigger,style,transition,animate, state,keyframes} from'@angular/animations'

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
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
  @ViewChild ('tablaLogs', {static: false}) el! : ElementRef
  @ViewChild ('graficaTurnoxDia', {static: false}) refGraficaTurnoxDia! : ElementRef
  @ViewChild ('graficaTurnoxEspecialidad', {static: false}) refGraficaTurnoxEspecialidad! : ElementRef
  @ViewChild ('graficaTurnoSolicitado', {static: false}) refGraficaTurnosSolicitados! : ElementRef
  @ViewChild ('graficaTurnoFinalizado', {static: false}) refGraficaTurnosFinalizados! : ElementRef
  type:ChartType ='Bar'
  type2:ChartType ='Pie'

  data:IChartistData={
    labels: [],
    series:[]
  }
  dataTurnosxDia:IChartistData={
    labels: [],
    series:[]
  }
  dataTurnosSolicitadosxEspecialistaxRangoFecha:IChartistData={
    labels: [],
    series:[]
  }
  dataTurnosFinalizadosxEspecialistaxRangoFecha:IChartistData={
    labels: [],
    series:[]
  }

  options: IBarChartOptions = {
    axisX: {
      showGrid: false
    },
    height: 250
  };
  options2: IPieChartOptions = {
    width:'22rem',
    height: '22rem',
    chartPadding: 15
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
  nameLogsCollection :string='logsCollecion'

  listaTurnos:Turno[]=[]
  listaEspecialidades:any[]=[] //especialidades
  listaEspecialistas:Usuario[]=[]
  listaLogs:any[]=[]

  turnosCargados:boolean = false
  especialidadesCargadas:boolean=false
  logsCargados:boolean=false

  datosListosTurnosxEspecialidades:boolean = false
  datosListosTurnosxDias:boolean = false
  datosListosTurnosSolicitados:boolean=false
  datosListosTurnosFinalizados:boolean=false

  fechaInicioTurnosSolicitado:Date = new Date()
  fechaFinalTurnosSolicitado:Date = new Date()

  fechaInicioTurnosFinalizados:Date = new Date()
  fechaFinalTurnosFinalizados:Date = new Date()



  especialistaSelected:Usuario= new Usuario()



  showFechasTurnoSolicitados:boolean = false
  showFechasTurnoFinalizado:boolean = false
  showLogs:boolean = false
  formaFechas:FormGroup;
  formaFechas2:FormGroup;

  hayDatosTurnoFinalizado:boolean=false
  hayDatosTurnoSolicitado:boolean=false

  auxImage:any= 'https://image.shutterstock.com/image-vector/medical-seamless-pattern-clinic-vector-260nw-1111008212.jpg'
   pdf = new jsPDF(); 
  constructor(private apiFB:FirebaseService,private dateAdapter:DateAdapter<Date>,private fb:FormBuilder) {

    this.dateAdapter.setLocale('es-ES');

    this.formaFechas = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })
    this.formaFechas2 = this.fb.group({
      'fechaInicio':['',[Validators.required,]],
      'fechaFinal':['',[Validators.required,]],
    })


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
    this.apiFB.getCollection(this.nameLogsCollection).subscribe(res=>{
      this.listaLogs= res
      this.logsCargados=true
      
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

  async crearPdfxDia() {
    let doc = new jsPDF();
    await html2canvas(this.refGraficaTurnoxDia.nativeElement).then((canvas) => {
      
      const imgData = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnosxDias' });
    return true;
  }
  
  async crearPdfxEspecialidad() {
    let doc = new jsPDF();
    await html2canvas(this.refGraficaTurnoxEspecialidad.nativeElement).then((canvas) => {
      
      const imgData = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnosxEspecialidad' });
    return true;
  }
  async crearPdfSolicitado() {
    let doc = new jsPDF();
    await html2canvas(this.refGraficaTurnosSolicitados.nativeElement).then((canvas) => {
      
      const imgData = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnosSolicitados' });
    return true;
  }
  async crearPdfFinalizado() {
    let doc = new jsPDF();
    await html2canvas(this.refGraficaTurnosFinalizados.nativeElement).then((canvas) => {
      
      const imgData = canvas.toDataURL('image/PNG');
      const bufferX = 5;
      const bufferY = 60;
      const imgProps = (doc as any).getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
    })
    doc.output('dataurlnewwindow', { filename: 'turnos-Finalizados' });
    return true;
  }


  generarExcel(){
    
    let nameFile = `tablaLogs_${uniqid()}`
    
    let element = document.getElementById('tablaLogs'); // <----- ID 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  
    XLSX.writeFile(wb, nameFile);
   
  }

  generarPrimerasGraficas(){
    this.clasificarTurnoxEspecialidad()
    this.clasificarTurnosxDia()
    this.clasificarLogs()
  }



  turnoxDiaGraficoCHart(labels:any[],data:any[]){

    const myChart = new Chart('chartJSXdia', {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: '# turnos x Día',
              data: data,
              fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
      }
  });
  }
  turnoSolicitados(labels:any[],data:any[]){
    const myChart = new Chart('chartJSxSolicitados', {
      type: 'polarArea',
      data: {
          labels: labels,
          datasets: [{
              label: '# turnos x Día',
              data: data,
              //fill: false,
      borderColor: 'aqua',
     // tension: 0.1
    }]
      }
  });
  }
  turnoFinalizados(labels:any[],data:any[]){
    const myChart = new Chart('chartJSxFinalizados', {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: '# turnos x Día',
              data: data,        
             // fill: false,
              borderColor: 'aqua',
            //tension: 0.1
            barPercentage: 0.5,
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
  });
  }
  

  clasificarLogs(){
    this.showLogs=true
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

    let diasTurnosUnicos:any[]=[]

    auxListaDiasTurnos.forEach(value=>{
      let auxDiaString = value.fecha.toLocaleDateString()

      if(!diasTurnosUnicos.includes(auxDiaString)){
        diasTurnosUnicos.push(auxDiaString)
      }
      
    })

    //Lista de los dias SIN REPETIR de todos los turnos.
    let auxListaDiasTurnoConCantidad = diasTurnosUnicos.map(value=>{
      return {fecha:value,cantidad:0}
    })

     //recorro los turnos buscando las fechas. 
     this.listaTurnos.forEach(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      auxListaDiasTurnoConCantidad.forEach(diaWithCantidad=>{
        if(diaWithCantidad.fecha === auxFechaTurnoActual.toLocaleDateString()){
          diaWithCantidad.cantidad++
        }
      })
    })

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
    //***************//***************//*************** */
    //prueba Chart
    this.turnoxDiaGraficoCHart(auxLabelsGraficoTurnoxDia,auxValuesGraficoTurnoxDia)
    //***************//***************//*************** */
  }
  prepararTurnosSolicitadosxTemporada(fechaInicio:Date,fechaFinal:Date){

    // obtengo una copia de TODOS LOS TURNOS de la coleccion. 
    let auxTurnos:Turno[] = this.listaTurnos

    console.log('TURNOS COMPLETOS')
    console.log(auxTurnos)

     // FILTRO EXCLUSIVAMENTE POR LOS TURNOS QUE ESTEN DENTRO DEL RANDO INDICADO POR LAS FECHAS.
     let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal
    })

    //MAPEO LA LISTA PARA OBTENER TODOS LOS ESPECIALISTAS SEGUN LOS TURNOS, ADEMAS AÑADO CAMPO DE CANTIDAD. 
    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
    
      return {especialista:`${value.especialista.nombre} ${value.especialista.apellido}`,idEspecialista:value.especialista.uid,cantidad:0} 
    })

    console.log('array de turnos filtrados por las fechas indicadas. ya mapeados SIN FILTRAR')
    console.log(listaEspecialistasTurno)


    //PROBANDO FUNCIONES PARA FILTRAR EL ARRAY 
    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
     arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = !hash[current.idEspecialista?current.idEspecialista:''];
      hash[current.idEspecialista?current.idEspecialista:''] = true;
      return exists;
    });
    
    console.log('arrayConEspecialistasUnicos YA FILTRADO ')
    console.log(arrayConEspecialistasUnicos);

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    //RECORRO TODOS LOS TURNOS Y VOY COMPARANDO POR LOS ESPECIALISTAS YA FILTRADOS
    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.especialista.uid === especialstaSinRepetir.idEspecialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    console.log('arrayConEspecialistasUnicos YA CON CANTIDAD')
    console.log(newArrayconCantidadesSinDuplicados);

    let auxLabelsTurnosSolicitados:any [] = []
    let auxValuesTurnosSolicitados:number [] = []

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      //obtengo los LABELS Y LOS VALORES
      auxLabelsTurnosSolicitados.push(`${value.especialista}(${value.cantidad})`)
      auxValuesTurnosSolicitados.push(value.cantidad)
    })

    this.dataTurnosSolicitadosxEspecialistaxRangoFecha.labels=auxLabelsTurnosSolicitados
    this.dataTurnosSolicitadosxEspecialistaxRangoFecha.series=auxValuesTurnosSolicitados
    this.datosListosTurnosSolicitados=true
    /*************************************************************************** */
    this.turnoSolicitados(auxLabelsTurnosSolicitados,auxValuesTurnosSolicitados)
    /*************************************************************************** */
    return true
  }
  prepararTurnosFinalizadosxTemporada(fechaInicio:Date,fechaFinal:Date){

    let retorno = false
    // obtengo una copia de TODOS LOS TURNOS de la coleccion. 
    let auxTurnos:Turno[] = this.listaTurnos

    console.log('TURNOS COMPLETOS')
    console.log(auxTurnos)

     // FILTRO EXCLUSIVAMENTE POR LOS TURNOS QUE ESTEN DENTRO DEL RANDO INDICADO POR LAS FECHAS.
     let auxTurnosFiltradosxFechas = auxTurnos.filter(turno=>{
      let auxFechaTurnoActual = new Date(turno.fecha)
      return auxFechaTurnoActual>=fechaInicio && auxFechaTurnoActual<=fechaFinal&&turno.status==3
    })

    //MAPEO LA LISTA PARA OBTENER TODOS LOS ESPECIALISTAS SEGUN LOS TURNOS, ADEMAS AÑADO CAMPO DE CANTIDAD. 
    let listaEspecialistasTurno = auxTurnosFiltradosxFechas.map(value=>{
    
      return {especialista:`${value.especialista.nombre} ${value.especialista.apellido}`,idEspecialista:value.especialista.uid,cantidad:0} 
    })

    //PROBANDO FUNCIONES PARA FILTRAR EL ARRAY 
    var arrayConEspecialistasUnicos = listaEspecialistasTurno
    
    var hash :any = {};
     arrayConEspecialistasUnicos = arrayConEspecialistasUnicos.filter(current=>{
      var exists = !hash[current.idEspecialista?current.idEspecialista:''];
      hash[current.idEspecialista?current.idEspecialista:''] = true;
      return exists;
    });

    let newArrayconCantidadesSinDuplicados =  arrayConEspecialistasUnicos

    //RECORRO TODOS LOS TURNOS Y VOY COMPARANDO POR LOS ESPECIALISTAS YA FILTRADOS
    auxTurnosFiltradosxFechas.forEach(turnoAuxiliar=>{
      newArrayconCantidadesSinDuplicados.forEach(especialstaSinRepetir=>{

        if(turnoAuxiliar.especialista.uid === especialstaSinRepetir.idEspecialista){
          especialstaSinRepetir.cantidad++
        }
      })
    })

    let auxLabelsTurnosSolicitados:any [] = []
    let auxValuesTurnosSolicitados:number [] = []

    newArrayconCantidadesSinDuplicados.forEach(value=>{
      //obtengo los LABELS Y LOS VALORES
      auxLabelsTurnosSolicitados.push(`${value.especialista}(${value.cantidad})`)
      auxValuesTurnosSolicitados.push(value.cantidad)
    })
    
    console.log('array vacio?')
    console.log(newArrayconCantidadesSinDuplicados)
    this.dataTurnosFinalizadosxEspecialistaxRangoFecha.labels=auxLabelsTurnosSolicitados
    this.dataTurnosFinalizadosxEspecialistaxRangoFecha.series=[auxValuesTurnosSolicitados]

    this.datosListosTurnosFinalizados=true

    /******************************************************************************** */
    this.turnoFinalizados(auxLabelsTurnosSolicitados,auxValuesTurnosSolicitados)
   /******************************************************************************** */
    newArrayconCantidadesSinDuplicados.length>0 ? retorno= true : retorno= false

    return retorno
  }
  mostrarFechas(finalizado:boolean=false){
    finalizado?this.showFechasTurnoFinalizado=!this.showFechasTurnoFinalizado :this.showFechasTurnoSolicitados=!this.showFechasTurnoSolicitados 
  }


  seleccionarFechas(){
    let newFechaInicio = new Date(this.formaFechas.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechas.value.fechaFinal)
   
    this.fechaInicioTurnosSolicitado=newFechaInicio
    this.fechaFinalTurnosSolicitado=newFechaFinal

    let rtaCargarGrafico =this.prepararTurnosSolicitadosxTemporada(newFechaInicio,newFechaFinal)
    
    if(rtaCargarGrafico){
      this.showFechasTurnoSolicitados = false
      this.especialistaSelected = new Usuario()
    }
  }
  seleccionarFechasTurnoFinalizado(){

    let newFechaInicio = new Date(this.formaFechas2.value.fechaInicio)
    let newFechaFinal = new Date(this.formaFechas2.value.fechaFinal)
   
    this.fechaInicioTurnosFinalizados=newFechaInicio
    this.fechaFinalTurnosFinalizados=newFechaFinal
    
    let rtaCargarGrafico =  this.prepararTurnosFinalizadosxTemporada(newFechaInicio,newFechaFinal)
    this.showFechasTurnoFinalizado = false

    this.hayDatosTurnoFinalizado = rtaCargarGrafico

  }


}
