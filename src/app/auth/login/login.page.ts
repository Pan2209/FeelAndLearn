// src/app/auth/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Importar IonicModule y los controladores de Toast y Loading
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router'; // Solo Router, ya que no usamos routerLink directamente en el TS

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // Eliminar RouterLink de imports si no se usa directamente en el template con routerLink=""
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  message: string = '';
  loading: boolean = false; // Para controlar el estado de carga del botón

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private toastController: ToastController, // Inyectar ToastController
    private loadingController: LoadingController // Inyectar LoadingController
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.email = '';
    this.password = '';
    this.message = '';
  }

  async login() {
    this.message = ''; // Limpiar mensaje anterior
    if (!this.email || !this.password) {
      this.presentToast('Por favor, ingresa tu correo y contraseña.', 'danger');
      return;
    }

    this.loading = true; // Activar el estado de carga
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const user = await this.firebaseService.loginUser(this.email, this.password);
      this.message = `Inicio de sesión exitoso! Usuario: ${user.email}`;
      console.log('Usuario logeado:', user);
      this.presentToast('Inicio de sesión exitoso.', 'success'); // Mostrar Toast de éxito
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico es incorrecto.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Correo electrónico o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Demasiados intentos fallidos. Inténtalo de nuevo más tarde.';
      }
      this.message = errorMessage; // Actualizar el mensaje en la UI
      this.presentToast(errorMessage, 'danger'); // Mostrar Toast de error
    } finally {
      this.loading = false; // Desactivar el estado de carga
      await loading.dismiss();
    }
  }

  // Método para navegar a la página de registro
  goToRegister() {
    this.router.navigateByUrl('/auth/register');
  }

  // MÉTODO CORREGIDO: Eliminar console.log y debugger
  goToPasswordReset() {
    this.router.navigateByUrl('/auth/password-reset');
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
}
