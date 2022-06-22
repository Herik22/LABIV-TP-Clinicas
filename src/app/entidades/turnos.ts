import { Usuario } from "./usuario";

export class Turno {

    duracion:number
    paciente:Usuario=new Usuario()
    especialista:Usuario=new Usuario()
    especialidad:any
    fecha:Date = new Date()
    comentario:string=''
    resenia:string=''
    status:number=0 //0-false  1-Pendiente 2-ACEPTADO  3-Realizado  4-Rechazado   6Cancelado 
    encuestaCompletada:boolean=false
    historialGenerado:boolean=false
    idHistorial:string=''
    calificacion:any=0
    encuesta:any=''
    id:string=''
    
    constructor(duracion:number=30){
        this.duracion=duracion
        
    }

} 