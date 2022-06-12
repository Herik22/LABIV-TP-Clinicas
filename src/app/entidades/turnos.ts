import { Usuario } from "./usuario";
export class Turno {

    duracion:number
    idEspecialista:string=''
    idEspecialidad:string=''
    fecha:any

    
    constructor(duracion:number=30){
        this.duracion=duracion
        
    }

} 