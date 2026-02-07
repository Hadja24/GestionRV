import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

interface RendezVous {
  id: number;
  date: Date;
  heure: string;
  medecin: string;
  specialite: string;
  statut: 'confirmé' | 'en_attente' | 'annulé' | 'terminé';
  lieu: string;
  type: string;
  notes?: string;
  couleur?: string;
}

@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {
  rendezVous: RendezVous[] = [];
  filteredRendezVous: RendezVous[] = [];
  
  // Filtres
  statutFilter: string = 'tous';
  specialiteFilter: string = 'toutes';
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;

  ngOnInit() {
    this.chargerRendezVous();
    this.appliquerFiltres();
  }

  chargerRendezVous() {
    // Données de démonstration
    this.rendezVous = [
      {
        id: 1,
        date: new Date('2024-03-15'),
        heure: '10:30',
        medecin: 'Dr. Dieynaba Ba',
        specialite: 'généraliste',
        statut: 'confirmé',
        lieu: 'Centre Médical Principal, Salle 204',
        type: 'Consultation générale',
        notes: 'N\'oubliez pas d\'apporter vos dernières analyses',
        couleur: '#10b981'
      },
      {
        id: 2,
        date: new Date('2024-03-22'),
        heure: '14:00',
        medecin: 'Dr. Mame Khary Gueye',
        specialite: 'cardiologie',
        statut: 'en_attente',
        lieu: 'Hôpital Saint-Louis, Bâtiment B',
        type: 'Consultation spécialiste',
        notes: 'Échographie cardiaque prévue',
        couleur: '#f59e0b'
      },
      {
        id: 3,
        date: new Date('2024-03-10'),
        heure: '09:15',
        medecin: 'Dr. Marie Diagne',
        specialite: 'dermatologie',
        statut: 'terminé',
        lieu: 'Clinique de la Peau, Salle 12',
        type: 'Suivi traitement',
        notes: 'Prescription renouvelée',
        couleur: '#3b82f6'
      },
      {
        id: 4,
        date: new Date('2024-04-05'),
        heure: '11:45',
        medecin: 'Dr. Ndeye Oumy Ndoye',
        specialite: 'gynécologie',
        statut: 'confirmé',
        lieu: 'Centre de Santé Familiale',
        type: 'Consultation annuelle',
        notes: 'Échographie de contrôle',
        couleur: '#10b981'
      },
      {
        id: 5,
        date: new Date('2024-03-18'),
        heure: '16:30',
        medecin: 'Dr. Aly Boubou Sy',
        specialite: 'ophtalmologie',
        statut: 'annulé',
        lieu: 'Institut de la Vision',
        type: 'Examen de routine',
        notes: 'Rendez-vous annulé par le patient',
        couleur: '#ef4444'
      },
      {
        id: 6,
        date: new Date('2024-04-12'),
        heure: '08:00',
        medecin: 'Dr. Abibatou Dia',
        specialite: 'pédiatrie',
        statut: 'en_attente',
        lieu: 'Hôpital des Enfants',
        type: 'Vaccination',
        notes: 'Vaccin ROR à prévoir',
        couleur: '#f59e0b'
      },
      {
        id: 7,
        date: new Date('2024-04-20'),
        heure: '15:45',
        medecin: 'Dr. Adelaide Ba',
        specialite: 'généraliste',
        statut: 'confirmé',
        lieu: 'Centre Médical Principal, Salle 210',
        type: 'Suivi médical',
        notes: 'Bilan sanguin à réaliser avant',
        couleur: '#10b981'
      }
    ];
  }

  getCountByStatus(statut: string): number {
    return this.rendezVous.filter(rv => rv.statut === statut).length;
  }

  getAvatarUrl(nom: string, couleur?: string): string {
    const bgColor = couleur ? couleur.replace('#', '') : '4f46e5';
    const encodedName = encodeURIComponent(nom);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${bgColor}&color=fff&size=128`;
  }

  getSpecialiteLabel(value: string): string {
    const specialites: { [key: string]: string } = {
      'généraliste': 'Médecine générale',
      'cardiologie': 'Cardiologie',
      'dermatologie': 'Dermatologie',
      'gynécologie': 'Gynécologie',
      'pédiatrie': 'Pédiatrie',
      'ophtalmologie': 'Ophtalmologie'
    };
    return specialites[value] || value;
  }

  appliquerFiltres() {
    this.filteredRendezVous = this.rendezVous.filter(rv => {
      // Filtre par statut
      const statutMatch = this.statutFilter === 'tous' || rv.statut === this.statutFilter;
      
      // Filtre par spécialité
      const specialiteMatch = this.specialiteFilter === 'toutes' || rv.specialite === this.specialiteFilter;
      
      return statutMatch && specialiteMatch;
    });
    
    this.currentPage = 1;
  }

  reinitialiserFiltres() {
    this.statutFilter = 'tous';
    this.specialiteFilter = 'toutes';
    this.appliquerFiltres();
  }

  getStatutColor(statut: string): string {
    const colors: { [key: string]: string } = {
      'confirmé': '#10b981',
      'en_attente': '#f59e0b',
      'annulé': '#ef4444',
      'terminé': '#3b82f6'
    };
    return colors[statut] || '#6b7280';
  }

  getStatutIcon(statut: string): string {
    const icons: { [key: string]: string } = {
      'confirmé': 'fas fa-check-circle',
      'en_attente': 'fas fa-clock',
      'annulé': 'fas fa-times-circle',
      'terminé': 'fas fa-history'
    };
    return icons[statut] || 'fas fa-info-circle';
  }

  getStatutText(statut: string): string {
    const texts: { [key: string]: string } = {
      'confirmé': 'Confirmé',
      'en_attente': 'En attente',
      'annulé': 'Annulé',
      'terminé': 'Terminé'
    };
    return texts[statut] || statut;
  }

  formaterJour(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  formaterDateComplete(date: Date): string {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  estProchainRV(date: Date): boolean {
    const aujourdhui = new Date();
    const diffTime = date.getTime() - aujourdhui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }

  estPasse(date: Date): boolean {
    return date < new Date();
  }

  voirDetails(id: number) {
    console.log('Voir détails du RV', id);
    alert('Navigation vers les détails du rendez-vous ' + id);
  }

  confirmerRV(id: number) {
    const rv = this.rendezVous.find(r => r.id === id);
    if (rv && confirm('Confirmer ce rendez-vous ?')) {
      rv.statut = 'confirmé';
      rv.couleur = '#10b981';
      this.appliquerFiltres();
      alert('Rendez-vous confirmé avec succès !');
    }
  }

  annulerRV(id: number) {
    const rv = this.rendezVous.find(r => r.id === id);
    if (rv && confirm('Annuler ce rendez-vous ?')) {
      rv.statut = 'annulé';
      rv.couleur = '#ef4444';
      this.appliquerFiltres();
      alert('Rendez-vous annulé.');
    }
  }

  reporterRV(id: number) {
    console.log('Reporter le RV', id);
    alert('Fonctionnalité de report à implémenter');
  }

  telechargerOrdonnance(id: number) {
    console.log('Télécharger ordonnance pour le RV', id);
    alert('Téléchargement de l\'ordonnance en cours...');
  }

  supprimerRV(id: number) {
    if (confirm('Supprimer définitivement ce rendez-vous de l\'historique ?')) {
      this.rendezVous = this.rendezVous.filter(r => r.id !== id);
      this.appliquerFiltres();
      alert('Rendez-vous supprimé.');
    }
  }

  exporterListe() {
    console.log('Exporter la liste');
    alert('Export CSV en cours...');
  }

  imprimerListe() {
    window.print();
  }

  pagePrecedente() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  pageSuivante() {
    if (this.currentPage * this.pageSize < this.filteredRendezVous.length) {
      this.currentPage++;
    }
  }
}