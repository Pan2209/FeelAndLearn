import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) { }

  ngOnInit() {
    // ngOnInit se ejecuta una sola vez cuando el componente se inicializa.
  }

  ionViewWillEnter() {
    // Esto se ejecuta cada vez que la página está a punto de entrar en la vista.
    this.email = '';
    this.password = '';
    this.message = '';
  }

  async login() {
    this.message = '';
    try {
      const user = await this.firebaseService.loginUser(this.email, this.password);
      this.message = `Inicio de sesión exitoso! Usuario: ${user.email}`;
      console.log('Usuario logeado:', user);
      this.router.navigateByUrl('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        this.message = 'El formato del email es incorrecto.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.message = 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.';
      } else {
        this.message = `Error al iniciar sesión: ${error.message}`;
      }
      console.error('Error de inicio de sesión:', error);
    }
  }
}