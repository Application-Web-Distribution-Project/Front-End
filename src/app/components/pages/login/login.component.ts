import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from '../../shared/forgot-password-modal/forgot-password-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Footer style
  classname = "ct-footer footer-dark";
  ftlogo = "assets/img/logo-light.png";
  
  loginForm: FormGroup;
  isSubmitting = false;
  loginError: string = null;
  returnUrl: string = '/home'; 
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Récupérer l'URL de retour des paramètres de requête ou utiliser '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit(): void {
  }
  
  // Getter pour accéder facilement aux contrôles de formulaire dans le template
  get f() { return this.loginForm.controls; }
  
  onSubmit() {
    // Afficher les détails du formulaire pour le débogage
    console.log('Formulaire soumis:', this.loginForm.value);
    
    // Ne rien faire si le formulaire est invalide
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide:', this.loginForm.errors);
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.controls[key];
        console.log(`Contrôle ${key} invalide:`, control.errors);
        control.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.loginError = '';
    
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    
    this.authService.login(loginData)
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Connexion réussie', response);
          // Naviguer vers la page de retour ou la page d'accueil
          this.router.navigate([this.returnUrl]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur de connexion', error);
          
          if (error.status === 0) {
            this.loginError = 'Impossible de contacter le serveur. Vérifiez votre connexion ou contactez l\'administrateur.';
          } else if (error.status === 401) {
            this.loginError = 'Email ou mot de passe incorrect';
          } else if (error.status === 404) {
            this.loginError = 'Service d\'authentification inaccessible (404). Vérifiez la configuration du proxy.';
          } else {
            this.loginError = `Erreur (${error.status}): ${error.error?.message || 'Connexion impossible'}`;
          }
        }
      });
  }

  openForgotPasswordModal() {
    const modalRef = this.modalService.open(ForgotPasswordModalComponent, { centered: true });
    
    modalRef.result.then(
      (result) => {
        if (result && result.success) {
          // Handle success - maybe show a notification
          this.loginError = null;
          alert('Un email de réinitialisation a été envoyé à votre adresse email.');
        }
      },
      () => {
        // Modal dismissed
      }
    );
  }
}
