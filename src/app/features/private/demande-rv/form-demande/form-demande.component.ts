import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Medecin {
  id: string;
  nom: string;
  specialite: string;
}

interface Document {
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc';
}

@Component({
  selector: 'app-demande-rv',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './form-demande.component.html',
  styleUrls: ['./form-demande.component.css']
})
export class FormDemandeComponent implements OnInit {
  demandeForm: FormGroup;
  isSubmitting = false;
  isDragOver = false;
  documents: Document[] = [];
  
  heuresDisponibles = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];
  
  medecinsList: Medecin[] = [
    { id: '1', nom: 'Dr. Dieynaba Ba', specialite: 'Médecin Généraliste' },
    { id: '2', nom: 'Dr. Mame Khary Gueye', specialite: 'Cardiologue' },
    { id: '3', nom: 'Dr. Marie Diagne', specialite: 'Pédiatre' },
    { id: '4', nom: 'Dr. Ndeye Oumy Ndoye', specialite: 'Dermatologue' },
    { id: '5', nom: 'Dr. Aly Boubou Sy', specialite: 'Gynécologue' },
    { id: '6', nom: 'Dr. Abibatou Dia', specialite: 'Psychiatre' }
  ];
  
  minDate: string;
  maxDate: string;

  constructor(private fb: FormBuilder, private router: Router) {
    // Calcul des dates min/max (aujourd'hui et dans 3 mois)
    const today = new Date();
    const max = new Date();
    max.setMonth(today.getMonth() + 3);
    
    this.minDate = this.formatDateForInput(today);
    this.maxDate = this.formatDateForInput(max);
    
    this.demandeForm = this.fb.group({
      consultationType: ['', Validators.required],
      medecin: ['', Validators.required],
      date: ['', Validators.required],
      heure: ['', Validators.required],
      motif: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  selectHeure(heure: string): void {
    this.demandeForm.get('heure')?.setValue(heure);
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    this.processFiles(files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(files);
    }
  }

  processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Le fichier ${file.name} dépasse la taille maximale de 5MB`);
        continue;
      }
      
      // Déterminer le type de fichier
      let fileType: 'pdf' | 'image' | 'doc' = 'doc';
      if (file.type.includes('pdf')) fileType = 'pdf';
      if (file.type.includes('image')) fileType = 'image';
      if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) fileType = 'doc';
      
      this.documents.push({
        name: file.name,
        size: this.formatFileSize(file.size),
        type: fileType
      });
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeDocument(index: number): void {
    this.documents.splice(index, 1);
  }

  getConsultationTypeLabel(): string {
    const types: {[key: string]: string} = {
      'generaliste': 'Consultation Générale',
      'specialiste': 'Consultation Spécialiste',
      'suivi': 'Suivi médical',
      'analyse': 'Analyse médicale',
      'scanner/irm': 'Scanner / IRM'
    };
    return types[this.demandeForm.get('consultationType')?.value] || '';
  }

  getMedecinName(): string {
    const medecinId = this.demandeForm.get('medecin')?.value;
    const medecin = this.medecinsList.find(m => m.id === medecinId);
    return medecin ? `${medecin.nom} - ${medecin.specialite}` : '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  resetForm(): void {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      this.demandeForm.reset();
      this.documents = [];
    }
  }

  onSubmit(): void {
    if (this.demandeForm.valid) {
      this.isSubmitting = true;
      
      // Simulation d'envoi
      console.log('Données du formulaire:', {
        ...this.demandeForm.value,
        documents: this.documents
      });
      
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Votre demande de rendez-vous a été envoyée avec succès !');
        this.router.navigate(['/dashboard']);
      }, 2000);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.demandeForm.controls).forEach(key => {
        const control = this.demandeForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}