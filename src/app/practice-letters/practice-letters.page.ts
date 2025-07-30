import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-practice-letters',
  templateUrl: './practice-letters.page.html',
  styleUrls: ['./practice-letters.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PracticeLettersPage implements OnInit {

  alphabet: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];
  shuffledAlphabet: string[] = [];
  currentPracticeIndex: number = 0;

  currentLetter: string = '';
  currentLetterImageUrl: string = '';

  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  practiceEnded: boolean = false;

  // Almacenar los resultados por letra durante la sesión de práctica
  // Esto registrará 1 o 0 aciertos para cada letra en la sesión actual
  private sessionResults: { [key: string]: { correct: number, total: number } } = {};

  constructor(
    private router: Router,
    private toastController: ToastController,
    private firebaseService: FirebaseService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.startNewPracticeSession();
  }

  shuffleArray(array: string[]): string[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  startNewPracticeSession() {
    this.sessionResults = {}; // Reiniciar resultados de la sesión
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentPracticeIndex = 0;
    this.practiceEnded = false;
    this.shuffledAlphabet = this.shuffleArray([...this.alphabet]);
    console.log("PracticeLettersPage: Nueva sesión iniciada. Abecedario mezclado:", this.shuffledAlphabet);
    this.loadNextLetter();
  }

  loadNextLetter() {
    if (this.currentPracticeIndex < this.shuffledAlphabet.length) {
      this.currentLetter = this.shuffledAlphabet[this.currentPracticeIndex];
      this.currentLetterImageUrl = this.getLetterImageUrl(this.currentLetter);
      this.sendLetterToBrailleDevice(this.currentLetter);
      console.log(`PracticeLettersPage: Cargando letra ${this.currentPracticeIndex + 1}/${this.shuffledAlphabet.length}: '${this.currentLetter}'`);
    } else {
      this.practiceEnded = true; // Todas las letras han sido presentadas
      console.log("PracticeLettersPage: Sesión de práctica finalizada. Todas las letras presentadas.");
      this.savePracticeResults(); // Guardar resultados al finalizar
    }
  }

  getLetterImageUrl(letter: string): string {
    return `https://placehold.co/250x250/transparent/6495ED?text=${letter.toUpperCase()}`;
  }

  markAnswer(isCorrect: boolean) {
    // CRÍTICO: Asegurarse de que cada letra presentada tenga un registro de 1 intento en la sesión.
    // Si la letra ya está en sessionResults (por alguna razón rara), la actualizamos.
    // Si no está, la inicializamos con 1 intento para esta sesión.
    this.sessionResults[this.currentLetter] = { 
      correct: isCorrect ? 1 : 0, 
      total: 1 
    };

    if (isCorrect) {
      this.correctAnswers++;
      this.presentToast('¡Correcto!');
    } else {
      this.incorrectAnswers++;
      this.presentToast('Incorrecto.');
    }
    console.log(`PracticeLettersPage: Respuesta marcada para '${this.currentLetter}'. Correcta: ${isCorrect}. sessionResults para esta letra:`, this.sessionResults[this.currentLetter]);
    this.currentPracticeIndex++;
    this.loadNextLetter();
  }

  private sendLetterToBrailleDevice(letter: string) {
    console.log(`PracticeLettersPage: Enviando letra '${letter}' al dispositivo Braille para práctica.`);
  }

  private async savePracticeResults() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid) {
      console.log(`PracticeLettersPage: savePracticeResults - Usuario autenticado: ${currentUser.uid}.`);
      console.log("PracticeLettersPage: savePracticeResults - sessionResults ANTES de procesar para guardar:", JSON.parse(JSON.stringify(this.sessionResults)));
      
      try {
        // Obtener el progreso actual del usuario UNA SOLA VEZ
        let currentOverallProgress = await this.firebaseService.getUserProgress(currentUser.uid);
        console.log("PracticeLettersPage: savePracticeResults - Progreso general actual obtenido de Firebase:", currentOverallProgress);

        // Iterar sobre el alfabeto COMPLETO para actualizar el progreso
        for (const letter of this.alphabet) { 
          // Obtener los resultados de esta letra para la sesión actual.
          // Si la letra NO fue interactuada en esta sesión (lo cual no debería pasar en una sesión completa),
          // se asume 0 correctas y 1 total para esta sesión.
          const correctForThisSession = this.sessionResults[letter]?.correct || 0;
          const totalForThisSession = this.sessionResults[letter]?.total || 1; // Aseguramos que si no se interactuó, el total sea 1 para esta sesión.

          // Actualizar los datos de la letra en el objeto de progreso general
          const existingLetterData = currentOverallProgress[letter] || { correct: 0, total: 0 };
          existingLetterData.correct += correctForThisSession;
          existingLetterData.total += totalForThisSession;
          currentOverallProgress = {
            ...currentOverallProgress,
            [letter]: existingLetterData
          };
          console.log(`PracticeLettersPage: savePracticeResults - Actualizando en memoria letra '${letter}': Aciertos (sesión): ${correctForThisSession}, Intentos (sesión): ${totalForThisSession}. Nuevo acumulado: ${existingLetterData.correct}/${existingLetterData.total}`);
        }

        // Guardar el objeto de progreso general actualizado UNA SOLA VEZ en Firebase
        await this.firebaseService.setOverallUserProgress(currentUser.uid, currentOverallProgress);
        this.presentToast('Resultados de la práctica guardados.');
        console.log("PracticeLettersPage: savePracticeResults - Todos los resultados de la práctica han sido enviados a Firebase en una sola operación.");

      } catch (error) {
        console.error('PracticeLettersPage: savePracticeResults - Error al guardar el progreso de la práctica:', error);
        this.presentToast('Error al guardar el progreso de la práctica.');
      }

    } else {
      console.warn('PracticeLettersPage: savePracticeResults - No hay usuario autenticado para guardar el progreso. Asegúrate de iniciar sesión.');
      this.presentToast('No se pudo guardar el progreso (usuario no autenticado).');
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  goToProgressPage() {
    this.router.navigateByUrl('/progress');
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}