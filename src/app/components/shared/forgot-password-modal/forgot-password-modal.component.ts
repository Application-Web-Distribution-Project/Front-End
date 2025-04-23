import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password-modal',
  templateUrl: './forgot-password-modal.component.html',
  styleUrls: ['./forgot-password-modal.component.css']
})
export class ForgotPasswordModalComponent implements OnInit {
  forgotForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.forgotForm.controls; }

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.requestPasswordReset(this.f.email.value)
      .subscribe(
        response => {
          this.loading = false;
          if (response && response.status === 'success') {
            this.success = true;
            setTimeout(() => {
              this.activeModal.close({ success: true });
            }, 2000);
          } else {
            this.error = response?.message || "Une erreur s'est produite lors de la demande de réinitialisation.";
          }
        },
        err => {
          this.loading = false;
          if (err.error && err.error.message) {
            this.error = err.error.message;
          } else if (err.status === 404) {
            this.error = "Utilisateur non trouvé avec cet email.";
          } else {
            this.error = "Une erreur s'est produite. Veuillez réessayer plus tard.";
          }
        }
      );
  }
}
