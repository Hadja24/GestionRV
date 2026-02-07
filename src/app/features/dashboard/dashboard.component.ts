import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dropdownOpen = false;
  userMenuOpen = false;
  currentDate = new Date();

  ngOnInit() {
    // Mettre à jour la date chaque minute
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const target = event.target as HTMLElement;
    
    // Fermer le menu utilisateur si on clique en dehors
    if (!target.closest('.user-profile')) {
      this.userMenuOpen = false;
    }
    
    // Fermer les dropdowns si on clique en dehors
    if (!target.closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    // Logique de déconnexion
    console.log('Déconnexion...');
    // Redirection vers la page de login
    // this.router.navigate(['/login']);
    
    // Fermer le menu après déconnexion
    this.userMenuOpen = false;
  }
}