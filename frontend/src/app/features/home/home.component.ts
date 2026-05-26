import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="home-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <span class="icon">📚</span>
            <span class="brand">Book Worm</span>
          </div>
          <nav class="nav-links">
            <a routerLink="/orders">My Orders</a>
            <a routerLink="/wishlist">My Wishlist</a>
            <a routerLink="/profile">My Writers</a>
          </nav>
        </div>
        <div class="header-right">
          <div class="search-bar">
            <input type="text" placeholder="Search you want to read here" [(ngModel)]="searchQuery">
            <button (click)="search()">🔍</button>
          </div>
          <select class="filter-select">
            <option>Language</option>
            <option>English</option>
            <option>Hindi</option>
          </select>
          <select class="filter-select">
            <option>Format (Paperback, ebook etc)</option>
            <option>Paperback</option>
            <option>eBook</option>
          </select>
          <select class="filter-select">
            <option>Price Range</option>
            <option>Under ₹500</option>
            <option>₹500-₹1000</option>
          </select>
          <select class="filter-select">
            <option>Sort by: Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Rating</option>
          </select>
          <a routerLink="/cart" class="cart-icon">
            🛒
            <span class="badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
          </a>
          <a routerLink="/profile" class="user-icon">👤</a>
        </div>
      </header>

      <div class="main-content">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="category-list">
            <div class="category-item" 
                 [class.active]="selectedCategory === 'all'"
                 (click)="selectCategory('all')">
              All
            </div>
            <div class="category-item" 
                 *ngFor="let category of categories"
                 [class.active]="selectedCategory === category"
                 (click)="selectCategory(category)">
              {{ category }}
            </div>
          </div>
        </aside>

        <!-- Content Area -->
        <main class="content">
          <!-- Recommended Section -->
          <section class="product-section">
            <h2>Recommended for You</h2>
            <div class="product-grid">
              <div class="product-card" *ngFor="let product of recommendedProducts">
                <img [src]="product.images?.[0]?.url || 'assets/placeholder.jpg'"
                     [alt]="product.title"
                     class="product-image">
                <div class="product-info">
                  <h3 class="product-title">{{ product.title }}</h3>
                  <p class="product-author">by {{ product.author }}</p>
                  <p class="product-description">{{ product.description | slice:0:100 }}...</p>
                  <p class="product-format">Paperback</p>
                  <p class="product-tags">Non-fiction, Self Help</p>
                  <div class="product-footer">
                    <span class="product-price">₹{{ product.price }}</span>
                    <span class="delivery-info">Delivery by Mon, 23 Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Bestsellers Section -->
          <section class="product-section">
            <h2>Bestsellers this Month</h2>
            <div class="product-grid">
              <div class="product-card" *ngFor="let product of bestsellers">
                <img [src]="product.images?.[0]?.url || 'assets/placeholder.jpg'"
                     [alt]="product.title"
                     class="product-image">
                <div class="product-info">
                  <h3 class="product-title">{{ product.title }}</h3>
                  <p class="product-author">by {{ product.author }}</p>
                  <p class="product-description">{{ product.description | slice:0:100 }}...</p>
                  <p class="product-format">Paperback</p>
                  <p class="product-tags">Fiction, Thriller, Horror</p>
                  <div class="product-footer">
                    <span class="product-price">₹{{ product.price }}</span>
                    <span class="delivery-info">Delivery by Mon, 23 Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- New Launches Section -->
          <section class="product-section">
            <h2>New Launches</h2>
            <div class="product-grid">
              <div class="product-card" *ngFor="let product of newLaunches">
                <img [src]="product.images?.[0]?.url || 'assets/placeholder.jpg'"
                     [alt]="product.title"
                     class="product-image">
                <div class="product-info">
                  <h3 class="product-title">{{ product.title }}</h3>
                  <p class="product-author">by {{ product.author }}</p>
                  <p class="product-description">{{ product.description | slice:0:100 }}...</p>
                  <p class="product-format">Paperback</p>
                  <p class="product-tags">Non-fiction, Self Help</p>
                  <div class="product-footer">
                    <span class="product-price">₹{{ product.price }}</span>
                    <span class="delivery-info">Delivery by Mon, 23 Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .header {
      background: var(--sidebar-bg);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 3rem;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .icon {
      font-size: 1.5rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-links a:hover {
      color: var(--text-primary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-bar {
      display: flex;
      background: var(--bg-tertiary);
      border-radius: 6px;
      overflow: hidden;
    }

    .search-bar input {
      background: transparent;
      border: none;
      padding: 0.5rem 1rem;
      color: var(--text-primary);
      width: 300px;
    }

    .search-bar button {
      background: transparent;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
    }

    .filter-select {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 0.5rem;
      border-radius: 6px;
    }

    .cart-icon, .user-icon {
      font-size: 1.5rem;
      position: relative;
      cursor: pointer;
    }

    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--error);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }

    .main-content {
      display: flex;
    }

    .sidebar {
      width: 250px;
      background: var(--sidebar-bg);
      min-height: calc(100vh - 70px);
      padding: 2rem 1rem;
      border-right: 1px solid var(--border-color);
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      padding: 0.75rem 1rem;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.3s;
      color: var(--text-secondary);
    }

    .category-item:hover {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    .category-item.active {
      background: var(--accent-primary);
      color: white;
    }

    .content {
      flex: 1;
      padding: 2rem;
    }

    .product-section {
      margin-bottom: 3rem;
    }

    .product-section h2 {
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      background: var(--card-bg);
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s;
      cursor: pointer;
    }

    .product-card:hover {
      transform: translateY(-4px);
    }

    .product-image {
      width: 100%;
      height: 350px;
      object-fit: cover;
    }

    .product-info {
      padding: 1rem;
    }

    .product-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .product-author {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .product-description {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-bottom: 0.5rem;
    }

    .product-format {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin-bottom: 0.25rem;
    }

    .product-tags {
      color: var(--accent-primary);
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .product-price {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .delivery-info {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  searchQuery = '';
  cartCount = 0;
  selectedCategory = 'all';
  
  categories = [
    'Romance', 'Mystery', 'Science Fiction', 'Fantasy', 'Historical',
    'Self-help', 'Memoir', 'Travel', 'Horror', "Children's", 'Young Adult',
    'Comics & Graphic Novels', 'Poetry', 'Drama', 'Science', 'Philosophy',
    'Religion', 'Language Learning'
  ];

  recommendedProducts: Product[] = [];
  bestsellers: Product[] = [];
  newLaunches: Product[] = [];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    // Load recommended products
    this.productService.getRecommendations().subscribe({
      next: (response: any) => this.recommendedProducts = response.data || [],
      error: (error: any) => console.error('Error loading recommendations:', error)
    });

    // Load bestsellers
    this.productService.getProducts({ sort: 'popular', limit: 6 }).subscribe({
      next: (response: any) => this.bestsellers = response.data || [],
      error: (error: any) => console.error('Error loading bestsellers:', error)
    });

    // Load new launches
    this.productService.getProducts({ sort: 'newest', limit: 6 }).subscribe({
      next: (response: any) => this.newLaunches = response.data || [],
      error: (error: any) => console.error('Error loading new launches:', error)
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Load products for selected category
  }

  search() {
    // Implement search
  }
}

// Made with Bob
