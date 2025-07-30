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
    this.sessionResults = {};
    this.correctAnswers = 0;
    this.incorrectAnswers = 0;
    this.currentPracticeIndex = 0;
    this.practiceEnded = false;
    this.shuffledAlphabet = this.shuffleArray([...this.alphabet]);
    this.loadNextLetter();
  }

  loadNextLetter() {
    if (this.currentPracticeIndex < this.shuffledAlphabet.length) {
      this.currentLetter = this.shuffledAlphabet[this.currentPracticeIndex];
      this.currentLetterImageUrl = this.getLetterImageUrl(this.currentLetter);
      this.sendLetterToBrailleDevice(this.currentLetter);
    } else {
      this.practiceEnded = true;
      console.log("PracticeLettersPage: Sesión de práctica finalizada. Guardando resultados.");
      this.savePracticeResults();
    }
  }

  getLetterImageUrl(letter: string): string {
    return `https://placehold.co/250x250/transparent/6495ED?text=${letter.toUpperCase()}`;
  }

  markAnswer(isCorrect: boolean) {
    if (!this.sessionResults[this.currentLetter]) {
      this.sessionResults[this.currentLetter] = { correct: 0, total: 0 };
    }
    this.sessionResults[this.currentLetter].total++;

    if (isCorrect) {
      this.sessionResults[this.currentLetter].correct++;
      this.correctAnswers++;
      this.presentToast('¡Correcto!');
    } else {
      this.incorrectAnswers++;
      this.presentToast('Incorrecto.');
    }
    this.currentPracticeIndex++;
    this.loadNextLetter();
  }

  private sendLetterToBrailleDevice(letter: string) {
    console.log(`PracticeLettersPage: Enviando letra '${letter}' al dispositivo Braille para práctica.`);
  }

  private async savePracticeResults() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid) {
      console.log(`PracticeLettersPage: Usuario autenticado: ${currentUser.uid}. Procediendo a guardar resultados.`);
      for (const letter of Object.keys(this.sessionResults)) {
        const { correct, total } = this.sessionResults[letter];
        console.log(`PracticeLettersPage: Guardando para letra '${letter}': Correctas: ${correct}, Total: ${total}`);
        await this.firebaseService.saveUserLetterProgress(currentUser.uid, letter, correct, total);
      }
      this.presentToast('Resultados de la práctica guardados.');
    } else {
      console.warn('PracticeLettersPage: No hay usuario autenticado para guardar el progreso. Asegúrate de iniciar sesión.');
      this.presentToast('No se pudo guardar el progreso (usuario no autenticado).');
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  goToProgressPage() {
    this.router.navigateByUrl('/progress');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });
    toast.present();
  }
}