// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login', // Redirige a la página de login por defecto
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'home', // Mantengo esta ruta aunque no la uses por si la necesitas más adelante
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'privacy-policy-modal', // Mantengo esta ruta por si la necesitas más adelante
    loadComponent: () => import('./auth/privacy-policy-modal/privacy-policy-modal.page').then( m => m.PrivacyPolicyModalPage)
  },
  { // RUTA: Ajustes
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage)
  },
  { // RUTA: Ver Progreso
    path: 'progress',
    loadComponent: () => import('./progress/progress.page').then(m => m.ProgressPage)
  },
  { // RUTA: Restablecer Contraseña
    path: 'auth/password-reset', // ¡Esta ruta debe existir y ser correcta!
    loadComponent: () => import('./auth/password-reset/password-reset.page').then(m => m.PasswordResetPage)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./auth/verify-email/verify-email.page').then( m => m.VerifyEmailPage)
  },
  {
    path: 'practices',
    loadComponent: () => import('./practice/practice.page').then( m => m.PracticePage)
  },

];
