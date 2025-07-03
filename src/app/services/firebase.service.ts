import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  // --- Métodos de Autenticación ---

  async registerUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (e: any) {
      console.error("Error al registrar: ", e);
      throw e;
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (e: any) {
      console.error("Error al iniciar sesión: ", e);
      throw e;
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (e: any) {
      console.error("Error al cerrar sesión: ", e);
      throw e;
    }
  }

  // --- Métodos de Firestore (Base de Datos) ---

  async addTestDocument(data: any): Promise<any> {
    try {
      const docRef = await addDoc(collection(this.firestore, "test_collection"), data);
      console.log("Documento escrito con ID: ", docRef.id);
      return docRef.id;
    } catch (e: any) {
      console.error("Error al añadir documento: ", e);
      throw e;
    }
  }

  async getTestDocuments(): Promise<any[]> {
    try {
      const querySnapshot = await getDocs(collection(this.firestore, "test_collection"));
      const documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (e: any) {
      console.error("Error al obtener documentos: ", e);
      throw e;
    }
  }
}   