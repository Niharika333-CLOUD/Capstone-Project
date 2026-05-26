import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="wishlist-page">
      <div class="container">
        <div class="page-header">
          <button class="back-button" (click)="goBack()" title="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1 class="page-title">My Wishlist</h1>
          <p class="page-subtitle">{{ wishlistItems.length }} item(s) in your wishlist</p>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadWishlist()">Try Again</button>
        </div>

        <!-- Wishlist Grid -->
        <div *ngIf="!loading && !error && wishlistItems.length > 0" class="wishlist-grid">
          <div class="wishlist-card" *ngFor="let product of wishlistItems; trackBy: trackByProductId">
            <!-- Product Image -->
            <div class="product-image-container">
              <img
                [src]="product.images?.[0]?.url || 'assets/placeholder-book.jpg'"
                [alt]="product.title"
                class="product-image"
                [routerLink]="['/products', product._id]">
              
              <!-- Remove from Wishlist Button -->
              <button 
                class="remove-wishlist-btn"
                (click)="removeFromWishlist(product)"
                title="Remove from wishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>

              <!-- Stock Badge -->
              <div class="stock-badge" *ngIf="product.stock <= 0">
                Out of Stock
              </div>
              <div class="stock-badge low-stock" *ngIf="product.stock > 0 && product.stock < 5">
                Only {{ product.stock }} left
              </div>
            </div>

            <!-- Product Details -->
            <div class="product-details">
              <h3 class="product-title" [routerLink]="['/products', product._id]">
                {{ product.title }}
              </h3>
              <p class="product-author">by {{ product.author }}</p>

              <!-- Rating -->
              <div class="product-rating" *ngIf="product.ratings?.average">
                <div class="stars">
                  <span class="star" *ngFor="let star of [1,2,3,4,5]"
                        [class.filled]="star <= product.ratings.average">★</span>
                </div>
                <span class="rating-count">({{ product.ratings.count || 0 }})</span>
              </div>

              <!-- Price -->
              <div class="product-price">
                <span class="current-price">₹{{ (product.discountPrice || product.price).toFixed(2) }}</span>
                <span class="original-price" *ngIf="product.discountPrice && product.price > product.discountPrice">
                  ₹{{ product.price.toFixed(2) }}
                </span>
                <span class="discount-badge" *ngIf="getDiscountPercentage(product) > 0">
                  {{ getDiscountPercentage(product) }}% OFF
                </span>
              </div>

              <!-- Tags -->
              <div class="product-tags" *ngIf="product.tags && product.tags.length > 0">
                <span class="tag" *ngFor="let tag of product.tags.slice(0, 2)">{{ tag }}</span>
              </div>

              <!-- Actions -->
              <div class="product-actions">
                <button 
                  class="btn btn-primary"
                  (click)="addToCart(product)"
                  [disabled]="product.stock <= 0 || addingToCart[product._id]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!addingToCart[product._id]">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <div class="spinner" *ngIf="addingToCart[product._id]" style="width: 18px; height: 18px; border-width: 2px;"></div>
                  {{ product.stock <= 0 ? 'Out of Stock' : (addingToCart[product._id] ? 'Adding...' : 'Add to Cart') }}
                </button>
                <button 
                  class="btn btn-outline"
                  [routerLink]="['/products', product._id]">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty Wishlist State -->
        <div *ngIf="!loading && !error && wishlistItems.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h2>Your wishlist is empty</h2>
          <p class="text-secondary">Save your favorite books to your wishlist and shop them later.</p>
          <button class="btn btn-primary btn-lg" routerLink="/products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            Browse Books
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page {
      min-height: calc(100vh - var(--header-height) - 200px);
      padding: 2rem 0;
      background-color: var(--bg-primary);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: transparent;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 1rem;
    }

    .back-button:hover {
      background-color: var(--bg-secondary);
      border-color: var(--accent-primary);
      color: var(--accent-primary);
    }

    .back-button svg {
      transition: transform 0.2s ease;
    }

    .back-button:hover svg {
      transform: translateX(-3px);
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

    /* Wishlist Grid */
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
    }

    .wishlist-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .wishlist-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      border-color: var(--accent-primary);
    }

    /* Product Image */
    .product-image-container {
      position: relative;
      width: 100%;
      height: 350px;
      overflow: hidden;
      background-color: var(--bg-secondary);
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .wishlist-card:hover .product-image {
      transform: scale(1.05);
    }

    .remove-wishlist-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(244, 67, 54, 0.9);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .remove-wishlist-btn:hover {
      background-color: var(--error);
      transform: scale(1.1);
    }

    .stock-badge {
      position: absolute;
      bottom: 1rem;
      left: 1rem;
      padding: 0.5rem 1rem;
      background-color: var(--error);
      color: white;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .stock-badge.low-stock {
      background-color: var(--warning);
    }

    /* Product Details */
    .product-details {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .product-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
      cursor: pointer;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-title:hover {
      color: var(--accent-primary);
    }

    .product-author {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
    }

    /* Rating */
    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars {
      display: flex;
      gap: 0.2rem;
    }

    .star {
      color: var(--text-muted);
      font-size: 1rem;
    }

    .star.filled {
      color: var(--star-color);
    }

    .rating-count {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    /* Price */
    .product-price {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .current-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .original-price {
      font-size: 1rem;
      color: var(--text-muted);
      text-decoration: line-through;
    }

    .discount-badge {
      padding: 0.25rem 0.5rem;
      background-color: var(--success);
      color: white;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Tags */
    .product-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.25rem 0.75rem;
      background-color: var(--bg-tertiary);
      border-radius: 12px;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    /* Actions */
    .product-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: auto;
    }

    .product-actions .btn {
      width: 100%;
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
    @media (max-width: 1200px) {
      .wishlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }

      .wishlist-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .product-image-container {
        height: 280px;
      }
    }

    @media (max-width: 480px) {
      .wishlist-page {
        padding: 1rem 0;
      }

      .wishlist-grid {
        grid-template-columns: 1fr;
      }

      .product-image-container {
        height: 350px;
      }

      .product-details {
        padding: 1rem;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private router = inject(Router);

  wishlistItems: Product[] = [];
  loading = false;
  error = '';
  addingToCart: { [key: string]: boolean } = {};

  ngOnInit() {
    this.loadWishlist();
  }

  loadWishlist() {
    this.loading = true;
    this.error = '';

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistItems = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load wishlist. Please try again.';
        this.loading = false;
        console.error('Wishlist load error:', err);
      }
    });
  }

  removeFromWishlist(product: Product) {
    if (!confirm(`Remove "${product.title}" from your wishlist?`)) {
      return;
    }

    this.wishlistService.removeFromWishlist(product._id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item._id !== product._id);
      },
      error: (err) => {
        console.error('Remove from wishlist error:', err);
        alert('Failed to remove item from wishlist. Please try again.');
      }
    });
  }

  addToCart(product: Product) {
    if (product.stock <= 0) {
      return;
    }

    this.addingToCart[product._id] = true;

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        this.addingToCart[product._id] = false;
        // Optionally remove from wishlist after adding to cart
        // this.removeFromWishlist(product);
      },
      error: (err) => {
        this.addingToCart[product._id] = false;
        console.error('Add to cart error:', err);
        alert('Failed to add item to cart. Please try again.');
      }
    });
  }

  getDiscountPercentage(product: Product): number {
    if (!product.discountPrice || product.price <= product.discountPrice) {
      return 0;
    }
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }

  trackByProductId(index: number, product: Product): string {
    return product._id;
  }

  goBack() {
    window.history.back();
  }
}

// Made with Bob
