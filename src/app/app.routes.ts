// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './routes/public.routes';
import { PRIVATE_ROUTES } from './routes/private.routes';

export const routes: Routes = [
  // Routes publiques
  {
    path: 'public',
    children: PUBLIC_ROUTES
  },

  // Routes privées
  {
    path: 'private',
    children: PRIVATE_ROUTES
  },

  // Redirections par défaut
  {
    path: '',
    redirectTo: '/public/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/public/login',
    pathMatch: 'full'
  }
];