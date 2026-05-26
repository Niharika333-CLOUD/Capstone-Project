import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="cart-page">
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

        <h1 class="page-title">Shopping Cart</h1>
        
        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your cart...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadCart()">Try Again</button>
        </div>

        <!-- Empty Cart State -->
        <div *ngIf="!loading && !error && (!cart || cart.items.length === 0)" class="empty-cart">
          <div class="empty-cart-icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your cart is empty</h2>
          <p class="text-secondary">Looks like you haven't added any books yet.</p>
          <button class="btn btn-primary btn-lg" routerLink="/products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            Continue Shopping
          </button>
        </div>

        <!-- Cart Content -->
        <div *ngIf="!loading && !error && cart && cart.items.length > 0" class="cart-content">
          <!-- Cart Items List -->
          <div class="cart-items-section">
            <div class="cart-items-header">
              <h2>Cart Items ({{ cart.items.length }})</h2>
              <button class="btn btn-outline btn-sm" (click)="clearCart()">Clear Cart</button>
            </div>

            <div class="cart-items-list">
              <div class="cart-item" *ngFor="let item of cart.items; trackBy: trackByProductId">
                <div class="item-image-container">
                  <img [src]="getProductImage(item)" [alt]="getProductTitle(item)" class="item-image">
                </div>
                
                <div class="item-details">
                  <h3 class="item-title">{{ getProductTitle(item) }}</h3>
                  <p class="item-author text-secondary">by {{ getProductAuthor(item) }}</p>
                  
                  <div class="item-meta">
                    <span class="item-format">{{ getProductFormat(item) }}</span>
                    <span class="item-stock" [class.low-stock]="getProductStock(item) < 5">
                      {{ getProductStock(item) > 0 ? 'In Stock' : 'Out of Stock' }}
                    </span>
                  </div>

                  <div class="item-actions-mobile">
                    <div class="quantity-controls">
                      <button 
                        class="qty-btn" 
                        (click)="decreaseQuantity(item)"
                        [disabled]="item.quantity <= 1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button 
                        class="qty-btn" 
                        (click)="increaseQuantity(item)"
                        [disabled]="item.quantity >= getProductStock(item)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                    <button class="btn-remove" (click)="removeItem(item)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>

                <div class="item-pricing">
                  <div class="item-price">
                    <span class="current-price">₹{{ item.price.toFixed(2) }}</span>
                    <span class="original-price" *ngIf="getProductOriginalPrice(item) > item.price">
                      ₹{{ getProductOriginalPrice(item).toFixed(2) }}
                    </span>
                  </div>
                  <div class="item-subtotal">
                    <span class="text-secondary">Subtotal:</span>
                    <span class="subtotal-amount">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="item-actions">
                  <div class="quantity-controls">
                    <button 
                      class="qty-btn" 
                      (click)="decreaseQuantity(item)"
                      [disabled]="item.quantity <= 1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                    <span class="qty-value">{{ item.quantity }}</span>
                    <button 
                      class="qty-btn" 
                      (click)="increaseQuantity(item)"
                      [disabled]="item.quantity >= getProductStock(item)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </button>
                  </div>
                  <button class="btn-remove" (click)="removeItem(item)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="order-summary-section">
            <div class="order-summary-card">
              <h2 class="summary-title">Order Summary</h2>
              
              <div class="summary-details">
                <div class="summary-row">
                  <span class="summary-label">Subtotal ({{ getTotalItems() }} items)</span>
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

              <div class="savings-badge" *ngIf="getTotalSavings() > 0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                You will save ₹{{ getTotalSavings().toFixed(2) }} on this order
              </div>

              <button class="btn btn-primary btn-lg checkout-btn" (click)="proceedToCheckout()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Proceed to Checkout
              </button>

              <button class="btn btn-outline continue-shopping-btn" routerLink="/products">
                Continue Shopping
              </button>
            </div>

            <!-- Promo Code Section -->
            <div class="promo-code-card">
              <h3>Have a promo code?</h3>
              <div class="promo-input-group">
                <input 
                  type="text" 
                  placeholder="Enter promo code"
                  [(ngModel)]="promoCode"
                  [ngModelOptions]="{standalone: true}">
                <button class="btn btn-secondary" (click)="applyPromoCode()">Apply</button>
              </div>
              <p class="promo-message" *ngIf="promoMessage" [class.error]="promoError">
                {{ promoMessage }}
              </p>
            </div>
          </div>
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

    .cart-page {
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

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      max-width: 600px;
      margin: 2rem auto;
    }

    .empty-cart-icon {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .empty-cart h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .empty-cart p {
      margin-bottom: 2rem;
    }

    /* Cart Content Layout */
    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
      align-items: start;
    }

    /* Cart Items Section */
    .cart-items-section {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .cart-items-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .cart-items-header h2 {
      font-size: 1.5rem;
      margin: 0;
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Cart Item */
    .cart-item {
      display: grid;
      grid-template-columns: 120px 1fr auto auto;
      gap: 1.5rem;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .cart-item:hover {
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(74, 158, 255, 0.1);
    }

    .item-image-container {
      position: relative;
    }

    .item-image {
      width: 120px;
      height: 160px;
      object-fit: cover;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
      line-height: 1.4;
    }

    .item-author {
      font-size: 0.9rem;
      margin: 0;
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }

    .item-format {
      padding: 0.25rem 0.75rem;
      background-color: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .item-stock {
      padding: 0.25rem 0.75rem;
      background-color: var(--success);
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .item-stock.low-stock {
      background-color: var(--warning);
    }

    .item-pricing {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .item-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .current-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .original-price {
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .item-subtotal {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .subtotal-amount {
      font-size: 1rem;
      font-weight: 600;
      color: var(--accent-primary);
    }

    .item-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .item-actions-mobile {
      display: none;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background-color: var(--bg-tertiary);
      border-radius: 6px;
      padding: 0.25rem;
    }

    .qty-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-primary);
    }

    .qty-btn:hover:not(:disabled) {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    .qty-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .qty-value {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 1rem;
    }

    .btn-remove {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: transparent;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .btn-remove:hover {
      background-color: var(--error);
      border-color: var(--error);
      color: white;
    }

    /* Order Summary */
    .order-summary-section {
      position: sticky;
      top: calc(var(--header-height) + 1rem);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-summary-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border-color);
    }

    .summary-title {
      font-size: 1.5rem;
      margin: 0 0 1.5rem 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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

    .savings-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: rgba(76, 175, 80, 0.1);
      border: 1px solid var(--success);
      border-radius: 6px;
      color: var(--success);
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 1rem;
    }

    .checkout-btn {
      width: 100%;
      margin-top: 1.5rem;
    }

    .continue-shopping-btn {
      width: 100%;
      margin-top: 0.75rem;
    }

    /* Promo Code */
    .promo-code-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid var(--border-color);
    }

    .promo-code-card h3 {
      font-size: 1rem;
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }

    .promo-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .promo-input-group input {
      flex: 1;
    }

    .promo-message {
      margin-top: 0.75rem;
      font-size: 0.875rem;
      color: var(--success);
    }

    .promo-message.error {
      color: var(--error);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .cart-content {
        grid-template-columns: 1fr;
      }

      .order-summary-section {
        position: static;
      }
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 100px 1fr;
        gap: 1rem;
      }

      .item-image {
        width: 100px;
        height: 140px;
      }

      .item-pricing,
      .item-actions {
        display: none;
      }

      .item-actions-mobile {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        flex-wrap: wrap;
      }

      .page-title {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .cart-page {
        padding: 1rem 0;
      }

      .cart-items-section {
        padding: 1rem;
      }

      .cart-item {
        grid-template-columns: 80px 1fr;
        padding: 1rem;
      }

      .item-image {
        width: 80px;
        height: 110px;
      }

      .item-title {
        font-size: 1rem;
      }

      .promo-input-group {
        flex-direction: column;
      }
    }
  `]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private router = inject(Router);
  
  cart: Cart | null = null;
  loading = false;
  error = '';
  promoCode = '';
  promoMessage = '';
  promoError = false;
  discount = 0;

  ngOnInit() {
    this.loadCart();
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

  getProductImage(item: any): string {
    return item.product?.images?.[0]?.url || item.product?.coverImage || 'assets/placeholder-book.jpg';
  }

  getProductTitle(item: any): string {
    return item.product?.title || 'Unknown Title';
  }

  getProductAuthor(item: any): string {
    return item.product?.author || 'Unknown Author';
  }

  getProductFormat(item: any): string {
    return item.product?.format || 'Paperback';
  }

  getProductStock(item: any): number {
    return item.product?.stock || 0;
  }

  getProductOriginalPrice(item: any): number {
    return item.product?.originalPrice || item.price;
  }

  increaseQuantity(item: any) {
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    const maxStock = this.getProductStock(item);
    
    if (item.quantity >= maxStock) {
      return;
    }

    this.cartService.updateCartItem(productId, item.quantity + 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Update quantity error:', err)
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantity <= 1) {
      return;
    }

    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    this.cartService.updateCartItem(productId, item.quantity - 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Update quantity error:', err)
    });
  }

  removeItem(item: any) {
    if (!confirm('Are you sure you want to remove this item from your cart?')) {
      return;
    }

    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Remove item error:', err)
    });
  }

  clearCart() {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    this.cartService.clearCart().subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Clear cart error:', err)
    });
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

  getTotalSavings(): number {
    if (!this.cart) return 0;
    let savings = 0;
    this.cart.items.forEach(item => {
      const originalPrice = this.getProductOriginalPrice(item);
      if (originalPrice > item.price) {
        savings += (originalPrice - item.price) * item.quantity;
      }
    });
    return savings + this.discount;
  }

  applyPromoCode() {
    if (!this.promoCode.trim()) {
      this.promoMessage = 'Please enter a promo code';
      this.promoError = true;
      return;
    }

    // Simulate promo code validation
    const validCodes: { [key: string]: number } = {
      'SAVE10': 10,
      'SAVE50': 50,
      'SAVE100': 100,
      'WELCOME': 25
    };

    const code = this.promoCode.toUpperCase();
    if (validCodes[code]) {
      this.discount = validCodes[code];
      this.promoMessage = `Promo code applied! You saved ₹${this.discount}`;
      this.promoError = false;
    } else {
      this.promoMessage = 'Invalid promo code';
      this.promoError = true;
      this.discount = 0;
    }
  }

  proceedToCheckout() {
    if (!this.cart || this.cart.items.length === 0) {
      return;
    }
    this.router.navigate(['/checkout']);
  }

  trackByProductId(index: number, item: any): string {
    return typeof item.product === 'string' ? item.product : item.product._id;
  }
}

// Made with Bob
