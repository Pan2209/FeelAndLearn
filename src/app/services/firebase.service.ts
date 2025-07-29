import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification } from '@angular/fire/auth';
// Importaciones adicionales para Firestore: doc, setDoc, getDoc
import { Firestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';

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

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Correo de restablecimiento de contraseña enviado a:', email);
    } catch (e: any) {
      console.error('Error al enviar correo de restablecimiento:', e);
      throw e;
    }
  }

  async sendVerificationEmail(user: any): Promise<void> {
    try {
      await sendEmailVerification(user);
      console.log('Correo de verificación enviado al usuario:', user.email);
    } catch (e: any) {
      console.error('Error al enviar correo de verificación:', e);
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

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // NUEVO MÉTODO: Guardar o actualizar el progreso de una letra específica para un usuario
  async saveUserLetterProgress(userId: string, letter: string, correctCount: number, totalCount: number): Promise<void> {
    if (!userId) {
      console.error("Error: userId es nulo o indefinido al guardar el progreso.");
      return;
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);

    try {
      // Obtener el progreso actual del usuario
      const docSnap = await getDoc(userProgressDocRef);
      let currentProgress = docSnap.exists() ? docSnap.data() : {};

      // Obtener los datos de la letra actual o inicializarlos
      const letterData = currentProgress[letter] || { correct: 0, total: 0 };

      // Sumar los nuevos resultados
      letterData.correct += correctCount;
      letterData.total += totalCount;

      // Actualizar el progreso para la letra
      currentProgress = {
        ...currentProgress,
        [letter]: letterData
      };

      // Guardar el documento actualizado
      await setDoc(userProgressDocRef, currentProgress);
      console.log(`Progreso de la letra '${letter}' guardado para el usuario ${userId}`);
    } catch (e: any) {
      console.error(`Error al guardar el progreso de la letra '${letter}':`, e);
      throw e;
    }
  }

  // NUEVO MÉTODO: Obtener todo el progreso de un usuario
  async getUserProgress(userId: string): Promise<{ [key: string]: { correct: number, total: number } }> {
    if (!userId) {
      console.error("Error: userId es nulo o indefinido al obtener el progreso.");
      return {};
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);

    try {
      const docSnap = await getDoc(userProgressDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as { [key: string]: { correct: number, total: number } };
      } else {
        console.log("No se encontró progreso para el usuario:", userId);
        return {};
      }
    } catch (e: any) {
      console.error("Error al obtener el progreso del usuario:", e);
      throw e;
    }
  }
}