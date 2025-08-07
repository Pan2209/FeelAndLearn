import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- AÑADIDO
import { arrowBackOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-practice-letters',
  templateUrl: './practice-letters.page.html',
  styleUrls: ['./practice-letters.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule] // <-- AÑADIDO
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
  randomHueRotate: string = '0deg'; 
  correctAnswers: number = 0;
  incorrectAnswers: number = 0;
  practiceEnded: boolean = false;

  private sessionResults: { [key: string]: { correct: number, total: number } } = {};

  esp32IP: string = 'http://192.168.0.100'; // <-- IP del ESP32

  constructor(
    private router: Router,
    private toastController: ToastController,
    private firebaseService: FirebaseService,
    private http: HttpClient // <-- AÑADIDO
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
      this.currentLetterImageUrl = `https://placehold.co/250x250/transparent/FFFFFF?text=${this.currentLetter}`; 
      this.randomHueRotate = `${Math.floor(Math.random() * 360)}deg`;
      this.sendLetterToBrailleDevice(this.currentLetter); // <-- ENVÍA AL ESP32
    } else {
      this.practiceEnded = true;
      this.savePracticeResults();
    }
  }

  markAnswer(isCorrect: boolean) {
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

    this.currentPracticeIndex++;
    this.loadNextLetter();
  }

  private sendLetterToBrailleDevice(letter: string) {
    const endpoint = `${this.esp32IP}/letter${letter.toUpperCase()}`;
    this.http.get(endpoint).subscribe({
      next: () => {
        console.log(`Letra '${letter}' enviada al ESP32`);
      },
      error: () => {
        this.presentToast(`Error al enviar letra '${letter}' al dispositivo`);
      }
    });
  }

  private async savePracticeResults() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid) {
      try {
        let currentOverallProgress = await this.firebaseService.getUserProgress(currentUser.uid);

        for (const letter of this.alphabet) { 
          const correctForThisSession = this.sessionResults[letter]?.correct || 0;
          const totalForThisSession = this.sessionResults[letter]?.total || 1;

          const existingLetterData = currentOverallProgress[letter] || { correct: 0, total: 0 };
          existingLetterData.correct += correctForThisSession;
          existingLetterData.total += totalForThisSession;
          currentOverallProgress = {
            ...currentOverallProgress,
            [letter]: existingLetterData
          };
        }

        await this.firebaseService.setOverallUserProgress(currentUser.uid, currentOverallProgress);
        this.presentToast('Resultados de la práctica guardados.');
      } catch (error) {
        console.error('Error al guardar el progreso:', error);
        this.presentToast('Error al guardar el progreso.');
      }

    } else {
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
      position: 'bottom',
      color
    });
    toast.present();
  }
}
