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
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }
    // Iniciar verificación en tiempo real del estado del correo
    this.startEmailVerificationCheck();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  async sendVerificationEmail(): Promise<void> {
    if (!this.currentUser) {
      this.presentToast('No hay usuario autenticado.', 'danger');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    this.loading = true;
    try {
      await this.firebaseService.sendVerificationEmail(this.currentUser);
      this.presentToast('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.', 'success');
    } catch (error: any) {
      console.error('Error al reenviar correo de verificación:', error);
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
      this.presentToast('No hay usuario autenticado.', 'danger');
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
      return;
    }

    try {
      // Forzar la recarga del usuario para obtener el estado más reciente
      await this.currentUser.reload();
      this.currentUser = this.firebaseService.getCurrentUser(); // Obtener la instancia recargada

      if (this.currentUser?.emailVerified) {
        this.presentToast('¡Tu correo ha sido verificado exitosamente!', 'success');
        if (this.refreshSubscription) {
          this.refreshSubscription.unsubscribe();
        }
        this.router.navigateByUrl('/home', { replaceUrl: true }); // Redirigir a la página principal
      } else {
        // Solo mostrar toast si fue una acción manual de recarga y aún no está verificado
        this.presentToast('Tu correo aún no ha sido verificado. Por favor, verifica tu bandeja de entrada.', 'warning');
      }
    } catch (error: any) {
      console.error('Error al recargar el usuario o verificar el estado:', error);
      this.presentToast('Error al verificar el estado del correo. Inténtalo de nuevo.', 'danger');
    }
  }

  startEmailVerificationCheck(): void {
    // Recargar el usuario cada pocos segundos para verificar el estado de verificación
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.refreshSubscription = interval(5000).subscribe(() => { // Cada 5 segundos
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
      console.error('Error al cerrar sesión:', error);
      this.presentToast('Error al cerrar sesión. Inténtalo de nuevo.', 'danger');
    }
  }
}