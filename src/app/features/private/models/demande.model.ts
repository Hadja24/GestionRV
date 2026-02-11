// ============================================
// TYPES & INTERFACES – DEMANDE RV
// Cohérence totale entre mock, service et composant
// ============================================

// Spécialités médicales (union de littéraux)
export type SpecialiteMedicale =
  | 'Généraliste'
  | 'Cardiologie'
  | 'Dermatologie'
  | 'Gastro-entérologie'
  | 'Gynécologie'
  | 'Pédiatrie'
  | 'Ophtalmologie'
  | 'Dentiste';

// Statuts possibles d'une demande (en phase avec le mock)
export type StatutDemande =
  | 'EN_ATTENTE'
  | 'CONFIRMEE'
  | 'ANNULÉE'
  | 'TERMINÉE'; // ajouté pour les RV passés

// Modèle principal d'un rendez-vous dans les listes
export interface DemandeListRvModel {
  id: number;
  date: string;          // format ISO (AAAA-MM-JJ)
  heure: string;         // format HH:MM
  typeConsultation: string;
  specialite: SpecialiteMedicale;
  statut: StatutDemande;
  // Informations complémentaires pour l'affichage enrichi
  medecin?: string;
  lieu?: string;
  notes?: string;
  couleur?: string;      // couleur associée au statut
}

// Filtres pour la recherche (tous optionnels)
export interface DemandeRVFilterModel {
  specialite?: SpecialiteMedicale | '';
  statut?: StatutDemande;
  page?: number;
  size?: number;
}

// Réponse paginée du service (inclut `pages` pour faciliter l'UI)
export interface DemandeListeResponse {
  data: DemandeListRvModel[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  size: number;
  pages: number[];       // tableau des numéros de pages
}