import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home/home').then((m) => m.Home) },
  {
    path: 'sobre-mi',
    loadComponent: () => import('./pages/sobre-mi/sobre-mi').then((m) => m.SobreMi),
  },
  { path: 'login', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'sign-up', loadComponent: () => import('./pages/sign-up/sign-up').then((m) => m.SignUp) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
