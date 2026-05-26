import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'ahorcado',
    loadComponent: () => import('./pages/juegos/ahorcado/ahorcado').then((m) => m.Ahorcado),
    canActivate: [authGuard],
  },
  {
    path: 'mayor-o-menor',
    loadComponent: () =>
      import('./pages/juegos/mayor-o-menor/mayor-o-menor').then((m) => m.MayorOMenor),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat').then((m) => m.Chat),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
    canActivate: [noAuthGuard],
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up').then((m) => m.SignUp),
    canActivate: [noAuthGuard],
  },
  {
    path: 'sobre-mi',
    loadComponent: () => import('./pages/sobre-mi/sobre-mi').then((m) => m.SobreMi),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
