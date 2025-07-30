import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular'; // Agrega ToastController
import { PrivacyPolicyModalPage } from '../privacy-policy-modal/privacy-policy-modal.page';
import { FirebaseService } from 'src/app/services/firebase.service'; // Importa FirebaseService
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {

  username!: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
  privacyAccepted: boolean = false;
  hasReadPrivacyPolicy: boolean = false; // Controla si se ha leído la política de privacidad
  message: string = '';

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService, // Inyecta FirebaseService
    private router: Router, // Inyecta Router
    private toastController: ToastController // Inyecta ToastController
  ) { }

  ngOnInit() {
    this.hasReadPrivacyPolicy = false;
  }

  async openPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyModalPage,
      cssClass: 'privacy-modal-class'
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('Modal dismissed with role', role);
    console.log('Modal dismissed with data', data);

    if (role === 'viewed') {
      this.hasReadPrivacyPolicy = true;
      this.message = '';
      console.log('Modal de privacidad visto y cerrado. Checkbox habilitado.');
    } else {
      this.hasReadPrivacyPolicy = false;
      this.privacyAccepted = false;
      console.log('Modal de privacidad no visto completamente o cancelado.');
    }
  }

  async register() { // Marca el método como async
    // Validaciones
    if (!this.email || !this.password || !this.confirmPassword || !this.username) { // Añade username a la validación
      this.presentToast('Por favor, completa todos los campos.', 'danger');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden.', 'danger');
      return;
    }
    if (this.password.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres.', 'danger');
      return;
    }
    if (!this.privacyAccepted) {
      this.presentToast('Debe aceptar las Políticas de Privacidad.', 'danger');
      return;
    }

    try {
      // Llama al servicio de Firebase para crear el usuario
      // NO se envía el correo de verificación aquí. Se hará desde verify-email.page.ts
      await this.firebaseService.registerUser(this.email, this.password);
      
      this.presentToast('Cuenta creada. Redirigiendo para verificación de correo.', 'success');
      // Redirige a la página de verificación
      this.router.navigateByUrl('/verify-email'); 
      
    } catch (error: any) {
      let errorMessage = 'Error al registrar. Inténtalo de nuevo.';
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'El correo electrónico ya está en uso.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico es inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
            break;
          default:
            errorMessage = `Error de Firebase: ${error.message}`;
            break;
        }
      }
      console.error('RegisterPage: Error durante el registro:', error);
      this.presentToast(errorMessage, 'danger');
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color
    });
    toast.present();
  }
}