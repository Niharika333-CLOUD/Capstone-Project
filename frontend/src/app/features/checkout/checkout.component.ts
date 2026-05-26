import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="checkout-page">
      <div class="container">
        <!-- Back Button -->
        <div class="back-button-container">
          <button class="btn-back" routerLink="/">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>

        <h1 class="page-title">Checkout</h1>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading checkout...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadCart()">Try Again</button>
        </div>

        <!-- Checkout Content -->
        <div *ngIf="!loading && !error && cart && cart.items.length > 0" class="checkout-content">
          <!-- Left Side: Cart Summary -->
          <div class="cart-summary-section">
            <div class="section-card">
              <h2 class="section-title">Order Items ({{ cart.items.length }})</h2>
              
              <div class="cart-items-list">
                <div class="mini-cart-item" *ngFor="let item of cart.items">
                  <div class="mini-item-image">
                    <img [src]="getProductImage(item)" [alt]="getProductTitle(item)">
                  </div>
                  <div class="mini-item-details">
                    <h4>{{ getProductTitle(item) }}</h4>
                    <p class="text-secondary">{{ getProductAuthor(item) }}</p>
                    <div class="mini-item-meta">
                      <span class="quantity-badge">Qty: {{ item.quantity }}</span>
                      <span class="price">₹{{ item.price.toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="mini-item-total">
                    ₹{{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Address Form & Order Summary -->
          <div class="checkout-form-section">
            <!-- Delivery Address Form -->
            <div class="section-card">
              <h2 class="section-title">Delivery Address</h2>

              <!-- Use Saved Address Option -->
              <div class="saved-address-option" *ngIf="savedAddress">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="useSavedAddress"
                    [ngModelOptions]="{standalone: true}"
                    (change)="toggleSavedAddress()">
                  <span>Use saved address</span>
                </label>
                <div class="saved-address-preview" *ngIf="useSavedAddress">
                  <p><strong>{{ savedAddress.firstName }} {{ savedAddress.lastName }}</strong></p>
                  <p>{{ savedAddress.address }}</p>
                  <p>{{ savedAddress.city }}, {{ savedAddress.state }} {{ savedAddress.pinCode }}</p>
                  <p>{{ savedAddress.country }}</p>
                  <p>Phone: {{ savedAddress.phone }}</p>
                </div>
              </div>

              <!-- Address Form -->
              <form [formGroup]="addressForm" class="address-form" *ngIf="!useSavedAddress">
                <div class="form-row">
                  <div class="form-group">
                    <label for="firstName">First Name *</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      formControlName="firstName"
                      placeholder="Enter first name"
                      [class.error]="isFieldInvalid('firstName')">
                    <span class="error-message" *ngIf="isFieldInvalid('firstName')">
                      First name is required
                    </span>
                  </div>
                  <div class="form-group">
                    <label for="lastName">Last Name *</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      formControlName="lastName"
                      placeholder="Enter last name"
                      [class.error]="isFieldInvalid('lastName')">
                    <span class="error-message" *ngIf="isFieldInvalid('lastName')">
                      Last name is required
                    </span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      formControlName="email"
                      placeholder="your.email@example.com"
                      [class.error]="isFieldInvalid('email')">
                    <span class="error-message" *ngIf="isFieldInvalid('email')">
                      {{ getEmailError() }}
                    </span>
                  </div>
                  <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <div class="phone-input-group">
                      <select formControlName="countryCode" class="country-code">
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+61">+61</option>
                        <option value="+86">+86</option>
                      </select>
                      <input 
                        type="tel" 
                        id="phone" 
                        formControlName="phone"
                        placeholder="1234567890"
                        [class.error]="isFieldInvalid('phone')">
                    </div>
                    <span class="error-message" *ngIf="isFieldInvalid('phone')">
                      {{ getPhoneError() }}
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label for="address">Address Line *</label>
                  <input 
                    type="text" 
                    id="address" 
                    formControlName="address"
                    placeholder="House No., Building Name, Street"
                    [class.error]="isFieldInvalid('address')">
                  <span class="error-message" *ngIf="isFieldInvalid('address')">
                    Address is required
                  </span>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      formControlName="city"
                      placeholder="Enter city"
                      [class.error]="isFieldInvalid('city')">
                    <span class="error-message" *ngIf="isFieldInvalid('city')">
                      City is required
                    </span>
                  </div>
                  <div class="form-group">
                    <label for="state">State *</label>
                    <input 
                      type="text" 
                      id="state" 
                      formControlName="state"
                      placeholder="Enter state"
                      [class.error]="isFieldInvalid('state')">
                    <span class="error-message" *ngIf="isFieldInvalid('state')">
                      State is required
                    </span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="pinCode">Pin Code *</label>
                    <input 
                      type="text" 
                      id="pinCode" 
                      formControlName="pinCode"
                      placeholder="123456"
                      maxlength="6"
                      [class.error]="isFieldInvalid('pinCode')">
                    <span class="error-message" *ngIf="isFieldInvalid('pinCode')">
                      {{ getPinCodeError() }}
                    </span>
                  </div>
                  <div class="form-group">
                    <label for="country">Country *</label>
                    <select 
                      id="country" 
                      formControlName="country"
                      [class.error]="isFieldInvalid('country')">
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                    <span class="error-message" *ngIf="isFieldInvalid('country')">
                      Country is required
                    </span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" formControlName="saveAddress">
                    <span>Save this address for future orders</span>
                  </label>
                </div>
              </form>
            </div>

            <!-- Order Summary Card -->
            <div class="section-card order-summary-card">
              <h2 class="section-title">Order Summary</h2>
              
              <div class="summary-details">
                <div class="summary-row">
                  <span class="summary-label">Price ({{ getTotalItems() }} items)</span>
                  <span class="summary-value">₹{{ cart.totalPrice.toFixed(2) }}</span>
                </div>
                
                <div class="summary-row">
                  <span class="summary-label">Tax (GST 18%)</span>
                  <span class="summary-value">₹{{ calculateTax().toFixed(2) }}</span>
                </div>
                
                <div class="summary-row">
                  <span class="summary-label">Delivery Charges</span>
                  <span class="summary-value delivery-free">
                    {{ cart.totalPrice >= 500 ? 'FREE' : '₹50.00' }}
                  </span>
                </div>
                
                <div class="summary-row discount" *ngIf="discount > 0">
                  <span class="summary-label">Discount</span>
                  <span class="summary-value">-₹{{ discount.toFixed(2) }}</span>
                </div>

                <div class="summary-divider"></div>
                
                <div class="summary-row total">
                  <span class="summary-label">Total Amount</span>
                  <span class="summary-value">₹{{ calculateTotal().toFixed(2) }}</span>
                </div>
              </div>

              <div class="payment-info">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <span>Secure payment powered by Stripe</span>
              </div>

              <button 
                class="btn btn-primary btn-lg pay-now-btn" 
                (click)="proceedToPayment()"
                [disabled]="processingOrder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!processingOrder">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <div class="spinner" *ngIf="processingOrder" style="width: 20px; height: 20px; border-width: 2px;"></div>
                {{ processingOrder ? 'Processing...' : 'Pay Now' }}
              </button>

              <div class="secure-checkout-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>100% Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Cart State -->
        <div *ngIf="!loading && !error && (!cart || cart.items.length === 0)" class="empty-state">
          <div class="empty-icon">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p class="text-secondary">Add items to your cart before checking out.</p>
          <button class="btn btn-primary" routerLink="/products">Browse Products</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Back Button */
    .back-button-container {
      margin-bottom: 1.5rem;
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

    .checkout-page {
      min-height: calc(100vh - var(--header-height) - 200px);
      padding: 2rem 0;
      background-color: var(--bg-primary);
    }

    .page-title {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: var(--text-primary);
    }

    /* Loading & Error States */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 0;
      gap: 1rem;
    }

    .error-message {
      text-align: center;
      padding: 2rem;
      background-color: var(--card-bg);
      border-radius: 8px;
      border: 1px solid var(--error);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      max-width: 600px;
      margin: 2rem auto;
    }

    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      margin-bottom: 2rem;
    }

    /* Checkout Content Layout */
    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 500px;
      gap: 2rem;
      align-items: start;
    }

    /* Section Card */
    .section-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .section-title {
      font-size: 1.25rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    /* Cart Summary */
    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .mini-cart-item {
      display: grid;
      grid-template-columns: 60px 1fr auto;
      gap: 1rem;
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .mini-item-image {
      width: 60px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
    }

    .mini-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mini-item-details h4 {
      font-size: 0.95rem;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .mini-item-details p {
      font-size: 0.85rem;
      margin: 0 0 0.5rem 0;
    }

    .mini-item-meta {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .quantity-badge {
      padding: 0.2rem 0.5rem;
      background-color: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .mini-item-meta .price {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .mini-item-total {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent-primary);
      text-align: right;
    }

    /* Saved Address */
    .saved-address-option {
      margin-bottom: 1.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.95rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
      cursor: pointer;
    }

    .saved-address-preview {
      margin-top: 1rem;
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .saved-address-preview p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .saved-address-preview p:first-child {
      color: var(--text-primary);
      font-weight: 600;
    }

    /* Address Form */
    .address-form {
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
      padding: 0.75rem;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-primary);
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: var(--accent-primary);
      background-color: var(--bg-tertiary);
    }

    .form-group input.error,
    .form-group select.error {
      border-color: var(--error);
    }

    .error-message {
      font-size: 0.8rem;
      color: var(--error);
      margin-top: -0.25rem;
    }

    .phone-input-group {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 0.5rem;
    }

    .country-code {
      padding: 0.75rem 0.5rem;
    }

    /* Order Summary */
    .order-summary-card {
      position: sticky;
      top: calc(var(--header-height) + 1rem);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-label {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .summary-value {
      font-weight: 600;
      font-size: 1rem;
      color: var(--text-primary);
    }

    .delivery-free {
      color: var(--success);
      font-weight: 700;
    }

    .summary-row.discount .summary-value {
      color: var(--success);
    }

    .summary-divider {
      height: 1px;
      background-color: var(--border-color);
      margin: 0.5rem 0;
    }

    .summary-row.total {
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid var(--border-color);
    }

    .summary-row.total .summary-label {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .summary-row.total .summary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    .payment-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: var(--bg-secondary);
      border-radius: 6px;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .pay-now-btn {
      width: 100%;
      margin-bottom: 1rem;
    }

    .secure-checkout-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid var(--success);
      border-radius: 6px;
      color: var(--success);
      font-size: 0.875rem;
      font-weight: 500;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .checkout-content {
        grid-template-columns: 1fr;
      }

      .order-summary-card {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .page-title {
        font-size: 1.5rem;
      }

      .section-card {
        padding: 1rem;
      }
    }

    @media (max-width: 480px) {
      .checkout-page {
        padding: 1rem 0;
      }

      .mini-cart-item {
        grid-template-columns: 50px 1fr;
        gap: 0.75rem;
      }

      .mini-item-image {
        width: 50px;
        height: 70px;
      }

      .mini-item-total {
        grid-column: 2;
        text-align: left;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  cart: Cart | null = null;
  loading = false;
  error = '';
  processingOrder = false;
  discount = 0;
  useSavedAddress = false;
  savedAddress: any = null;

  addressForm: FormGroup;

  constructor() {
    this.addressForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: ['India', Validators.required],
      saveAddress: [false]
    });
  }

  ngOnInit() {
    this.loadCart();
    this.loadUserData();
  }

  loadCart() {
    this.loading = true;
    this.error = '';

    this.cartService.getCart().subscribe({
      next: (response) => {
        this.cart = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cart. Please try again.';
        this.loading = false;
        console.error('Cart load error:', err);
      }
    });
  }

  loadUserData() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Pre-fill form with user data
        const nameParts = user.name.split(' ');
        this.addressForm.patchValue({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || ''
        });

        // Load saved address if exists (use first default address)
        if (user.addresses && user.addresses.length > 0) {
          const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
          this.savedAddress = {
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            email: user.email,
            phone: user.phone || '',
            address: defaultAddress.street,
            city: defaultAddress.city,
            state: defaultAddress.state,
            pinCode: defaultAddress.zipCode,
            country: defaultAddress.country
          };
        }
      }
    });
  }

  toggleSavedAddress() {
    if (this.useSavedAddress && this.savedAddress) {
      this.addressForm.patchValue(this.savedAddress);
    } else {
      this.addressForm.reset({
        countryCode: '+91',
        country: 'India',
        saveAddress: false
      });
    }
  }

  getProductImage(item: any): string {
    return item.product?.images?.[0]?.url || item.product?.coverImage || 'assets/placeholder-book.jpg';
  }

  getProductTitle(item: any): string {
    return item.product?.title || 'Unknown Title';
  }

  getProductAuthor(item: any): string {
    return item.product?.author || 'Unknown Author';
  }

  getTotalItems(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  calculateTax(): number {
    if (!this.cart) return 0;
    return this.cart.totalPrice * 0.18; // 18% GST
  }

  calculateDelivery(): number {
    if (!this.cart) return 0;
    return this.cart.totalPrice >= 500 ? 0 : 50;
  }

  calculateTotal(): number {
    if (!this.cart) return 0;
    return this.cart.totalPrice + this.calculateTax() + this.calculateDelivery() - this.discount;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getEmailError(): string {
    const email = this.addressForm.get('email');
    if (email?.hasError('required')) {
      return 'Email is required';
    }
    if (email?.hasError('email')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  getPhoneError(): string {
    const phone = this.addressForm.get('phone');
    if (phone?.hasError('required')) {
      return 'Phone number is required';
    }
    if (phone?.hasError('pattern')) {
      return 'Please enter a valid 10-digit phone number';
    }
    return '';
  }

  getPinCodeError(): string {
    const pinCode = this.addressForm.get('pinCode');
    if (pinCode?.hasError('required')) {
      return 'Pin code is required';
    }
    if (pinCode?.hasError('pattern')) {
      return 'Please enter a valid 6-digit pin code';
    }
    return '';
  }

  proceedToPayment() {
    if (!this.useSavedAddress) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.addressForm.controls).forEach(key => {
        this.addressForm.get(key)?.markAsTouched();
      });

      if (this.addressForm.invalid) {
        return;
      }
    }

    if (!this.cart || this.cart.items.length === 0) {
      return;
    }

    // Navigate to payment page with order data
    this.router.navigate(['/payment'], {
      state: {
        cart: this.cart,
        address: this.useSavedAddress ? this.savedAddress : this.addressForm.value,
        total: this.calculateTotal()
      }
    });
  }
}

// Made with Bob
