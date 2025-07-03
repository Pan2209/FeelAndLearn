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
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'privacy-policy-modal',
    loadComponent: () => import('./auth/privacy-policy-modal/privacy-policy-modal.page').then( m => m.PrivacyPolicyModalPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress.page').then( m => m.ProgressPage)
  },
];