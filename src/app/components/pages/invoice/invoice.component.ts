import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CommandeService } from '../../../services/commande.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  invoiceData: any;
  classname = 'ct-footer footer-dark';
  ftlogo = 'assets/img/logo-light.png';
  stripe: Stripe | null = null;
  cardNumber: StripeCardNumberElement | null = null;
  cardExpiry: StripeCardExpiryElement | null = null;
  cardCvc: StripeCardCvcElement | null = null;

  // Flag to prevent multiple command creation
  isCommandCreated = false;

  // Track validation for all card fields
  isCardNumberComplete = false;
  isCardExpiryComplete = false;
  isCardCvcComplete = false;

  // Form submission status
  formSubmitted = false;
  isLoading = false;
  today = new Date();
  cardholderName: string = '';

  // Error messages
  cardNumberError: string = '';
  cardExpiryError: string = '';
  cardCvcError: string = '';

  @ViewChild('cardElement') cardElement!: ElementRef;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('invoiceData');
    if (data) {
      this.invoiceData = JSON.parse(data);
    }

    // Load Stripe
    loadStripe('your-publishable-key-here').then((stripe) => {
      this.stripe = stripe;
    });
  }

  ngAfterViewInit(): void {
    this.initializeStripeElements();
  }

  // Initialize Stripe elements
  initializeStripeElements(): void {
    if (this.stripe) {
      const elements = this.stripe.elements();

      // Create individual card elements
      this.cardNumber = elements.create('cardNumber');
      this.cardNumber.on('change', (event) => {
        this.isCardNumberComplete = event.complete;
        this.cardNumberError = event.error ? event.error.message : '';
      });

      this.cardExpiry = elements.create('cardExpiry');
      this.cardExpiry.on('change', (event) => {
        this.isCardExpiryComplete = event.complete;
        this.cardExpiryError = event.error ? event.error.message : '';
      });

      this.cardCvc = elements.create('cardCvc');
      this.cardCvc.on('change', (event) => {
        this.isCardCvcComplete = event.complete;
        this.cardCvcError = event.error ? event.error.message : '';
      });
    }
  }

  // Mount elements when modal opens
  mountCardElements(): void {
    if (this.stripe) {
      const elements = this.stripe.elements();

      // Mount card number element
      if (!this.cardNumber) {
        this.cardNumber = elements.create('cardNumber');
        this.cardNumber.on('change', (event) => {
          this.isCardNumberComplete = event.complete;
          this.cardNumberError = event.error ? event.error.message : '';
        });
      }
      this.cardNumber.mount('#cardNumberElement');

      // Mount card expiry element
      if (!this.cardExpiry) {
        this.cardExpiry = elements.create('cardExpiry');
        this.cardExpiry.on('change', (event) => {
          this.isCardExpiryComplete = event.complete;
          this.cardExpiryError = event.error ? event.error.message : '';
        });
      }
      this.cardExpiry.mount('#cardExpiryElement');

      // Mount card CVC element
      if (!this.cardCvc) {
        this.cardCvc = elements.create('cardCvc');
        this.cardCvc.on('change', (event) => {
          this.isCardCvcComplete = event.complete;
          this.cardCvcError = event.error ? event.error.message : '';
        });
      }
      this.cardCvc.mount('#cardCvcElement');
    }
  }

  getTotal(): number {
    return this.invoiceData?.total || this.getSubtotal() + this.getTax();
  }

  getSubtotal(): number {
    if (!this.invoiceData || !this.invoiceData.items) return 0;
    return this.invoiceData.items.reduce(
      (sum: number, item: any) => sum + (parseFloat(item.price) || 0),
      0
    );
  }

  getTax(): number {
    const taxRate = this.invoiceData?.taxRate || 7;
    return this.getSubtotal() * (taxRate / 100);
  }

  openPaymentModal(content: any): void {
    // Reset the command creation flag
    this.isCommandCreated = false;

    this.formSubmitted = false;
    this.cardholderName = '';
    this.isLoading = false;

    // Reset validation states
    this.isCardNumberComplete = false;
    this.isCardExpiryComplete = false;
    this.isCardCvcComplete = false;

    // Reset error messages
    this.cardNumberError = '';
    this.cardExpiryError = '';
    this.cardCvcError = '';

    const modalRef = this.modalService.open(content, { centered: true });

    // Initialize and mount stripe elements after modal is open
    modalRef.shown.subscribe(() => {
      this.mountCardElements();
    });
  }

  validateForm(): boolean {
    this.formSubmitted = true;

    // Check all required fields
    if (!this.cardholderName || !this.cardholderName.trim()) {
      return false;
    }

    if (!this.isCardNumberComplete) {
      return false;
    }

    if (!this.isCardExpiryComplete) {
      return false;
    }

    if (!this.isCardCvcComplete) {
      return false;
    }

    return true;
  }

  // Modified method with correct status values
  processPayment(modal: any, form: any): void {
    // Prevent multiple submissions
    if (this.isLoading || this.isCommandCreated) {
      return;
    }

    // Validate form
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    this.isLoading = true;

    // Create command with status "EN_ATTENTE" and payment status "PAID"
    const command = {
      dateCommande: new Date().toISOString(),
      status: 'EN_ATTENTE', // Use "EN_ATTENTE" instead of "PAID"
      menuIds: this.invoiceData.items.map((item: any) => item.id),
      paymentStatus: 'PAID', // Keep payment status as "PAID"
      paymentIntentId: 'pi_dummy_' + new Date().getTime(), // Generate dummy payment ID
    };

    // Set flag to prevent duplicate commands
    this.isCommandCreated = true;

    // Create the command
    this.commandeService
      .createCommande(command)
      .pipe(
        catchError((error) => {
          console.error('❌ Erreur lors de la création de la commande:', error);
          return of(null); // Return null on error
        }),
        finalize(() => {
          this.isLoading = false;
          modal.close();

          // Show success message and redirect
          /*alert(
            'Paiement réussi ! Vous allez être redirigé vers vos commandes.'
          );*/
          this.router.navigate(['/commande']);
        })
      )
      .subscribe((result) => {
        if (result) {
          console.log('✅ Commande créée avec succès:', result);
        }
        // Note: redirect happens in finalize, so it occurs whether the API call succeeds or fails
      });
  }
}
