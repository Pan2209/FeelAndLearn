// src/app/progress/progress.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProgressPage implements OnInit {

  progressData = [
    { lesson: 'Letra A', correct: 8, total: 10, percentage: 80 },
    { lesson: 'Letra B', correct: 7, total: 10, percentage: 70 },
    { lesson: 'Letra C', correct: 9, total: 10, percentage: 90 },
    { lesson: 'Letra D', correct: 6, total: 10, percentage: 60 },
  ];

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() { }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}