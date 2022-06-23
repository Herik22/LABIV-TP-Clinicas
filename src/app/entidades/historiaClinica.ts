import { Turno } from "./turnos";
import { Usuario } from "./usuario";

export class HistoriaClinica {

    turno:Turno
    id:string
    altura:string
    peso:string
    temperatura:string
    presion:string
    anexos:any[]

    constructor(turno:Turno=new Turno(),id:string='',altura:string='',peso:string='',temperatura:string='',presion:string='',anexos:any[]=[]){
        this.turno=turno
        this.id=id
        this.altura=altura
        this.peso=peso
        this.temperatura=temperatura
        this.presion=presion
        this.anexos=anexos

    }

}