// src/app/routes/private.routes.ts
import { Routes } from '@angular/router';
import { PrivateComponent } from '../features/private/private.component';
import { DashboardComponent } from '../features/private/dashboard/dashboard.component';
import { FormDemandeComponent } from '../features/private/demande-rv/form-demande/form-demande.component';
import { ListDemandeComponent } from '../features/private/demande-rv/list-demande/list-demande.component';
import { AuthGuard } from '../guards/auth.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dash',
        pathMatch: 'full'
      },
      {
        path: 'dash',
        component: DashboardComponent
      },
      {
        path: 'form-demande',
        component: FormDemandeComponent
      },
      {
        path: 'list-rv',
        component: ListDemandeComponent
      }
    ]
  }
];