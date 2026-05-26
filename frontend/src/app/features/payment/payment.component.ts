import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="payment-page">
      <!-- Back Button -->
      <div class="back-button-container">
        <button class="btn-back" routerLink="/">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back to Home
        </button>
      </div>

      <!-- Decorative Background -->
      <div class="decorative-background">
        <div class="book-illustration book-1">
          <svg viewBox="0 0 100 140" fill="none">
            <rect x="10" y="10" width="80" height="120" rx="4" fill="#4a9eff" opacity="0.8"/>
            <rect x="15" y="15" width="70" height="110" rx="2" fill="#357abd"/>
            <line x1="25" y1="30" x2="75" y2="30" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="40" x2="75" y2="40" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="50" x2="65" y2="50" stroke="white" stroke-width="2" opacity="0.6"/>
          </svg>
        </div>
        <div class="book-illustration book-2">
          <svg viewBox="0 0 100 140" fill="none">
            <rect x="10" y="10" width="80" height="120" rx="4" fill="#ff9800" opacity="0.8"/>
            <rect x="15" y="15" width="70" height="110" rx="2" fill="#f57c00"/>
            <line x1="25" y1="30" x2="75" y2="30" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="40" x2="75" y2="40" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="50" x2="65" y2="50" stroke="white" stroke-width="2" opacity="0.6"/>
          </svg>
        </div>
        <div class="book-illustration book-3">
          <svg viewBox="0 0 100 140" fill="none">
            <rect x="10" y="10" width="80" height="120" rx="4" fill="#4caf50" opacity="0.8"/>
            <rect x="15" y="15" width="70" height="110" rx="2" fill="#388e3c"/>
            <line x1="25" y1="30" x2="75" y2="30" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="40" x2="75" y2="40" stroke="white" stroke-width="2" opacity="0.6"/>
            <line x1="25" y1="50" x2="65" y2="50" stroke="white" stroke-width="2" opacity="0.6"/>
          </svg>
        </div>
      </div>

      <!-- Payment Modal -->
      <div class="payment-modal-overlay">
        <div class="payment-modal">
          <div class="modal-header">
            <h2>Complete Payment</h2>
            <div class="payment-amount">
              <span class="amount-label">Total Amount</span>
              <span class="amount-value">₹{{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Payment Method Tabs -->
          <div class="payment-tabs">
            <button 
              class="tab-btn"
              [class.active]="selectedPaymentMethod === 'credit'"
              (click)="selectPaymentMethod('credit')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Credit Card
            </button>
            <button 
              class="tab-btn"
              [class.active]="selectedPaymentMethod === 'debit'"
              (click)="selectPaymentMethod('debit')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              Debit Card
            </button>
            <button 
              class="tab-btn"
              [class.active]="selectedPaymentMethod === 'upi'"
              (click)="selectPaymentMethod('upi')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              UPI
            </button>
            <button 
              class="tab-btn"
              [class.active]="selectedPaymentMethod === 'wallet'"
              (click)="selectPaymentMethod('wallet')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"></path>
              </svg>
              Wallet
            </button>
          </div>

          <!-- Payment Forms -->
          <div class="payment-form-container">
            <!-- Credit/Debit Card Form -->
            <form 
              *ngIf="selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit'" 
              [formGroup]="cardForm"
              class="payment-form">
              <div class="form-group">
                <label for="cardNumber">Card Number *</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  formControlName="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  (input)="formatCardNumber($event)"
                  [class.error]="isCardFieldInvalid('cardNumber')">
                <span class="error-message" *ngIf="isCardFieldInvalid('cardNumber')">
                  {{ getCardNumberError() }}
                </span>
              </div>

              <div class="form-group">
                <label for="cardName">Name on Card *</label>
                <input 
                  type="text" 
                  id="cardName" 
                  formControlName="cardName"
                  placeholder="JOHN DOE"
                  [class.error]="isCardFieldInvalid('cardName')">
                <span class="error-message" *ngIf="isCardFieldInvalid('cardName')">
                  Cardholder name is required
                </span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="cvv">CVV *</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    formControlName="cvv"
                    placeholder="123"
                    maxlength="4"
                    [class.error]="isCardFieldInvalid('cvv')">
                  <span class="error-message" *ngIf="isCardFieldInvalid('cvv')">
                    {{ getCvvError() }}
                  </span>
                </div>
                <div class="form-group">
                  <label for="expiryDate">Expiry Date *</label>
                  <input 
                    type="text" 
                    id="expiryDate" 
                    formControlName="expiryDate"
                    placeholder="MM/YY"
                    maxlength="5"
                    (input)="formatExpiryDate($event)"
                    [class.error]="isCardFieldInvalid('expiryDate')">
                  <span class="error-message" *ngIf="isCardFieldInvalid('expiryDate')">
                    {{ getExpiryError() }}
                  </span>
                </div>
              </div>

              <div class="secure-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Your card details are encrypted and secure</span>
              </div>
            </form>

            <!-- UPI Form -->
            <form *ngIf="selectedPaymentMethod === 'upi'" [formGroup]="upiForm" class="payment-form">
              <div class="form-group">
                <label for="upiId">UPI ID *</label>
                <input 
                  type="text" 
                  id="upiId" 
                  formControlName="upiId"
                  placeholder="yourname@upi"
                  [class.error]="isUpiFieldInvalid('upiId')">
                <span class="error-message" *ngIf="isUpiFieldInvalid('upiId')">
                  {{ getUpiIdError() }}
                </span>
              </div>

              <div class="upi-apps">
                <p class="text-secondary">Or pay with</p>
                <div class="upi-app-buttons">
                  <button type="button" class="upi-app-btn" (click)="payWithUpiApp('gpay')">
                    <span>Google Pay</span>
                  </button>
                  <button type="button" class="upi-app-btn" (click)="payWithUpiApp('phonepe')">
                    <span>PhonePe</span>
                  </button>
                  <button type="button" class="upi-app-btn" (click)="payWithUpiApp('paytm')">
                    <span>Paytm</span>
                  </button>
                </div>
              </div>
            </form>

            <!-- Wallet Form -->
            <form *ngIf="selectedPaymentMethod === 'wallet'" class="payment-form">
              <div class="wallet-balance">
                <div class="balance-card">
                  <span class="balance-label">Available Balance</span>
                  <span class="balance-amount">₹{{ walletBalance.toFixed(2) }}</span>
                </div>
                <div class="balance-info" *ngIf="walletBalance < totalAmount">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Insufficient balance. Please add ₹{{ (totalAmount - walletBalance).toFixed(2) }} to your wallet.</span>
                </div>
              </div>
            </form>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button class="btn btn-outline" (click)="goBack()" [disabled]="processing">
              Cancel
            </button>
            <button 
              class="btn btn-primary btn-lg" 
              (click)="processPayment()"
              [disabled]="processing || !canProceed()">
              <div class="spinner" *ngIf="processing" style="width: 20px; height: 20px; border-width: 2px;"></div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!processing">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              {{ processing ? 'Processing...' : 'Pay Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Back Button */
    .back-button-container {
      position: fixed;
      top: 2rem;
      left: 2rem;
      z-index: 1000;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .btn-back:hover {
      background-color: var(--bg-secondary);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
      transform: translateX(-4px);
    }

    .btn-back svg {
      transition: transform 0.2s ease;
    }

    .btn-back:hover svg {
      transform: translateX(-4px);
    }

    .payment-page {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      overflow: hidden;
    }

    /* Decorative Background */
    .decorative-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      opacity: 0.15;
    }

    .book-illustration {
      position: absolute;
      animation: float 6s ease-in-out infinite;
    }

    .book-illustration svg {
      width: 150px;
      height: auto;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    }

    .book-1 {
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .book-2 {
      top: 60%;
      right: 15%;
      animation-delay: 2s;
    }

    .book-3 {
      bottom: 15%;
      left: 20%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
    }

    /* Payment Modal */
    .payment-modal-overlay {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }

    .payment-modal {
      background-color: var(--bg-secondary);
      border-radius: 16px;
      padding: 2rem;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--border-color);
      animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h2 {
      font-size: 1.75rem;
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }

    .payment-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: var(--bg-tertiary);
      border-radius: 8px;
    }

    .amount-label {
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .amount-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    /* Payment Tabs */
    .payment-tabs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .tab-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 0.5rem;
      background-color: var(--bg-tertiary);
      border: 2px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .tab-btn:hover {
      background-color: var(--bg-secondary);
      border-color: var(--accent-primary);
    }

    .tab-btn.active {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    /* Payment Form */
    .payment-form-container {
      min-height: 300px;
      margin-bottom: 2rem;
    }

    .payment-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-group input,
    .form-group select {
      padding: 0.875rem;
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--accent-primary);
      background-color: var(--bg-secondary);
    }

    .form-group input.error {
      border-color: var(--error);
    }

    .error-message {
      font-size: 0.8rem;
      color: var(--error);
      margin-top: -0.25rem;
    }

    .secure-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid var(--success);
      border-radius: 6px;
      color: var(--success);
      font-size: 0.875rem;
    }

    /* UPI */
    .upi-apps {
      margin-top: 1rem;
    }

    .upi-apps p {
      margin-bottom: 1rem;
      text-align: center;
    }

    .upi-app-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .upi-app-btn {
      padding: 1rem;
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .upi-app-btn:hover {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
      transform: translateY(-2px);
    }

    /* Wallet */
    .wallet-balance {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .balance-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-hover) 100%);
      border-radius: 12px;
      text-align: center;
    }

    .balance-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .balance-amount {
      font-size: 2rem;
      font-weight: 700;
      color: white;
    }

    .balance-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: rgba(255, 152, 0, 0.1);
      border: 1px solid var(--warning);
      border-radius: 6px;
      color: var(--warning);
      font-size: 0.875rem;
    }

    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .modal-actions .btn {
      flex: 1;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .payment-modal {
        padding: 1.5rem;
      }

      .payment-tabs {
        grid-template-columns: repeat(2, 1fr);
      }

      .tab-btn {
        font-size: 0.8rem;
        padding: 0.75rem 0.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .upi-app-buttons {
        grid-template-columns: 1fr;
      }

      .modal-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .payment-modal-overlay {
        padding: 1rem;
      }

      .modal-header h2 {
        font-size: 1.5rem;
      }

      .amount-value {
        font-size: 1.5rem;
      }

      .book-illustration svg {
        width: 100px;
      }
    }
  `]
})
export class PaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  selectedPaymentMethod: 'credit' | 'debit' | 'upi' | 'wallet' = 'credit';
  processing = false;
  totalAmount = 0;
  walletBalance = 500; // Mock wallet balance
  orderData: any = null;

  cardForm: FormGroup;
  upiForm: FormGroup;

  constructor() {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      cardName: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]]
    });

    this.upiForm = this.fb.group({
      upiId: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[\w.-]+$/)]]
    });

    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.orderData = navigation.extras.state;
      this.totalAmount = this.orderData.total || 0;
    }
  }

  ngOnInit() {
    // If no order data, redirect back to checkout
    if (!this.orderData) {
      this.router.navigate(['/checkout']);
    }
  }

  selectPaymentMethod(method: 'credit' | 'debit' | 'upi' | 'wallet') {
    this.selectedPaymentMethod = method;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\//g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.cardForm.patchValue({ expiryDate: value }, { emitEvent: false });
  }

  isCardFieldInvalid(fieldName: string): boolean {
    const field = this.cardForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isUpiFieldInvalid(fieldName: string): boolean {
    const field = this.upiForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCardNumberError(): string {
    const field = this.cardForm.get('cardNumber');
    if (field?.hasError('required')) return 'Card number is required';
    if (field?.hasError('pattern')) return 'Invalid card number format';
    return '';
  }

  getCvvError(): string {
    const field = this.cardForm.get('cvv');
    if (field?.hasError('required')) return 'CVV is required';
    if (field?.hasError('pattern')) return 'Invalid CVV';
    return '';
  }

  getExpiryError(): string {
    const field = this.cardForm.get('expiryDate');
    if (field?.hasError('required')) return 'Expiry date is required';
    if (field?.hasError('pattern')) return 'Invalid format (MM/YY)';
    return '';
  }

  getUpiIdError(): string {
    const field = this.upiForm.get('upiId');
    if (field?.hasError('required')) return 'UPI ID is required';
    if (field?.hasError('pattern')) return 'Invalid UPI ID format';
    return '';
  }

  canProceed(): boolean {
    if (this.selectedPaymentMethod === 'credit' || this.selectedPaymentMethod === 'debit') {
      return this.cardForm.valid;
    } else if (this.selectedPaymentMethod === 'upi') {
      return this.upiForm.valid;
    } else if (this.selectedPaymentMethod === 'wallet') {
      return this.walletBalance >= this.totalAmount;
    }
    return false;
  }

  payWithUpiApp(app: string) {
    // Simulate UPI app payment
    this.processing = true;
    setTimeout(() => {
      this.completeOrder();
    }, 2000);
  }

  processPayment() {
    if (!this.canProceed()) {
      return;
    }

    this.processing = true;

    // Simulate payment processing
    setTimeout(() => {
      this.completeOrder();
    }, 2000);
  }

  completeOrder() {
    // Map payment method to backend format
    let paymentMethod: 'card' | 'upi' | 'wallet' | 'cod' = 'card';
    if (this.selectedPaymentMethod === 'credit' || this.selectedPaymentMethod === 'debit') {
      paymentMethod = 'card';
    } else if (this.selectedPaymentMethod === 'upi') {
      paymentMethod = 'upi';
    } else if (this.selectedPaymentMethod === 'wallet') {
      paymentMethod = 'wallet';
    }

    // Create order with backend
    const orderPayload = {
      items: this.orderData.cart.items.map((item: any) => ({
        product: typeof item.product === 'string' ? item.product : item.product._id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: this.orderData.address,
      paymentMethod: paymentMethod,
      totalAmount: this.totalAmount
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: (response) => {
        // Clear cart
        this.cartService.clearCart().subscribe();
        
        // Navigate to order confirmation with order details
        this.router.navigate(['/order-confirmation'], {
          state: {
            order: response.data,
            items: this.orderData.cart.items
          }
        });
      },
      error: (err) => {
        console.error('Order creation error:', err);
        this.processing = false;
        alert('Payment failed. Please try again.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/checkout']);
  }
}

// Made with Bob