import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FormDemandeComponent } from './features/demande-rv/form-demande/form-demande.component';

export const routes: Routes = [
    {
        path: "dash",
        component: DashboardComponent
    },
    {
        path: "",
        redirectTo: "dash",
        pathMatch: 'full'
    },
    {
        path: "form-demande",
        component: FormDemandeComponent
    }
];
