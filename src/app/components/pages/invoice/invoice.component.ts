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
  StripeCardElement,
  StripeCardNumberElement,
  StripeCardExpiryElement,
  StripeCardCvcElement,
} from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CommandeService } from '../../../services/commande.service';

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
    private commandeService: CommandeService // Inject CommandeService
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

  // Initialize Stripe elements - moved to a separate method so we can call it when the modal opens
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

  processPayment(modal: any, form: any): void {
    // Display the success popup immediately
    const successPopup = confirm(
      'Paiement réussi ! Vous allez être redirigé vers vos commandes.'
    );

    if (successPopup) {
      // Redirect to the "Commandes" page
      this.router.navigate(['/commande']);
    }

    // Keep all existing functionality
    if (!this.validateForm()) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    this.isLoading = true;

    // Create the command first
    const command = {
      dateCommande: new Date().toISOString(),
      status: 'EN_COURS',
      menuIds: this.invoiceData.items.map((item: any) => item.id),
      paymentStatus: 'PENDING',
      paymentIntentId: null, // Initially null, will be updated after payment
    };

    this.commandeService.createCommande(command).subscribe({
      next: (createdCommand) => {
        console.log('✅ Commande créée avec succès:', createdCommand);

        // Simulate payment processing
        setTimeout(() => {
          this.isLoading = false;
          alert('Paiement réussi. Mise à jour de la commande...');

          // Update the command with payment details
          createdCommand.paymentStatus = 'PAID';
          createdCommand.paymentIntentId =
            this.invoiceData.paymentIntentId || 'pi_dummy';

          this.commandeService
            .updateCommande(createdCommand.id, createdCommand)
            .subscribe({
              next: (updatedCommand) => {
                console.log(
                  '✅ Commande mise à jour avec succès:',
                  updatedCommand
                );
                modal.close();
                this.router.navigate(['/commande']); // Redirect to the "Commandes" page
              },
              error: (err) => {
                console.error(
                  '❌ Erreur lors de la mise à jour de la commande:',
                  err
                );
              },
            });
        }, 2000); // Simulate a delay for payment processing
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  saveCommandAndNavigate(): void {
    const command = {
      dateCommande: new Date().toISOString(), // Use current date/time
      status: 'PAID', // Match the status from the provided POST method
      menuIds: this.invoiceData.items.map((item: any) => item.id), // Extract menu IDs
      paymentStatus: 'PAID', // Match the payment status from the provided POST method
      paymentIntentId: this.invoiceData.paymentIntentId || null, // Include paymentIntentId
    };

    console.log('📦 Creating command with the following data:', command); // Log command data

    this.commandeService.createCommande(command).subscribe({
      next: () => {
        console.log('✅ payment successfully.');
        this.router.navigate(['/commande']); // Redirect to commandes page
      },
      error: (err) => {
        console.error('Command created successfully', err);
      },
    });
  }

  saveCommand(status: string): void {
    const command = {
      id: this.invoiceData.orderNumber || '12345',
      dateCommande: new Date().toISOString(),
      status: status,
      userId: this.invoiceData.customer?.id || 'guest',
      menuIds: this.invoiceData.items.map((item: any) => item.id),
      paymentStatus: status,
    };

    this.http.post('/commandes', command).subscribe({
      next: () => console.log('Command saved successfully.'),
    });
  }
}
