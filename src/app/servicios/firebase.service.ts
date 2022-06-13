import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import 'firebase/compat/storage'
import firebase from 'firebase/compat/app';
import { Turno } from '../entidades/turnos';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private usuariosRef: AngularFirestoreCollection;
  private turnosRef: AngularFirestoreCollection;
  storageRef = firebase.app().storage().ref()
  isAdmin :boolean = true
  isPaciente:boolean = false
  isEspecialista:boolean = false
  auxUser:any

  constructor(private afauth:AngularFireAuth,private fireStore:AngularFirestore,private storage: AngularFirestore) {
    this.usuariosRef= fireStore.collection('UsuariosColeccion'); // referencia a una coleccion
    this.turnosRef = fireStore.collection('TurnosColeccion');
   }

  isAdministrador(usuario:any){
    return usuario && usuario.isAdmin
  }

  isAdministradorBeta(user:any){
    return user && user.isAdmin
  }

  setUser(usuario:any){
    this.auxUser=usuario
  }

 
  async login(email:string,password:string){
    try {
      return await this.afauth.signInWithEmailAndPassword(email,password)
    }catch (error) {
  
      throw error
    }
  }
  async register(email:string,password:string){
    try {
      return await this.afauth.createUserWithEmailAndPassword(email,password)
    } catch (error) {
      console.log('ERROR REGISTER-SERVICE'+error)
      throw error
    }
  }
  getUserLogged(){
    return this.afauth.authState
  }
  getCurrentUser()
  {
    return this.afauth.authState;
  }
  logOut(){
    this.afauth.signOut()
  }
  async subirImages (nombreAlbum:string,nombre:string,imgB64:any){
    try {
      let rta = await this.storageRef.child(`${nombreAlbum}/${nombre}`).putString(imgB64,'data_url') // name carpeta/Nombre imagen 
        console.log(rta)
        return await rta.ref.getDownloadURL();
    } catch (error) {
      
      console.log(error)
      return null
    }
  }
  addDataCollection(nameColection:string,data:any){
    let response = {status:true,error:''}
    let collection = this.fireStore.collection<any>(nameColection)
    try {
      collection.add(data) .then(data=>{
        if(!data){
          response.status=false;
          response.error='data vacia';}
      })
    } catch (error) {
        response.status=false;
        response.error=`${error}`; 
        console.log(error)
    }
    return response
  }
  addDocumentoaColeccion(nameColection:string,nameDocument:string,data:any){
    let response = {status:true,error:''}
    let collection = this.fireStore.collection<any>(nameColection)
    try {
      //guardes en la coleccion
      collection.doc(nameDocument).set(data).then(data=>{
        
          response.status=false;
          response.error='data vacia';
      })
    }catch (error) {
        response.status=false;
        response.error=`${error}`; 
        console.log(error)
    }
    return response
  }

  getCollection(nameColection:string){
    let collection = this.fireStore.collection<any>(nameColection)
    return collection.valueChanges()
  }
  autorizarUsuario(idEspecialista:string,): Promise<any> {
    return this.usuariosRef.doc(idEspecialista).update({
      valid:true ,
    });
  }
  updateDuracion(idEspecialista:string|undefined,objActualizado:any): Promise<any> {
    return this.usuariosRef.doc(idEspecialista).update(objActualizado);
  }
  updaterUsuarioProperty(idUsuario:string|undefined,objConCambio:any): Promise<any> {
    return this.usuariosRef.doc(idUsuario).update(objConCambio);
   // return this.turnosRef.doc(idTurno).update(objActualizado);
  }
  updateStatus(idTurno:string|undefined,status_:number): Promise<any> {
    return this.turnosRef.doc(idTurno).update({status:status_});
   // return this.turnosRef.doc(idTurno).update(objActualizado);
  }
  updaterTurnoProperty(idTurno:string|undefined,objConCambio:any): Promise<any> {
    return this.turnosRef.doc(idTurno).update(objConCambio);
   // return this.turnosRef.doc(idTurno).update(objActualizado);
  }
  getUsuariosColl(){
    return this.usuariosRef.get();
  }
  getUser(id:string|undefined){ 
      return this.usuariosRef.doc(id).get()
  }

}

