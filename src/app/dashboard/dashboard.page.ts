import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DashboardPage implements OnInit {

  // No necesitamos 'message', 'testDataInput' ni 'firestoreDocuments' en la página Main
  // Puedes añadir otras propiedades aquí más adelante si tu página Main las necesita.

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    // No necesitamos cargar documentos de prueba al iniciar esta página.
    // Aquí puedes inicializar cualquier dato que necesite tu página Main.
  }

  async logout() {
    try {
      await this.firebaseService.logoutUser();
      console.log('Sesión cerrada.');
      // Redirigir a la página de login después de cerrar sesión
      this.router.navigateByUrl('/auth/login');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      // Podrías mostrar un mensaje de error si lo consideras necesario, pero lo quitamos para la simplicidad de Main
    }
  }

  // Métodos de Firestore eliminados de esta página, ya que no corresponden a 'Main'
  // Si necesitas añadir lógica para los botones de tu diseño (Aprender Abecedario, etc.),
  // lo haremos en pasos posteriores aquí.
}