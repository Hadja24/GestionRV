import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-patient',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.css']
})
export class CreatePatientComponent implements OnInit {
  registerForm: FormGroup;
  step = 1;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  acceptedTerms = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Étape 1: Informations personnelles
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      
      // Étape 2: Informations médicales
      bloodType: ['', Validators.required],
      height: ['', [Validators.min(50), Validators.max(250)]],
      weight: ['', [Validators.min(20), Validators.max(300)]],
      allergies: [''],
      medicalHistory: [''],
      
      // Étape 3: Informations de connexion
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadFontAwesome();
    
    // Écouter les changements du mot de passe pour calculer la force
    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.calculatePasswordStrength(value);
    });
  }

  private loadFontAwesome(): void {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  calculatePasswordStrength(password: string): void {
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength += 25;
    
    // Lettres minuscules
    if (/[a-z]/.test(password)) strength += 25;
    
    // Lettres majuscules
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Chiffres et caractères spéciaux
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[@$!%*?&]/.test(password)) strength += 12.5;
    
    this.passwordStrength = Math.min(strength, 100);
  }

  // Ajoutez ces méthodes dans la classe CreatePatientComponent

// Méthodes pour vérifier les conditions du mot de passe
  hasMinLength(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && password.length >= 8;
  }

  hasLowercase(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[a-z]/.test(password);
  }

  hasUppercase(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[@$!%*?&]/.test(password);
  }

  getPasswordStrengthClass(): string {
    if (this.passwordStrength < 25) return 'weak';
    if (this.passwordStrength < 50) return 'fair';
    if (this.passwordStrength < 75) return 'good';
    return 'strong';
  }

  nextStep(): void {
    // Valider les champs de l'étape actuelle
    let isValid = true;
    
    switch (this.step) {
      case 1:
        const step1Fields = ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'gender'];
        step1Fields.forEach(field => {
          const control = this.registerForm.get(field);
          if (control?.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
        break;
        
      case 2:
        const step2Fields = ['bloodType'];
        step2Fields.forEach(field => {
          const control = this.registerForm.get(field);
          if (control?.invalid) {
            control.markAsTouched();
            isValid = false;
          }
        });
        break;
    }
    
    if (isValid && this.step < 3) {
      this.step++;
      window.scrollTo(0, 0);
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
      window.scrollTo(0, 0);
    }
  }

  togglePassword(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  toggleTerms(): void {
    this.acceptedTerms = !this.acceptedTerms;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || !this.acceptedTerms) {
      // Marquer tous les champs comme touchés
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      
      if (!this.acceptedTerms) {
        alert('Veuillez accepter les conditions d\'utilisation');
      }
      return;
    }

    this.isLoading = true;

    // Simulation d'inscription
    setTimeout(() => {
      const formData = this.registerForm.value;
      
      // Enregistrer les données (simulation)
      console.log('Données d\'inscription:', formData);
      
      // Sauvegarder dans localStorage pour la démo
      localStorage.setItem('patientData', JSON.stringify({
        ...formData,
        registrationDate: new Date().toISOString(),
        patientId: 'PAT-' + Date.now().toString().slice(-6)
      }));
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
      localStorage.setItem('userRole', 'patient');
      
      this.isLoading = false;
      
      // Redirection vers le tableau de bord
      this.router.navigate(['/private/dash']);
      
    }, 2000);
  }

  get currentProgress(): number {
    return (this.step - 1) * 33.33;
  }
}