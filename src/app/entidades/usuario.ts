export class Usuario  {
    uid:string | undefined=''
    nombre:string
    apellido:string
    edad:number
    dni:number
    obraSocial:any
    especialidad:any[]=[]
    email:string
    password:string
    fotosPerfil:string[]
    perfil:string=''
    isAdmin:boolean
    valid=false

    
    
    constructor(nombre:string='',apellido:string='',edad:number=0,dni:number=0,email:string='',password:string='',fotos:string[]=[],isAdmin:boolean=false){

        this.nombre=nombre
        this.apellido=apellido
        this.edad=edad
        this.dni=dni
        this.email=email
        this.password=password
        this.fotosPerfil=fotos
        this.isAdmin=isAdmin
    
    }
        
    }