// src/app/guards/public.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      // Rediriger vers le tableau de bord si déjà connecté
      this.router.navigate(['/private/dash']);
      return false;
    }
    
    return true;
  }
}