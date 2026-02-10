import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-private',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userMenuOpen = false;
  currentDate = new Date();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Mettre à jour la date chaque minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    // Logique de déconnexion
    console.log('Déconnexion...');
    
    // Redirection vers la page de login
    this.router.navigate(['/login']);
    
    // Fermer le menu après déconnexion
    this.userMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Fermer le menu utilisateur si on clique en dehors
    if (!target.closest('.user-profile')) {
      this.userMenuOpen = false;
    }
  }
}