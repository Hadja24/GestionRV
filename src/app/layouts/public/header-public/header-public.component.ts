import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-public',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './header-public.component.html',
  styleUrls: ['./header-public.component.css']
})
export class HeaderPublicComponent {
  showPublicBanner = true;
  
  closeBanner() {
    this.showPublicBanner = false;
    // Optionnel: Sauvegarder dans localStorage pour ne pas réafficher
    localStorage.setItem('hidePublicBanner', 'true');
  }
  
  ngOnInit() {
    this.loadFontAwesome();
    // Vérifier si l'utilisateur a déjà fermé la bannière
    if (localStorage.getItem('hidePublicBanner') === 'true') {
      this.showPublicBanner = false;
    }
  }

  private loadFontAwesome(): void {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }
}
