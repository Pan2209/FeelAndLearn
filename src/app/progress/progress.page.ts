import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { FirebaseService } from '../services/firebase.service';

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

  alphabet: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];

  progressData: LetterProgress[] = [];
  overallCorrect: number = 0;
  overallTotal: number = 0;
  overallPercentage: number = 0;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    // La carga de datos se realiza en ionViewWillEnter
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.loadUserProgress();
  }

  async loadUserProgress() {
    const currentUser = this.firebaseService.getCurrentUser();
    if (currentUser && currentUser.uid) {
      try {
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

        this.overallCorrect = this.progressData.reduce((sum, item) => sum + item.correct, 0);
        this.overallTotal = this.progressData.reduce((sum, item) => sum + item.total, 0);
        this.overallPercentage = this.overallTotal > 0 ? Math.round((this.overallCorrect / this.overallTotal) * 100) : 0;

      } catch (error) {
        this.progressData = this.alphabet.map(letter => ({
          letter: letter,
          correct: 0,
          total: 0,
          percentage: 0
        }));
        this.overallCorrect = 0;
        this.overallTotal = 0;
        this.overallPercentage = 0;
      }
    } else {
      this.progressData = this.alphabet.map(letter => ({
        letter: letter,
        correct: 0,
        total: 0,
        percentage: 0
      }));
      this.overallCorrect = 0;
      this.overallTotal = 0;
      this.overallPercentage = 0;
    }
    this.isLoading = false;
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}