import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur a des identifiants enregistrés
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    // Sauvegarder l'email si "Se souvenir de moi" est coché
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Simulation d'une connexion API
    setTimeout(() => {
      // En production, remplacer par un appel API réel
      const mockUser = {
        email: 'demo@example.com',
        password: 'demo123'
      };

      if (email === mockUser.email && password === mockUser.password) {
        // Connexion réussie
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirection vers le tableau de bord
        this.router.navigate(['/dash']);
      } else {
        // Erreur de connexion
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.isLoading = false;
        
        // Réinitialiser le formulaire
        this.loginForm.get('password')?.reset();
      }
    }, 1500);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  forgotPassword(): void {
    const email = this.loginForm.get('email')?.value;
    
    if (email && this.loginForm.get('email')?.valid) {
      this.isLoading = true;
      
      // Simulation d'envoi d'email de réinitialisation
      setTimeout(() => {
        alert(`Un email de réinitialisation a été envoyé à ${email}`);
        this.isLoading = false;
      }, 1000);
    } else {
      alert('Veuillez entrer votre adresse email pour réinitialiser votre mot de passe');
    }
  }

  loginWithGoogle(): void {
    this.isLoading = true;
    // Intégrer avec Google OAuth ici
    setTimeout(() => {
      console.log('Connexion avec Google');
      this.isLoading = false;
      // Redirection vers le dashboard après connexion
      this.router.navigate(['/dash']);
    }, 1500);
  }

  loginWithFacebook(): void {
    this.isLoading = true;
    // Intégrer avec Facebook OAuth ici
    setTimeout(() => {
      console.log('Connexion avec Facebook');
      this.isLoading = false;
      // Redirection vers le dashboard après connexion
      this.router.navigate(['/dash']);
    }, 1500);
  }
}