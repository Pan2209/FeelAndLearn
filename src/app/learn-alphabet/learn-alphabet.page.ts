import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-learn-alphabet',
  templateUrl: './learn-alphabet.page.html',
  styleUrls: ['./learn-alphabet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class LearnAlphabetPage implements OnInit {
  alphabet: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];
  alphabetGrid: string[][] = [];

  esp32IP: string = 'http://192.168.0.100'; // <-- Cambia esta IP según tu red

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.createAlphabetGrid();
  }

  createAlphabetGrid() {
    const lettersPerRow = 3;
    for (let i = 0; i < this.alphabet.length; i += lettersPerRow) {
      this.alphabetGrid.push(this.alphabet.slice(i, i + lettersPerRow));
    }
  }

  selectLetter(letter: string) {
    this.sendLetterToESP32(letter);
  }

  private sendLetterToESP32(letter: string) {
    const endpoint = `${this.esp32IP}/letter${letter.toUpperCase()}`; // Ej: /letterA

    this.http.get(endpoint).subscribe({
      next: () => {
        this.presentToast(`Letra enviada: ${letter}`);
      },
      error: () => {
        this.presentToast(`Error al enviar la letra: ${letter}`);
      }
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  resetBraille() {
  this.http.get(`${this.esp32IP}/reset`).subscribe({
    next: () => this.presentToast('Braille reseteado'),
    error: () => this.presentToast('Error al resetear Braille')
  });
}

}
