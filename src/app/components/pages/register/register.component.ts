import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Footer style
  classname = "ct-footer footer-dark";
  ftlogo = "assets/img/logo-light.png";
  
  registerForm: FormGroup;
  isSubmitting = false;
  registerError = '';
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialiser le formulaire
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
  }
  
  // Getter pour accéder facilement aux contrôles de formulaire dans le template
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    const userData = {
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: 'USER' // Par défaut, tous les nouveaux utilisateurs ont le rôle USER
    };

    this.userService.register(userData)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (response) => {
          console.log('✅ Inscription réussie');
          // Après inscription réussie, connecter l'utilisateur
          this.userService.login(userData.email, userData.password)
            .subscribe({
              next: () => {
                this.router.navigate(['/']);
              },
              error: (error) => {
                console.error('❌ Erreur de connexion après inscription:', error);
                this.router.navigate(['/login']);
              }
            });
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Erreur d\'inscription:', error);
          if (error.status === 409) {
            this.registerError = 'Cet email est déjà utilisé.';
          } else {
            this.registerError = error.error?.message || 'Une erreur est survenue lors de l\'inscription.';
          }
        }
      });
  }
}

