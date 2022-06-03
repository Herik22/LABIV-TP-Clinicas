export class Especialista {
uid:string|undefined
nombre:string
apellido:string
edad:number
dni:number
especialidad:any
email:string
password:string
fotoPerfil:string
isAdmin:boolean
perfil:string
valid:boolean=false


constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,especialidad:string='',email:string='',password:string='',foto:string='',isAdmin:boolean=false,perfil:string='Especialista',uid:string=''){
    this.uid=uid
    this.nombre=nombre
    this.apellido=apellido
    this.edad=edad
    this.dni=dni
    this.email=email
    this.password=password
    this.fotoPerfil=foto
    this.isAdmin=isAdmin
    this.perfil=perfil

}
    
}