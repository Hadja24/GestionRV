import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCKS_DEMANDES } from '../../../../mocks/demande.mock';
import {
  DemandeListeResponse,
  DemandeRVFilterModel,
  DemandeListRvModel,
  StatutDemande,
  SpecialiteMedicale
} from '../../models/demande.model';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
  constructor() {}

  /**
   * Retourne une liste paginée et filtrée de demandes de RV.
   * Version asynchrone utilisant `Observable` pour être prête pour de vrais appels HTTP.
   */
  public getDemandesRV(filter: DemandeRVFilterModel): Observable<DemandeListeResponse> {
    // 1. Copie des données mockées et transformation pour correspondre au modèle
    let demandes: DemandeListRvModel[] = MOCKS_DEMANDES.map(d => ({
      id: d.id,
      date: d.date instanceof Date ? d.date.toISOString().split('T')[0] : d.date,
      heure: d.heure,
      typeConsultation: d.type,
      specialite: d.specialite.charAt(0).toUpperCase() + d.specialite.slice(1).toLowerCase() as SpecialiteMedicale,
      statut: this.normalizeStatut(d.statut),
      medecin: d.medecin,
      lieu: d.lieu,
      notes: d.notes,
      couleur: d.couleur
    }));

    // 2. Application des filtres
    if (filter.specialite) {
      demandes = demandes.filter(d => d.specialite === filter.specialite);
    }
    if (filter.statut) {
      demandes = demandes.filter(d => d.statut === filter.statut);
    }

    // 3. Pagination
    const page = filter.page || 1;
    const size = filter.size || environment.limit || 5;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const totalItems = demandes.length;
    const totalPages = Math.ceil(totalItems / size);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const data = demandes.slice(startIndex, endIndex);

    // 4. Construction de la réponse
    const response: DemandeListeResponse = {
      data,
      totalPages,
      currentPage: page,
      totalItems,
      size,
      pages
    };

    // Retourne un Observable (même pour des données synchrones)
    return of(response);
  }

  /**
   * Normalise les statuts du mock au format attendu du modèle
   */
  private normalizeStatut(statut: string): StatutDemande {
    const lower = statut.toLowerCase();
    if (lower === 'confirmé' || lower === 'confirmee') return 'CONFIRMEE';
    if (lower === 'en_attente' || lower === 'en attente') return 'EN_ATTENTE';
    if (lower === 'annulé' || lower === 'annulee') return 'ANNULÉE';
    if (lower === 'terminé' || lower === 'terminee') return 'TERMINÉE';
    return 'EN_ATTENTE'; // Défaut
  }

  // Méthodes supplémentaires possibles :
  // - getDemandeById(id: number): Observable<DemandeListRvModel>
  // - updateStatut(id: number, nouveauStatut: StatutDemande): Observable<DemandeListRvModel>
  // - deleteDemande(id: number): Observable<void>
}