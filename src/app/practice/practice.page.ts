import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.page.html',
  styleUrls: ['./practice.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PracticePage implements OnInit {
  letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letrasChunked: string[][] = [];
  ipESP32 = 'http://10.10.6.37'; 
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
    fetch(`${this.ipESP32}/mostrar?letra=${letra}`)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        console.log('✅ Enviado:', body);
      })
      .catch(err => console.error(`❌ Error al enviar ${letra}:`, err));
  }

  resetearServos() {
    fetch(`${this.ipESP32}/reset`)
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        console.log('🔁 Servos reiniciados:', body);
      })
      .catch(err => console.error('❌ Error al resetear:', err));
  }
}
