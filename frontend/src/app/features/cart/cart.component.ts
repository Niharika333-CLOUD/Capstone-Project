import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      <div class="cart-content" *ngIf="cart">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cart.items">
            <img [src]="getProductImage(item)" alt="Product" class="item-image">
            <div class="item-details">
              <h3>{{ getProductTitle(item) }}</h3>
              <p class="item-price">₹{{ item.price }}</p>
              <div class="quantity-controls">
                <button (click)="decreaseQuantity(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="increaseQuantity(item)">+</button>
              </div>
            </div>
            <button class="remove-btn" (click)="removeItem(item)">Remove</button>
          </div>
        </div>
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>₹{{ cart.totalPrice }}</span>
          </div>
          <div class="summary-row">
            <span>Tax:</span>
            <span>₹{{ calculateTax() }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>₹{{ calculateTotal() }}</span>
          </div>
          <button class="checkout-btn" routerLink="/checkout">Proceed to Checkout</button>
        </div>
      </div>
      <div *ngIf="!cart || cart.items.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <button routerLink="/products">Continue Shopping</button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    .cart-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: var(--card-bg);
      border-radius: 8px;
      margin-bottom: 1rem;
    }
    .item-image {
      width: 100px;
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }
    .cart-summary {
      background: var(--card-bg);
      padding: 1.5rem;
      border-radius: 8px;
      height: fit-content;
    }
    .checkout-btn {
      width: 100%;
      padding: 1rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-top: 1rem;
    }
  `]
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  cart: Cart | null = null;

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(response => {
      this.cart = response.data;
    });
  }

  getProductImage(item: any): string {
    return item.product?.images?.[0]?.url || 'assets/placeholder.jpg';
  }

  getProductTitle(item: any): string {
    return item.product?.title || 'Product';
  }

  increaseQuantity(item: any) {
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    this.cartService.updateCartItem(productId, item.quantity + 1).subscribe(() => this.loadCart());
  }

  decreaseQuantity(item: any) {
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    if (item.quantity > 1) {
      this.cartService.updateCartItem(productId, item.quantity - 1).subscribe(() => this.loadCart());
    }
  }

  removeItem(item: any) {
    const productId = typeof item.product === 'string' ? item.product : item.product._id;
    this.cartService.removeFromCart(productId).subscribe(() => this.loadCart());
  }

  calculateTax(): number {
    return this.cart ? this.cart.totalPrice * 0.1 : 0;
  }

  calculateTotal(): number {
    return this.cart ? this.cart.totalPrice + this.calculateTax() : 0;
  }
}

// Made with Bob
