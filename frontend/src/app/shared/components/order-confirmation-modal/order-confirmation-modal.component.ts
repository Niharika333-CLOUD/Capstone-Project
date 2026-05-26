import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <!-- Success Icon -->
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#4caf50" stroke-width="2" fill="rgba(76, 175, 80, 0.1)"/>
            <path d="M8 12l2 2 4-4" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Success Message -->
        <h2 class="success-title">Order Placed Successfully!</h2>
        <p class="success-message">
          Your purchase of the following reads is successful
        </p>

        <!-- Order Details -->
        <div class="order-details" *ngIf="order">
          <div class="order-info">
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">{{ order._id || order.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value amount">₹{{ order.totalAmount?.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Purchased Books -->
        <div class="purchased-books" *ngIf="items && items.length > 0">
          <h3>Your Books</h3>
          <div class="books-list">
            <div class="book-item" *ngFor="let item of items">
              <div class="book-image">
                <img [src]="getProductImage(item)" [alt]="getProductTitle(item)">
              </div>
              <div class="book-details">
                <h4>{{ getProductTitle(item) }}</h4>
                <p class="book-author">{{ getProductAuthor(item) }}</p>
                <div class="book-meta">
                  <span class="quantity">Qty: {{ item.quantity }}</span>
                  <span class="price">₹{{ item.price.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div class="delivery-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>Your order will be delivered within 5-7 business days</span>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button class="btn btn-outline" (click)="viewOrderDetails()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            View Order Details
          </button>
          <button class="btn btn-primary" (click)="continueShopping()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            Continue Your Shopping
          </button>
        </div>

        <!-- Email Confirmation -->
        <p class="email-confirmation">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          Order confirmation has been sent to your email
        </p>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background-color: var(--bg-secondary);
      border-radius: 16px;
      padding: 2.5rem;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid var(--border-color);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Success Icon */
    .success-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
      animation: scaleIn 0.5s ease 0.2s both;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    /* Success Message */
    .success-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .success-message {
      text-align: center;
      color: var(--text-secondary);
      margin: 0 0 2rem 0;
      font-size: 1rem;
    }

    /* Order Details */
    .order-details {
      background-color: var(--bg-tertiary);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .info-value {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .info-value.amount {
      color: var(--accent-primary);
      font-size: 1.1rem;
      font-weight: 700;
    }

    /* Purchased Books */
    .purchased-books {
      margin-bottom: 1.5rem;
    }

    .purchased-books h3 {
      font-size: 1.1rem;
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }

    .books-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .book-item {
      display: grid;
      grid-template-columns: 60px 1fr;
      gap: 1rem;
      padding: 1rem;
      background-color: var(--bg-tertiary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .book-image {
      width: 60px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
    }

    .book-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .book-details h4 {
      font-size: 0.95rem;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .book-author {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0 0 0.5rem 0;
    }

    .book-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .quantity {
      padding: 0.2rem 0.5rem;
      background-color: var(--bg-secondary);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .price {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--accent-primary);
    }

    /* Delivery Info */
    .delivery-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background-color: rgba(74, 158, 255, 0.1);
      border: 1px solid var(--accent-primary);
      border-radius: 8px;
      color: var(--accent-primary);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    /* Modal Actions */
    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .modal-actions .btn {
      flex: 1;
    }

    /* Email Confirmation */
    .email-confirmation {
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
      margin: 0;
    }

    /* Scrollbar */
    .books-list::-webkit-scrollbar {
      width: 6px;
    }

    .books-list::-webkit-scrollbar-track {
      background: var(--bg-secondary);
      border-radius: 3px;
    }

    .books-list::-webkit-scrollbar-thumb {
      background: var(--bg-tertiary);
      border-radius: 3px;
    }

    .books-list::-webkit-scrollbar-thumb:hover {
      background: #505050;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .modal-content {
        padding: 2rem;
      }

      .success-title {
        font-size: 1.5rem;
      }

      .modal-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 1.5rem;
        width: 95%;
      }

      .success-title {
        font-size: 1.25rem;
      }

      .book-item {
        grid-template-columns: 50px 1fr;
        gap: 0.75rem;
        padding: 0.75rem;
      }

      .book-image {
        width: 50px;
        height: 70px;
      }
    }
  `]
})
export class OrderConfirmationModalComponent implements OnInit {
  private router = inject(Router);

  order: any = null;
  items: any[] = [];

  ngOnInit() {
    // Get order data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
      this.items = navigation.extras.state['items'] || [];
    }

    // If accessed directly without state, try to get from history
    if (!this.order) {
      const state = history.state;
      if (state.order) {
        this.order = state.order;
        this.items = state.items || [];
      }
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

  formatDate(date: any): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  viewOrderDetails() {
    if (this.order) {
      this.router.navigate(['/orders', this.order._id || this.order.id]);
    }
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  onOverlayClick(event: MouseEvent) {
    // Close modal when clicking overlay
    if (event.target === event.currentTarget) {
      this.continueShopping();
    }
  }
}

// Made with Bob