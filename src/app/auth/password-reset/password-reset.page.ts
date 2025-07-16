// src/app/auth/password-reset/password-reset.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importar IonicModule y ToastController
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service'; // Importar FirebaseService
import { addIcons } from 'ionicons'; // Importar addIcons
import { arrowBackOutline } from 'ionicons/icons'; // Importar el ícono específico

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
  standalone: true,
  // Asegúrate de importar IonicModule para que los componentes como ion-button, ion-input, etc. funcionen
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PasswordResetPage implements OnInit {
  email: string = '';
  loading: boolean = false; // Para controlar el estado de carga

  constructor(
    private router: Router,
    private firebaseService: FirebaseService, // Inyectar FirebaseService
    private toastController: ToastController // Inyectar ToastController
  ) {
    addIcons({ arrowBackOutline }); // Registrar el ícono para el botón de atrás
  }

  ngOnInit() { }

  // Método para enviar el correo de restablecimiento de contraseña
  async resetPassword() {
    if (!this.email) {
      this.presentToast('Por favor, ingresa tu correo electrónico.', 'danger');
      return;
    }

    this.loading = true; // Activar el estado de carga
    try {
      await this.firebaseService.sendPasswordResetEmail(this.email);
      this.presentToast('Se ha enviado un correo de restablecimiento de contraseña a tu dirección.', 'success');
      this.router.navigateByUrl('/auth/login'); // Redirigir al login después de enviar el correo
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      let errorMessage = 'Error al enviar el correo de restablecimiento. Inténtalo de nuevo.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No se encontró ningún usuario con ese correo electrónico.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es inválido.';
      }
      this.presentToast(errorMessage, 'danger');
    } finally {
      this.loading = false; // Desactivar el estado de carga
    }
  }

  // Función para mostrar un Toast (mensaje temporal)
  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  // Método para volver a la página de login
  goBack() {
    this.router.navigateByUrl('/auth/login');
  }
}
