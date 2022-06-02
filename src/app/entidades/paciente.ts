export class Paciente {
    /*
        Nombre
■ Apellido
■ Edad
■ DNI
■ Obra Social
■ Mail
■ Password
■ 2 imágenes para su perfil.
    */
    nombre:string
    apellido:string
    edad:number
    dni:number
    obraSocial:string
    email:string
    password:string
    fotosPerfil:string[]
    
    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,obraSocial:string='',email:string='',password:string='',fotos:string[]=[]){
        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.email=email
        this.password=password
        this.fotosPerfil=fotos
        this.obraSocial=obraSocial
    }

}