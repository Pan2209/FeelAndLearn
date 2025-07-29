import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-learn-alphabet',
  templateUrl: './learn-alphabet.page.html',
  styleUrls: ['./learn-alphabet.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LearnAlphabetPage implements OnInit {
  alphabet: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];
  alphabetGrid: string[][] = [];

  constructor(
    private router: Router,
    private toastController: ToastController
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
    this.sendLetterToBrailleDevice(letter);
  }

  private sendLetterToBrailleDevice(letter: string) {
    console.log(`Enviando letra '${letter}' al dispositivo Braille.`);
    // CORRECCIÓN AQUÍ: Mostrar la letra en minúscula en el Toast
    this.presentToast(`Mostrando letra: ${letter}`);
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
}