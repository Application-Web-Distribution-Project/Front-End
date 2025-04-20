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
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    
    // Rediriger si déjà connecté
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }
  
  // Getter pour accéder facilement aux contrôles de formulaire dans le template
  get f() { return this.registerForm.controls; }
  
  onSubmit() {
    // Afficher les détails du formulaire pour le débogage
    console.log('Formulaire soumis:', this.registerForm.value);
    
    
      };
  }

