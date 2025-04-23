import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  token: string;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  isTokenValid = false;
  isTokenValidating = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.checkPasswords
    });

    // Get token from URL parameters
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.isTokenValidating = false;
        this.error = 'Lien de réinitialisation invalide. Veuillez demander un nouveau lien.';
      } else {
        // Validate token with backend
        this.validateToken();
      }
    });
  }

  validateToken() {
    this.authService.validateResetToken(this.token).subscribe(
      response => {
        this.isTokenValid = response.status === 'success';
        this.isTokenValidating = false;
        
        if (!this.isTokenValid) {
          this.error = 'Ce lien de réinitialisation est expiré ou invalide. Veuillez demander un nouveau lien.';
        }
      },
      error => {
        this.isTokenValidating = false;
        this.isTokenValid = false;
        this.error = 'Ce lien de réinitialisation est expiré ou invalide. Veuillez demander un nouveau lien.';
      }
    );
  }

  // Validator for checking if passwords match
  checkPasswords(group: FormGroup) {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(
      this.token,
      this.f.password.value,
      this.f.confirmPassword.value
    ).subscribe(
      response => {
        if (response.status === 'success') {
          this.success = 'Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.error = response.message || 'Une erreur est survenue lors de la réinitialisation.';
          this.loading = false;
        }
      },
      error => {
        if (error.status === 400 && error.error && error.error.message) {
          this.error = error.error.message;
        } else if (error.status === 404) {
          this.error = 'Token invalide ou expiré.';
        } else {
          this.error = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
        this.loading = false;
      }
    );
  }
}
