import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import 'firebase/compat/storage'
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private containerRef: AngularFirestoreCollection;
  storageRef = firebase.app().storage().ref()
  constructor(private afauth:AngularFireAuth,private fireStore:AngularFirestore,private storage: AngularFirestore) {
    this.containerRef= fireStore.collection('especialistasColl'); // referencia a una coleccion
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
}

