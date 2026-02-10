// src/app/routes/public.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from '../features/public/login/login.component';
import { CreatePatientComponent } from '../features/public/create-patient/create-patient.component';
import { PublicComponent } from '../features/public/public.component';
import { PublicGuard } from '../guards/public.guard';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicComponent,
    canActivate: [PublicGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'create-patient',
        component: CreatePatientComponent
      }
    ]
  }
];