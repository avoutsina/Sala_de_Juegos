import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { adminGuard } from './guards/admin.guard';

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
    path: 'preguntados',
    loadComponent: () =>
      import('./pages/juegos/preguntados/preguntados').then((m) => m.Preguntados),
    canActivate: [authGuard],
  },
  {
    path: 'encuentra-la-bola',
    loadComponent: () =>
      import('./pages/juegos/encuentra-la-bola/encuentra-la-bola').then((m) => m.EncuentraLaBola),
    canActivate: [authGuard],
  },
  {
    path: 'resultados',
    loadComponent: () => import('./pages/resultados/resultados').then((m) => m.Resultados),
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
  path: 'encuesta',
  loadComponent: () => import('./pages/encuesta/encuesta').then((m) => m.Encuesta),
  canActivate: [authGuard],   // solo usuarios logueados
},
{
  path: 'encuesta-resultados',
  loadComponent: () => import('./pages/encuesta-resultados/encuesta-resultados').then((m) => m.EncuestaResultados),
  canActivate: [adminGuard],  // solo admins
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
