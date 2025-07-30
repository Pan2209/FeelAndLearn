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
      console.log("FirebaseService: Intentando crear usuario:", email);
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      console.log("FirebaseService: Usuario creado exitosamente:", user.uid);
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

  // NUEVO MÉTODO: Para guardar el objeto de progreso completo en una sola operación.
  async setOverallUserProgress(userId: string, progressData: { [key: string]: { correct: number, total: number } }): Promise<void> {
    if (!userId) {
      console.error("FirebaseService: setOverallUserProgress - userId es nulo o indefinido.");
      return;
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);
    console.log(`FirebaseService: setOverallUserProgress - Intentando guardar progreso general para userId: ${userId}`);
    console.log("FirebaseService: setOverallUserProgress - Datos a escribir:", progressData);

    try {
      await setDoc(userProgressDocRef, progressData);
      console.log("FirebaseService: setOverallUserProgress - Progreso general guardado exitosamente.");
    } catch (e: any) {
      console.error("FirebaseService: setOverallUserProgress - Error al guardar el progreso general:", e);
      throw e;
    }
  }


  async getUserProgress(userId: string): Promise<{ [key: string]: { correct: number, total: number } }> {
    if (!userId) {
      console.error("FirebaseService: getUserProgress - userId es nulo o indefinido.");
      return {};
    }
    const userProgressDocRef = doc(this.firestore, `users/${userId}/progress/overall`);
    console.log(`FirebaseService: getUserProgress - Intentando obtener progreso para userId: ${userId}`);

    try {
      const docSnap = await getDoc(userProgressDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as { [key: string]: { correct: number, total: number } };
        console.log("FirebaseService: getUserProgress - Progreso obtenido de DB:", data);
        return data;
      } else {
        console.log("FirebaseService: getUserProgress - No se encontró progreso para el usuario:", userId);
        return {};
      }
    } catch (e: any) {
      console.error("FirebaseService: getUserProgress - Error al obtener el progreso del usuario:", e);
      throw e;
    }
  }
}