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

  private readonly ESP32_URL = 'http://10.10.4.73';

  constructor(private firebaseService: FirebaseService, private router: Router) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {}

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

  startAlphabet() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letras.forEach((letra, index) => {
      setTimeout(() => {
        fetch(`${this.ESP32_URL}/mostrar?letra=${letra}`)
          .then(() => console.log(`Letra ${letra} enviada al ESP32`))
          .catch(err => console.error(`Error enviando ${letra}`, err));
      }, index * 2000);
    });
  }

  goToPractice() {
    this.router.navigateByUrl('/practices');
  }
}
