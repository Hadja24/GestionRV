import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { DemandeService } from '../services/demande.service';
import {
  DemandeListeResponse,
  DemandeRVFilterModel,
  DemandeListRvModel,
  SpecialiteMedicale,
  StatutDemande
} from '../../models/demande.model';

@Component({
  selector: 'app-list-demande',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit, OnDestroy {
  // Données principales
  demandeResponse: DemandeListeResponse | null = null;
  allRV: DemandeListRvModel[] = []; // Tous les RV (une seule fois)
  private subscription: Subscription = new Subscription();

  // Propriétés pour la pagination
  currentPage: number = 1;
  pageSize: number = 5;
  filteredRendezVous: DemandeListRvModel[] = [];
  rendezVous: DemandeListRvModel[] = [];

  // Propriétés pour les filtres du template
  statutFilter: string = 'tous';
  specialiteFilter: string = 'toutes';

  // Modèle de filtrage unique (cohérent avec le service)
  filter: DemandeRVFilterModel = {
    specialite: '',
    statut: undefined,   // par défaut, pas de filtre statut
    page: 1,
    size: 5
  };

  // Options pour les sélecteurs de filtre
  specialites: { value: SpecialiteMedicale | ''; label: string }[] = [
    { value: '', label: 'Toutes spécialités' },
    { value: 'Généraliste', label: 'Médecine générale' },
    { value: 'Cardiologie', label: 'Cardiologie' },
    { value: 'Dermatologie', label: 'Dermatologie' },
    { value: 'Gastro-entérologie', label: 'Gastro-entérologie' },
    { value: 'Gynécologie', label: 'Gynécologie' },
    { value: 'Pédiatrie', label: 'Pédiatrie' },
    { value: 'Ophtalmologie', label: 'Ophtalmologie' },
    { value: 'Dentiste', label: 'Dentiste' }
  ];

  statuts: { value: StatutDemande | undefined; label: string }[] = [
    { value: undefined, label: 'Tous statuts' },
    { value: 'EN_ATTENTE', label: 'En attente' },
    { value: 'CONFIRMEE', label: 'Confirmée' },
    { value: 'ANNULÉE', label: 'Annulée' },
    { value: 'TERMINÉE', label: 'Terminée' }
  ];

  // Mapping pour l'affichage (couleurs, icônes, textes)
  private statutMapping: Record<StatutDemande, { text: string; icon: string; color: string }> = {
    EN_ATTENTE: { text: 'En attente', icon: 'fas fa-clock', color: '#f59e0b' },
    CONFIRMEE: { text: 'Confirmée', icon: 'fas fa-check-circle', color: '#10b981' },
    ANNULÉE: { text: 'Annulée', icon: 'fas fa-times-circle', color: '#ef4444' },
    TERMINÉE: { text: 'Terminée', icon: 'fas fa-history', color: '#3b82f6' }
  };

  constructor(private demandeService: DemandeService) {}

  ngOnInit(): void {
    this.chargerTousLesRV();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Charge tous les RV une fois au démarrage
  private chargerTousLesRV(): void {
    // Charger avec une taille très grande pour récupérer tous les RV
    const filterTous = { ...this.filter, size: 100, page: 1 };
    const sub = this.demandeService.getDemandesRV(filterTous).subscribe({
      next: (response) => {
        this.allRV = response.data;
        this.rendezVous = response.data;
        this.appliquerFiltres();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
      }
    });
    this.subscription.add(sub);
  }

  // Charge les données via le service
  private chargerDemandes(): void {
    const sub = this.demandeService.getDemandesRV(this.filter).subscribe({
      next: (response) => {
        this.demandeResponse = response;
        this.rendezVous = response.data;
        this.filteredRendezVous = response.data;
        this.currentPage = response.currentPage;
        this.pageSize = response.size;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des demandes', err);
      }
    });
    this.subscription.add(sub);
  }

  // Alias public pour le template
  chargerRendezVous(): void {
    this.chargerTousLesRV();
  }

  // Applique les filtres et pagine les RV localement
  appliquerFiltres(): void {
    this.currentPage = 1;

    // Filtrer les RV selon les critères
    let filtered = this.allRV;

    // Filtre statut
    if (this.statutFilter !== 'tous') {
      const statusMap: Record<string, StatutDemande> = {
        'confirmé': 'CONFIRMEE',
        'en_attente': 'EN_ATTENTE',
        'annulé': 'ANNULÉE',
        'terminé': 'TERMINÉE'
      };
      const targetStatus = statusMap[this.statutFilter];
      filtered = filtered.filter(rv => rv.statut === targetStatus);
    }

    // Filtre spécialité
    if (this.specialiteFilter !== 'toutes') {
      const specialite = this.specialiteFilter.charAt(0).toUpperCase() + this.specialiteFilter.slice(1) as SpecialiteMedicale;
      filtered = filtered.filter(rv => rv.specialite === specialite);
    }

     // Si la page courante dépasse le nombre total de pages, remettre à 1
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    // Stocker les RV filtrés
    this.rendezVous = filtered;

    // Paginer les résultats filtrés
    this.mettreAJourPagination();
  }

  // Met à jour la pagination et affiche la page courante
  private mettreAJourPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredRendezVous = this.rendezVous.slice(startIndex, endIndex);
  }

  // Réinitialise tous les filtres
  reinitialiserFiltres(): void {
    this.statutFilter = 'tous';
    this.specialiteFilter = 'toutes';
    this.appliquerFiltres();
  }

  // Changement de page
  allerPage(page: number): void {
    const totalPages = Math.ceil(this.rendezVous.length / this.pageSize);
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
      this.mettreAJourPagination();
    }
  }

  // Navigation pagination
  pagePrecedente(): void {
    if (this.currentPage > 1) {
      this.allerPage(this.currentPage - 1);
    }
  }

  pageSuivante(): void {
    const totalPages = Math.ceil(this.rendezVous.length / this.pageSize);
    if (this.currentPage < totalPages) {
      this.allerPage(this.currentPage + 1);
    }
  }
  // Propriété calculée - nombre total de pages
  get totalPages(): number {
    return Math.ceil(this.rendezVous.length / this.pageSize);
  }
  // Getters pour l'affichage d'un rendez-vous
  getStatutText(statut: StatutDemande): string {
    return this.statutMapping[statut]?.text || statut;
  }

  // Retourne le dernier index affiché dans la pagination
  getDisplayEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.rendezVous.length);
  }

  getStatutIcon(statut: StatutDemande): string {
    return this.statutMapping[statut]?.icon || 'fas fa-info-circle';
  }

  getStatutColor(statut: StatutDemande): string {
    return this.statutMapping[statut]?.color || '#6b7280';
  }

  // Compte les RV par statut pour les statistiques
  getCountByStatus(status: string): number {
    if (!this.rendezVous || this.rendezVous.length === 0) return 0;

    const statusMap: Record<string, StatutDemande> = {
      'confirmé': 'CONFIRMEE',
      'en_attente': 'EN_ATTENTE',
      'terminé': 'TERMINÉE',
      'annulé': 'ANNULÉE'
    };

    const targetStatus = statusMap[status];
    return this.rendezVous.filter(rv => rv.statut === targetStatus).length;
  }

  // Actions sur un rendez-vous
  confirmerRV(id: number): void {
    const rv = this.demandeResponse?.data.find(d => d.id === id);
    if (rv && rv.statut === 'EN_ATTENTE' && confirm('Confirmer ce rendez-vous ?')) {
      // En vrai : appel service -> mise à jour
      rv.statut = 'CONFIRMEE';
      rv.couleur = this.getStatutColor('CONFIRMEE');
      // Dans une vraie app, on ferait un PUT puis rechargement
      // Ici on simule en rafraîchissant la liste
      this.chargerDemandes();
      alert('Rendez-vous confirmé !');
    }
  }

  annulerRV(id: number): void {
    const rv = this.demandeResponse?.data.find(d => d.id === id);
    if (rv && rv.statut !== 'TERMINÉE' && confirm('Annuler ce rendez-vous ?')) {
      rv.statut = 'ANNULÉE';
      rv.couleur = this.getStatutColor('ANNULÉE');
      this.chargerDemandes();
      alert('Rendez-vous annulé.');
    }
  }

  voirDetails(id: number): void {
    console.log('Voir détails RV:', id);
    // À implémenter: navigation vers détails du RV
  }

  reporterRV(id: number): void {
    const rv = this.demandeResponse?.data.find(d => d.id === id);
    if (rv && confirm('Reporter ce rendez-vous ?')) {
      console.log('Reporter RV:', id);
      // À implémenter: ouvrir dialog de modification de date
    }
  }

  telechargerOrdonnance(id: number): void {
    console.log('Télécharger ordonnance RV:', id);
    // À implémenter: télécharger ordonnance
  }

  supprimerRV(id: number): void {
    const rv = this.demandeResponse?.data.find(d => d.id === id);
    if (rv && rv.statut === 'ANNULÉE' && confirm('Supprimer ce rendez-vous ?')) {
      const index = this.demandeResponse!.data.indexOf(rv);
      if (index > -1) {
        this.demandeResponse!.data.splice(index, 1);
      }
      this.chargerDemandes();
      alert('Rendez-vous supprimé.');
    }
  }

  // Méthodes d'affichage des dates et labels
  formaterJour(date: string): string {
    return new Date(date).getDate().toString();
  }

  formaterDateComplete(date: string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('fr-FR', options);
  }

  getAvatarUrl(medecin: string | undefined, couleur: string | undefined): string {
    // Placeholder pour avatar
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='${couleur || '%23ccc'}' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3E${medecin?.charAt(0) || 'M'}%3C/text%3E%3C/svg%3E`;
  }

  getSpecialiteLabel(specialite: string): string {
    return specialite || 'Spécialité';
  }

  estProchainRV(date: string): boolean {
    const d = new Date(date);
    const aujourd = new Date();
    return d > aujourd && d.getTime() - aujourd.getTime() < 7 * 24 * 60 * 60 * 1000; // Dans les 7 jours
  }

  estPasse(date: string): boolean {
    const d = new Date(date);
    return d < new Date();
  }

  // Méthodes d'export et impression
  exporterListe(): void {
    console.log('Exporter la liste');
    // À implémenter: exporter en CSV ou PDF
  }

  imprimerListe(): void {
    console.log('Imprimer la liste');
    window.print();
  }
}