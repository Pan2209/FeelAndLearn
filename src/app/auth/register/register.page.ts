import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { PrivacyPolicyModalPage } from '../privacy-policy-modal/privacy-policy-modal.page';

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

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    // Inicializar hasReadPrivacyPolicy a false al cargar la página
    this.hasReadPrivacyPolicy = false;
  }

  async openPrivacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyModalPage,
      cssClass: 'privacy-modal-class' // Clase CSS definida en register.page.scss
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    console.log('Modal dismissed with role', role);
    console.log('Modal dismissed with data', data);

    // Si el modal se cerró después de haber sido visto completamente (rol 'viewed')
    if (role === 'viewed') { // ¡AJUSTADO AQUÍ!
      this.hasReadPrivacyPolicy = true; // El usuario ha visto la política
      this.message = ''; // Limpiar cualquier mensaje previo
      console.log('Modal de privacidad visto y cerrado. Checkbox habilitado.');
    } else {
      // Si se cerró por cancelar o de otra manera, no se considera leído
      this.hasReadPrivacyPolicy = false;
      this.privacyAccepted = false; // Asegurar que el checkbox no esté marcado
      console.log('Modal de privacidad no visto completamente o cancelado.');
    }
  }

  register() {
    // Lógica de registro
    if (this.password !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.privacyAccepted) {
      this.message = 'Debe aceptar las Políticas de Privacidad.';
      return;
    }
    // Si todo está bien, procede con el registro
    this.message = '¡Registro exitoso!';
    console.log('Usuario registrado:', {
      username: this.username,
      email: this.email,
      password: this.password,
      privacyAccepted: this.privacyAccepted
    });
  }
}