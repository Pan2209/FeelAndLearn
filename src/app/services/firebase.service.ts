import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, sendEmailVerification, User } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  async registerUser(email: string, password: string): Promise<User> {
    try {
      console.log("FirebaseService: Intentando crear usuario (sin enviar verificación todavía):", email);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log("FirebaseService: Usuario creado exitosamente:", user.uid);
      // CRÍTICO: Eliminado el envío automático de correo de verificación aquí.
      // Ahora se enviará desde la página verify-email.
      return user;
    } catch (e: any) {
      console.error("FirebaseService: Error al crear usuario:", e.code, e.message);
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
      console.log('FirebaseService: Correo de restablecimiento de contraseña enviado a:', email);
    } catch (e: any) {
      console.error('FirebaseService: Error al enviar correo de restablecimiento:', e);
      throw e;
    }
  }

  async sendVerificationEmail(user: User): Promise<void> {
    try {
      console.log('FirebaseService: Intentando enviar correo de verificación al usuario:', user.email);
      await sendEmailVerification(user);
      console.log('FirebaseService: Correo de verificación enviado exitosamente al usuario:', user.email);
    } catch (e: any) {
      console.error('FirebaseService: Error al enviar correo de verificación:', e.code, e.message);
      throw e;
    }
  }

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

  async saveUserLetterProgress(userId: string, letter: string, correctCount: number, totalCount: number): Promise<void> {
    if (!userId) {
      console.error("FirebaseService: userId es nulo o indefinido al guardar el progreso.");
      return;
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);
    console.log(`FirebaseService: Intentando guardar progreso para userId: ${userId}, letra: ${letter}`);

    try {
      const docSnap = await getDoc(userProgressDocRef);
      let currentProgress = docSnap.exists() ? docSnap.data() : {};
      console.log("FirebaseService: Progreso actual antes de actualizar:", currentProgress);

      const letterData = currentProgress[letter] || { correct: 0, total: 0 };

      letterData.correct += correctCount;
      letterData.total += totalCount;

      currentProgress = {
        ...currentProgress,
        [letter]: letterData
      };

      await setDoc(userProgressDocRef, currentProgress);
      console.log(`FirebaseService: Progreso de la letra '${letter}' guardado exitosamente para el usuario ${userId}`);
    } catch (e: any) {
      console.error(`FirebaseService: Error al guardar el progreso de la letra '${letter}':`, e);
      throw e;
    }
  }

  async getUserProgress(userId: string): Promise<{ [key: string]: { correct: number, total: number } }> {
    if (!userId) {
      console.error("FirebaseService: userId es nulo o indefinido al obtener el progreso.");
      return {};
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);
    console.log(`FirebaseService: Intentando obtener progreso para userId: ${userId}`);

    try {
      const docSnap = await getDoc(userProgressDocRef);
      if (docSnap.exists()) {
        console.log("FirebaseService: Progreso obtenido:", docSnap.data());
        return docSnap.data() as { [key: string]: { correct: number, total: number } };
      } else {
        console.log("FirebaseService: No se encontró progreso para el usuario:", userId);
        return {};
      }
    } catch (e: any) {
      console.error("FirebaseService: Error al obtener el progreso del usuario:", e);
      throw e;
    }
  }
}