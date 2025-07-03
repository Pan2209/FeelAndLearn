import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.page.html',
  styleUrls: ['./privacy-policy-modal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrivacyPolicyModalPage implements OnInit {

  @ViewChild('privacyPolicyContent') privacyPolicyContent!: IonContent;

  // CAMBIO AQUÍ: Inicializamos a 'true' para que el botón esté siempre activo
  hasScrolledToBottom: boolean = true; 

  constructor(
    private modalController: ModalController,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    // Si el botón siempre va a estar activo, esta lógica no es estrictamente necesaria para el botón.
    // Sin embargo, si quieres mantenerla para futura referencia o si en algún momento
    // decides volver a habilitar el scroll, puedes dejarla.
    // Por ahora, la dejamos pero no afectará el estado del botón.
    console.log('Modal ionViewDidEnter: Comprobando estado de scroll (lógica no afecta estado del botón).');
    setTimeout(async () => {
      // Puedes comentar o eliminar esta línea si no quieres que se ejecute la comprobación de scroll.
      // Si la dejas, no influirá en el estado del botón porque hasScrolledToBottom es true por defecto.
      await this.checkScrollStatus(); 
      this.cdr.detectChanges(); 
      console.log('Modal ionViewDidEnter: Detección de cambios forzada.');
    }, 1000); 
  }

  async checkScrollStatus() {
    // Esta función ya no es relevante para el estado del botón "Continuar"
    // porque `hasScrolledToBottom` es `true` por defecto.
    // Puedes comentarla o eliminarla si no la necesitas para otros propósitos.
    console.log('checkScrollStatus: Ejecutando, pero el botón de continuar siempre está activo.');
    if (!this.privacyPolicyContent) {
      console.error('checkScrollStatus: privacyPolicyContent no está disponible.');
      return;
    }

    try {
      const scrollElement = await this.privacyPolicyContent.getScrollElement();
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;
      const scrollTop = scrollElement.scrollTop;

      console.log(`[Check Scroll Status] ScrollHeight: ${scrollHeight}, ClientHeight: ${clientHeight}, ScrollTop: ${scrollTop}`);
      const remaining = scrollHeight - (scrollTop + clientHeight);
      console.log(`[Check Scroll Status] Remaining to bottom: ${remaining.toFixed(2)}`);

      const initialTolerance = 5;
      // Solo para registro interno, no cambia `this.hasScrolledToBottom`
      if (remaining <= initialTolerance) {
        console.log('Contenido es más corto o ya está al final.');
      } else {
        console.log('Contenido requiere scroll para llegar al final.');
      }
    } catch (error) {
      console.error('Error al obtener elementos de scroll en checkScrollStatus:', error);
    }
  }

  async onScrollPrivacyPolicy(event: any) {
    // Esta función ya no es relevante para el estado del botón "Continuar"
    // porque `hasScrolledToBottom` es `true` por defecto.
    // Puedes comentarla o eliminarla si no la necesitas para otros propósitos.
    console.log('onScrollPrivacyPolicy: Ejecutando, pero el botón de continuar siempre está activo.');
    if (!this.privacyPolicyContent) {
        console.error('onScrollPrivacyPolicy: privacyPolicyContent no está disponible.');
        return;
    }

    try {
      const scrollElement = await event.detail.getScrollElement();
      const scrollHeight = scrollElement.scrollHeight;
      const scrollTop = scrollElement.scrollTop;
      const clientHeight = scrollElement.clientHeight;

      console.log(`[Scroll Event] scrollTop=${scrollTop.toFixed(2)}, clientHeight=${clientHeight.toFixed(2)}, scrollHeight=${scrollHeight.toFixed(2)}`);
      const remaining = scrollHeight - (scrollTop + clientHeight);
      console.log(`[Scroll Event] Remaining to bottom: ${remaining.toFixed(2)}`);

      // La variable hasScrolledToBottom se mantiene en true, no se modifica aquí.
      this.cdr.detectChanges(); // Forzar detección de cambios si hay otros elementos reactivos.
    } catch (error) {
      console.error('Error al obtener elementos de scroll en onScrollPrivacyPolicy:', error);
    }
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    // Ya no es necesario verificar `hasScrolledToBottom` aquí porque siempre es true.
    console.log('Modal: Botón Continuar presionado. Dismissing...');
    this.modalController.dismiss(null, 'viewed'); 
  }
}