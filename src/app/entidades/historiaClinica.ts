import { Turno } from "./turnos";
import { Usuario } from "./usuario";

export class HistoriaClinica {

    turno:Turno = new Turno()
    id:string=''
    altura:string=''
    peso:string=''
    temperatura:string=''
    presion:string=''
    anexos:any[]=[]

    constructor(){}

}