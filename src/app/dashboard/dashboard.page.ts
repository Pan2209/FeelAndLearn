import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  constructor(private firebaseService: FirebaseService, private router: Router) {
    addIcons({ logOutOutline });
  }

  ngOnInit() { }

  async logout() {
    try {
      await this.firebaseService.logoutUser();
      console.log('Sesión cerrada.');
      this.router.navigateByUrl('/auth/login');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  goToSettings() {
    this.router.navigateByUrl('/settings');
  }

  goToProgress() {
    this.router.navigateByUrl('/progress');
  }

  goToLearnAlphabet() {
    this.router.navigateByUrl('/learn-alphabet');
  }

  // DESCOMENTADO: Método para navegar a la página de Practicar Letras
  goToPracticeLetters() {
    this.router.navigateByUrl('/practice-letters');
  }
}