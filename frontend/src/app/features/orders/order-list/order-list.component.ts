import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-page">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">My Orders</h1>
          <p class="page-subtitle">Track and manage your orders</p>
        </div>

        <!-- Filter Tabs -->
        <div class="filter-tabs">
          <button 
            class="filter-tab"
            [class.active]="selectedFilter === 'all'"
            (click)="filterOrders('all')">
            All Orders
            <span class="count" *ngIf="orders.length > 0">{{ orders.length }}</span>
          </button>
          <button 
            class="filter-tab"
            [class.active]="selectedFilter === 'pending'"
            (click)="filterOrders('pending')">
            Processing
            <span class="count">{{ getOrderCountByStatus('pending') }}</span>
          </button>
          <button 
            class="filter-tab"
            [class.active]="selectedFilter === 'shipped'"
            (click)="filterOrders('shipped')">
            Shipped
            <span class="count">{{ getOrderCountByStatus('shipped') }}</span>
          </button>
          <button 
            class="filter-tab"
            [class.active]="selectedFilter === 'delivered'"
            (click)="filterOrders('delivered')">
            Delivered
            <span class="count">{{ getOrderCountByStatus('delivered') }}</span>
          </button>
          <button 
            class="filter-tab"
            [class.active]="selectedFilter === 'cancelled'"
            (click)="filterOrders('cancelled')">
            Cancelled
            <span class="count">{{ getOrderCountByStatus('cancelled') }}</span>
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your orders...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadOrders()">Try Again</button>
        </div>

        <!-- Orders List -->
        <div *ngIf="!loading && !error" class="orders-list">
          <div class="order-card" *ngFor="let order of filteredOrders; trackBy: trackByOrderId">
            <!-- Order Header -->
            <div class="order-header">
              <div class="order-info">
                <div class="order-id">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>Order #{{ order._id?.slice(-8) || order.orderNumber }}</span>
                </div>
                <div class="order-date">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{{ formatDate(order.createdAt) }}</span>
                </div>
              </div>
              <div class="order-status">
                <span class="status-badge" [ngClass]="getStatusClass(order.orderStatus)">
                  {{ getStatusLabel(order.orderStatus) }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items">
              <div class="order-item" *ngFor="let item of order.items.slice(0, 3)">
                <div class="item-image">
                  <img [src]="getProductImage(item)" [alt]="getProductTitle(item)">
                </div>
                <div class="item-details">
                  <h4>{{ getProductTitle(item) }}</h4>
                  <p class="item-author">{{ getProductAuthor(item) }}</p>
                  <div class="item-meta">
                    <span class="quantity">Qty: {{ item.quantity }}</span>
                    <span class="price">₹{{ item.price.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              <div class="more-items" *ngIf="order.items.length > 3">
                <span>+{{ order.items.length - 3 }} more item(s)</span>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="order-footer">
              <div class="order-total">
                <span class="total-label">Total Amount:</span>
                <span class="total-amount">₹{{ order.pricing.total.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <button class="btn btn-outline btn-sm" [routerLink]="['/orders', order._id]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View Details
                </button>
                <button
                  class="btn btn-secondary btn-sm"
                  *ngIf="order.orderStatus === 'delivered'"
                  (click)="reorderItems(order)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                  </svg>
                  Reorder
                </button>
                <button
                  class="btn btn-outline btn-sm"
                  *ngIf="order.orderStatus === 'pending'"
                  (click)="cancelOrder(order)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Cancel
                </button>
              </div>
            </div>

            <!-- Tracking Info -->
            <div class="tracking-info" *ngIf="order.orderStatus === 'shipped' && order.shipping?.trackingNumber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Tracking: {{ order.shipping.trackingNumber }}</span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !error && filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <h2>No orders found</h2>
          <p class="text-secondary">
            {{ selectedFilter === 'all'
              ? "You haven't placed any orders yet."
              : 'No ' + selectedFilter + ' orders found.' }}
          </p>
          <button class="btn btn-primary btn-lg" routerLink="/products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page {
      min-height: calc(100vh - var(--header-height) - 200px);
      padding: 2rem 0;
      background-color: var(--bg-primary);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .page-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    /* Filter Tabs */
    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .filter-tab {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-weight: 500;
    }

    .filter-tab:hover {
      background-color: var(--bg-tertiary);
      border-color: var(--accent-primary);
    }

    .filter-tab.active {
      background-color: var(--accent-primary);
      border-color: var(--accent-primary);
      color: white;
    }

    .filter-tab .count {
      padding: 0.2rem 0.5rem;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .filter-tab.active .count {
      background-color: rgba(255, 255, 255, 0.3);
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
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
      padding: 3rem 2rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--error);
      color: var(--error);
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .order-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .order-card:hover {
      border-color: var(--accent-primary);
      box-shadow: 0 4px 12px rgba(74, 158, 255, 0.1);
    }

    /* Order Header */
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
    }

    .order-info {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .order-id,
    .order-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .order-id span,
    .order-date span {
      font-weight: 500;
    }

    /* Status Badge */
    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.pending {
      background-color: rgba(255, 152, 0, 0.2);
      color: var(--warning);
      border: 1px solid var(--warning);
    }

    .status-badge.shipped {
      background-color: rgba(74, 158, 255, 0.2);
      color: var(--accent-primary);
      border: 1px solid var(--accent-primary);
    }

    .status-badge.delivered {
      background-color: rgba(76, 175, 80, 0.2);
      color: var(--success);
      border: 1px solid var(--success);
    }

    .status-badge.cancelled {
      background-color: rgba(244, 67, 54, 0.2);
      color: var(--error);
      border: 1px solid var(--error);
    }

    /* Order Items */
    .order-items {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-item {
      display: grid;
      grid-template-columns: 60px 1fr;
      gap: 1rem;
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
    }

    .item-image {
      width: 60px;
      height: 80px;
      border-radius: 4px;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-details h4 {
      font-size: 0.95rem;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .item-author {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0 0 0.5rem 0;
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .quantity {
      padding: 0.2rem 0.5rem;
      background-color: var(--bg-tertiary);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .price {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--accent-primary);
    }

    .more-items {
      text-align: center;
      padding: 0.75rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Order Footer */
    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
    }

    .order-total {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .total-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .total-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-primary);
    }

    .order-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Tracking Info */
    .tracking-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      background-color: rgba(74, 158, 255, 0.1);
      border-top: 1px solid var(--accent-primary);
      color: var(--accent-primary);
      font-size: 0.9rem;
      font-weight: 500;
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }

      .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .order-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .order-actions {
        width: 100%;
      }

      .order-actions .btn {
        flex: 1;
      }

      .filter-tabs {
        flex-wrap: nowrap;
      }
    }

    @media (max-width: 480px) {
      .orders-page {
        padding: 1rem 0;
      }

      .order-card {
        border-radius: 8px;
      }

      .order-header,
      .order-items,
      .order-footer {
        padding: 1rem;
      }

      .order-item {
        grid-template-columns: 50px 1fr;
        gap: 0.75rem;
        padding: 0.75rem;
      }

      .item-image {
        width: 50px;
        height: 70px;
      }

      .total-amount {
        font-size: 1.25rem;
      }

      .order-actions {
        flex-direction: column;
      }

      .order-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  error = '';
  selectedFilter: 'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled' = 'all';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = '';

    this.orderService.getMyOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data;
        this.filterOrders(this.selectedFilter);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        console.error('Orders load error:', err);
      }
    });
  }

  filterOrders(filter: 'all' | 'pending' | 'shipped' | 'delivered' | 'cancelled') {
    this.selectedFilter = filter;
    if (filter === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.orderStatus === filter);
    }
  }

  getOrderCountByStatus(status: string): number {
    return this.orders.filter(order => order.orderStatus === status).length;
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: { [key: string]: string } = {
      'pending': 'Processing',
      'processing': 'Processing',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'returned': 'Returned'
    };
    return labels[status] || status;
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
      month: 'short', 
      day: 'numeric' 
    });
  }

  reorderItems(order: Order) {
    // Add all items from this order to cart
    if (confirm('Add all items from this order to your cart?')) {
      // Implementation would add items to cart
      console.log('Reordering:', order);
    }
  }

  cancelOrder(order: Order) {
    if (confirm('Are you sure you want to cancel this order?')) {
      // Implementation would cancel the order
      console.log('Cancelling order:', order);
    }
  }

  trackByOrderId(index: number, order: Order): string {
    return order._id || index.toString();
  }
}

// Made with Bob
