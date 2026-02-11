// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // TODO: Retirer ce mode de débogage en production
    const debugMode = true; // Définir à false pour activer la vérification d'authentification
    
    if (!isLoggedIn && !debugMode) {
      // Rediriger vers la page de login si non connecté
      this.router.navigate(['/public/login']);
      return false;
    }
    
    return true;
  }
}