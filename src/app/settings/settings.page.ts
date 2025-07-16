// src/app/settings/settings.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router'; // Solo Router, no RouterLink
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] // Eliminado RouterLink
})
export class SettingsPage implements OnInit {

  username: string = 'Nombre de Usuario';
  email: string = 'usuario@ejemplo.com';

  constructor(private router: Router) {
    addIcons({ arrowBackOutline });
  }

  ngOnInit() { }

  async changePassword() {
    console.log('Navegar a la página de cambio de contraseña o abrir modal.');
  }

  async logout() {
    console.log('Cerrar sesión del usuario.');
    this.router.navigateByUrl('/auth/login');
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}