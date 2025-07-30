import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { addIcons } from 'ionicons';
import { mailOutline, checkmarkCircleOutline, refreshOutline } from 'ionicons/icons';
import { User } from '@angular/fire/auth';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class VerifyEmailPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loading: boolean = false;
  private refreshSubscription: Subscription | null = null;
  private emailSentAutomatically: boolean = false;

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private toastController: ToastController
  ) {
    addIcons({ mailOutline, checkmarkCircleOutline, refreshOutline });
  }

  ngOnInit() {
    this.currentUser = this.firebaseService.getCurrentUser();
    if (!this.currentUser) {
      console.warn('VerifyEmailPage: No hay usuario autenticado. Redirigiendo a login.');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    if (!this.currentUser.emailVerified && !this.emailSentAutomatically) {
      this.sendVerificationEmail();
      this.emailSentAutomatically = true;
    }

    this.startEmailVerificationCheck();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
      console.log('VerifyEmailPage: Suscripción de verificación de correo desuscrita.');
    }
  }

  async sendVerificationEmail(): Promise<void> {
    if (!this.currentUser) {
      this.presentToast('No hay usuario autenticado para enviar el correo de verificación.', 'danger');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    this.loading = true;
    try {
      console.log('VerifyEmailPage: Intentando reenviar correo de verificación...');
      await this.firebaseService.sendVerificationEmail(this.currentUser);
      this.presentToast('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.', 'success');
    } catch (error: any) {
      console.error('VerifyEmailPage: Error al reenviar correo de verificación:', error);
      let errorMessage = 'Error al enviar el correo de verificación. Inténtalo de nuevo.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Has enviado demasiados correos. Intenta de nuevo en un momento.';
      }
      this.presentToast(errorMessage, 'danger');
    } finally {
      this.loading = false;
    }
  }

  async reloadUserAndCheckVerification(): Promise<void> {
    if (!this.currentUser) {
      console.warn('VerifyEmailPage: No hay usuario autenticado al intentar recargar. Redirigiendo a login.');
      this.presentToast('Sesión caducada. Por favor, inicia sesión de nuevo.', 'danger');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    try {
      await this.currentUser.reload();
      this.currentUser = this.firebaseService.getCurrentUser();

      if (this.currentUser?.emailVerified) {
        this.presentToast('¡Tu correo ha sido verificado exitosamente! Ahora puedes iniciar sesión.', 'success');
        if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
        }
        // CRÍTICO: Redirigir a la página de inicio de sesión
        this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      } else {
        console.log('VerifyEmailPage: Correo aún no verificado. Reintentando...');
      }
    } catch (error: any) {
      console.error('VerifyEmailPage: Error al recargar el usuario o verificar el estado:', error);
      this.presentToast('Error al verificar el estado del correo. Inténtalo de nuevo.', 'danger');
    }
  }

  startEmailVerificationCheck(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    console.log('VerifyEmailPage: Iniciando verificación automática del estado del correo cada 5 segundos.');
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.reloadUserAndCheckVerification();
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  async logout() {
    try {
      await this.firebaseService.logoutUser();
      this.presentToast('Sesión cerrada.', 'success');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    } catch (error) {
      console.error('VerifyEmailPage: Error al cerrar sesión:', error);
      this.presentToast('Error al cerrar sesión. Inténtalo de nuevo.', 'danger');
    }
  }
}