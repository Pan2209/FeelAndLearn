import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.page.html',
  styleUrls: ['./practice.page.scss'],
  standalone: true,
  imports:[IonicModule, CommonModule, FormsModule]
})
export class PracticePage implements OnInit {
  letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letrasChunked: string[][] = [];

  ngOnInit() {
    this.letrasChunked = this.chunk(this.letras, 6);
  }

  chunk(arr: any[], size: number): any[][] {
    const res = [];
    for (let i = 0; i < arr.length; i += size) {
      res.push(arr.slice(i, i + size));
    }
    return res;
  }

  enviarLetra(letra: string) {
    fetch(`http://10.10.4.73/mostrar?letra=${letra}`)
      .then(() => console.log(`Letra ${letra} enviada al ESP32`))
      .catch(err => console.error(`Error al enviar ${letra}`, err));
  }
}
