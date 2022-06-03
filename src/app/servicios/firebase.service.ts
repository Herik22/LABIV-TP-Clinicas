import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import 'firebase/compat/storage'
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private usuariosRef: AngularFirestoreCollection;
  storageRef = firebase.app().storage().ref()
  isAdmin :boolean = true
  isPaciente:boolean = false
  isEspecialista:boolean = false
  auxUser:any

  constructor(private afauth:AngularFireAuth,private fireStore:AngularFirestore,private storage: AngularFirestore) {
    this.usuariosRef= fireStore.collection('UsuariosColeccion'); // referencia a una coleccion
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
  getCollection(nameColection:string){
    let collection = this.fireStore.collection<any>(nameColection)
    return collection.valueChanges()
  }
  autorizarUsuario(idEspecialista:string,): Promise<any> {
    return this.usuariosRef.doc(idEspecialista).update({
      valid:true ,
      idCollectionfb:idEspecialista
    });
  }
  getUsuariosColl(){
    return this.usuariosRef.get();
  }
}

