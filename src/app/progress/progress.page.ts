import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service'; // Importa el servicio de Firebase

interface LetterProgress {
  letter: string;
  correct: number;
  total: number;
  percentage: number;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProgressPage implements OnInit {

  // Array de todas las letras del abecedario en minúsculas
  alphabet: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];

  progressData: LetterProgress[] = [];
  overallCorrect: number = 0;
  overallTotal: number = 0;
  overallPercentage: number = 0;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService // Inyecta el servicio de Firebase
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.loadUserProgress();
  }

  async loadUserProgress() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid) {
      const userProgress = await this.firebaseService.getUserProgress(currentUser.uid);

      this.progressData = this.alphabet.map(letter => {
        const data = userProgress[letter] || { correct: 0, total: 0 };
        const percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        return {
          letter: letter,
          correct: data.correct,
          total: data.total,
          percentage: percentage
        };
      });

      // Calcular el resumen general
      this.overallCorrect = this.progressData.reduce((sum, item) => sum + item.correct, 0);
      this.overallTotal = this.progressData.reduce((sum, item) => sum + item.total, 0);
      this.overallPercentage = this.overallTotal > 0 ? Math.round((this.overallCorrect / this.overallTotal) * 100) : 0;

    } else {
      console.warn('No hay usuario autenticado para cargar el progreso.');
      // Inicializar con datos vacíos si no hay usuario
      this.progressData = this.alphabet.map(letter => ({
        letter: letter,
        correct: 0,
        total: 0,
        percentage: 0
      }));
    }
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}