
# Book Worm E-Bookstore - Frontend Technical Specification

## 1. Executive Summary

This document provides a comprehensive technical specification for implementing the "Book Worm" e-bookstore frontend using Angular 17. The application features a dark-themed, modern UI with complete e-commerce functionality including product browsing, cart management, checkout, and order tracking.

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
AppComponent (Root)
├── SharedModule
│   ├── HeaderComponent (Navigation Bar)
│   ├── FooterComponent
│   ├── SidebarComponent (Category Navigation)
│   ├── SearchBarComponent
│   ├── LoadingSpinnerComponent
│   ├── ErrorMessageComponent
│   └── ModalComponent (Generic Modal)
│
├── FeaturesModule
│   ├── AuthModule
│   │   ├── LoginComponent
│   │   └── RegisterComponent
│   │
│   ├── HomeModule
│   │   ├── HomeComponent
│   │   ├── HeroSectionComponent
│   │   ├── RecommendedBooksComponent
│   │   ├── BestsellersComponent
│   │   └── NewLaunchesComponent
│   │
│   ├── ProductsModule
│   │   ├── ProductListComponent (Catalogue)
│   │   ├── ProductCardComponent
│   │   ├── ProductDetailComponent
│   │   ├── ProductFiltersComponent
│   │   ├── ProductReviewsComponent
│   │   ├── ReviewFormComponent
│   │   └── RelatedProductsComponent
│   │
│   ├── CartModule
│   │   ├── CartComponent
│   │   ├── CartItemComponent
│   │   └── CartSummaryComponent
│   │
│   ├── CheckoutModule
│   │   ├── CheckoutComponent
│   │   ├── AddressFormComponent
│   │   ├── AddressListComponent
│   │   ├── PaymentMethodComponent
│   │   ├── OrderSummaryComponent
│   │   └── OrderConfirmationModalComponent
│   │
│   ├── OrdersModule
│   │   ├── OrderListComponent (My Orders)
│   │   ├── OrderCardComponent
│   │   └── OrderDetailComponent
│   │
│   ├── WishlistModule
│   │   ├── WishlistComponent
│   │   └── WishlistItemComponent
│   │
│   └── ProfileModule
│       ├── ProfileComponent
│       ├── ProfileInfoComponent
│       ├── AddressManagementComponent
│       └── PasswordChangeComponent
│
└── CoreModule
    ├── Services
    ├── Guards
    ├── Interceptors
    └── Models
```

### 2.2 New Components to Create

#### 2.2.1 Shared Components

**HeaderComponent** (`shared/header/header.component.ts`)
- **Purpose**: Top navigation bar with logo, menu items, cart icon, user menu
- **Inputs**: `cartItemCount: number`, `isAuthenticated: boolean`, `userName: string`
- **Outputs**: `logout: EventEmitter<void>`
- **Features**:
  - Book Worm logo (clickable, routes to home)
  - Navigation links: My Orders, My Wishlist, My Writers
  - Cart icon with badge showing item count
  - User dropdown menu (Profile, Logout)
  - Responsive mobile menu

**SidebarComponent** (`shared/sidebar/sidebar.component.ts`)
- **Purpose**: Category navigation sidebar
- **Inputs**: `categories: Category[]`, `selectedCategory: string`
- **Outputs**: `categorySelected: EventEmitter<string>`
- **Features**:
  - Collapsible on mobile
  - Active category highlighting
  - "All" option to clear filters
  - Smooth scroll behavior

**SearchBarComponent** (`shared/search-bar/search-bar.component.ts`)
- **Purpose**: Advanced search with filters
- **Inputs**: `initialFilters: ProductFilters`
- **Outputs**: `search: EventEmitter<ProductFilters>`
- **Features**:
  - Text search input
  - Language dropdown
  - Format filter (Paperback/eBook)
  - Price range slider
  - Sort by dropdown (Price, Rating, Newest, Popular)
  - Clear filters button

**ProductCardComponent** (`shared/product-card/product-card.component.ts`)
- **Purpose**: Reusable book card display
- **Inputs**: `product: Product`, `showAddToCart: boolean`
- **Outputs**: `addToCart: EventEmitter<Product>`, `addToWishlist: EventEmitter<Product>`
- **Features**:
  - Book cover image with lazy loading
  - Title, author, format badge
  - Price display (with discount if applicable)
  - Star rating display
  - Delivery date estimate
  - Add to Cart button
  - Wishlist heart icon
  - Hover effects

**ModalComponent** (`shared/modal/modal.component.ts`)
- **Purpose**: Generic modal wrapper
- **Inputs**: `isOpen: boolean`, `title: string`, `size: 'sm' | 'md' | 'lg'`
- **Outputs**: `close: EventEmitter<void>`
- **Features**:
  - Backdrop click to close
  - ESC key to close
  - Content projection with ng-content
  - Animation transitions

#### 2.2.2 Feature Components

**HeroSectionComponent** (`features/home/hero-section/hero-section.component.ts`)
- **Purpose**: Landing page hero banner
- **Features**:
  - Featured book carousel
  - Call-to-action buttons
  - Auto-play with manual controls

**RecommendedBooksComponent** (`features/home/recommended-books/recommended-books.component.ts`)
- **Purpose**: Personalized recommendations section
- **Features**:
  - Horizontal scrollable book list
  - "See All" link to filtered catalogue
  - Loading skeleton

**BestsellersComponent** (`features/home/bestsellers/bestsellers.component.ts`)
- **Purpose**: Bestsellers this month section
- **Features**:
  - Grid layout of top books
  - Ranking badges
  - Quick view on hover

**NewLaunchesComponent** (`features/home/new-launches/new-launches.component.ts`)
- **Purpose**: Recently added books section
- **Features**:
  - Grid layout
  - "New" badges
  - Release date display

**ProductFiltersComponent** (`features/products/product-filters/product-filters.component.ts`)
- **Purpose**: Advanced filtering sidebar for catalogue
- **Inputs**: `brands: string[]`, `categories: Category[]`, `priceRange: {min: number, max: number}`
- **Outputs**: `filtersChanged: EventEmitter<ProductFilters>`
- **Features**:
  - Category checkboxes
  - Brand checkboxes with search
  - Price range slider
  - Format radio buttons
  - Language dropdown
  - Apply/Reset buttons

**ProductReviewsComponent** (`features/products/product-reviews/product-reviews.component.ts`)
- **Purpose**: Display product reviews
- **Inputs**: `reviews: ProductReview[]`, `averageRating: number`, `totalReviews: number`
- **Outputs**: `loadMore: EventEmitter<void>`
- **Features**:
  - Rating distribution chart
  - Review cards with user info
  - Pagination
  - Sort by (Most Recent, Highest Rating, Lowest Rating)

**ReviewFormComponent** (`features/products/review-form/review-form.component.ts`)
- **Purpose**: Submit product review
- **Inputs**: `productId: string`
- **Outputs**: `reviewSubmitted: EventEmitter<void>`
- **Features**:
  - Star rating selector
  - Comment textarea
  - Form validation
  - Submit button with loading state

**RelatedProductsComponent** (`features/products/related-products/related-products.component.ts`)
- **Purpose**: Show related/similar books
- **Inputs**: `products: Product[]`, `title: string`
- **Features**:
  - Vertical scrollable list
  - Compact product cards
  - Quick add to cart

**CartItemComponent** (`features/cart/cart-item/cart-item.component.ts`)
- **Purpose**: Individual cart item row
- **Inputs**: `item: CartItem`
- **Outputs**: `quantityChanged: EventEmitter<{productId: string, quantity: number}>`, `removed: EventEmitter<string>`
- **Features**:
  - Book thumbnail
  - Title, author, format
  - Quantity controls (+/- buttons)
  - Price calculation
  - Remove button

**CartSummaryComponent** (`features/cart/cart-summary/cart-summary.component.ts`)
- **Purpose**: Cart totals and checkout button
- **Inputs**: `subtotal: number`, `tax: number`, `shipping: number`, `discount: number`, `total: number`
- **Outputs**: `checkout: EventEmitter<void>`
- **Features**:
  - Itemized price breakdown
  - Coupon code input
  - Gift points redemption
  - Proceed to Checkout button

**AddressFormComponent** (`features/checkout/address-form/address-form.component.ts`)
- **Purpose**: Shipping address input form
- **Inputs**: `address: Address | null`
- **Outputs**: `addressSubmitted: EventEmitter<Address>`
- **Features**:
  - Reactive form with validation
  - Address type selector (Home/Work/Other)
  - Set as default checkbox
  - Auto-complete suggestions (optional)

**AddressListComponent** (`features/checkout/address-list/address-list.component.ts`)
- **Purpose**: Select from saved addresses
- **Inputs**: `addresses: Address[]`, `selectedAddressId: string`
- **Outputs**: `addressSelected: EventEmitter<string>`, `addNew: EventEmitter<void>`
- **Features**:
  - Radio button selection
  - Address cards with edit/delete
  - Add new address button

**PaymentMethodComponent** (`features/checkout/payment-method/payment-method.component.ts`)
- **Purpose**: Payment method selection
- **Inputs**: `methods: PaymentMethod[]`
- **Outputs**: `methodSelected: EventEmitter<PaymentMethod>`
- **Features**:
  - Credit Card option with form
  - Debit Card option with form
  - UPI option with ID input
  - Wallet option with balance display
  - Payment method icons

**OrderConfirmationModalComponent** (`features/checkout/order-confirmation-modal/order-confirmation-modal.component.ts`)
- **Purpose**: Success message after order placement
- **Inputs**: `order: Order`
- **Outputs**: `close: EventEmitter<void>`, `viewOrder: EventEmitter<string>`
- **Features**:
  - Success icon/animation
  - Order number display
  - Purchased items summary
  - View Order Details button
  - Continue Shopping button

**OrderCardComponent** (`features/orders/order-card/order-card.component.ts`)
- **Purpose**: Order summary card in order list
- **Inputs**: `order: Order`
- **Outputs**: `viewDetails: EventEmitter<string>`, `reorder: EventEmitter<string>`, `cancel: EventEmitter<string>`
- **Features**:
  - Order number and date
  - Status badge with color coding
  - Items preview (first 2-3 items)
  - Total amount
  - Action buttons (View, Reorder, Cancel)

**WishlistItemComponent** (`features/wishlist/wishlist-item/wishlist-item.component.ts`)
- **Purpose**: Individual wishlist item
- **Inputs**: `product: Product`
- **Outputs**: `addToCart: EventEmitter<string>`, `remove: EventEmitter<string>`
- **Features**:
  - Product card layout
  - Stock status indicator
  - Add to Cart button
  - Remove from Wishlist button

---

## 3. Routing Structure

### 3.1 Route Definitions

```typescript
// app.routes.ts (Enhanced)
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Book Worm - Your Online Bookstore'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login - Book Worm'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Register - Book Worm'
  },
  {
    path: 'catalogue',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Browse Books - Book Worm'
  },
  {
    path: 'catalogue/category/:categoryId',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Browse by Category - Book Worm'
  },
  {
    path: 'catalogue/brand/:brand',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
    title: 'Browse by Publisher - Book Worm'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Book Details - Book Worm'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
    title: 'Shopping Cart - Book Worm'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Checkout - Book Worm'
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent),
    canActivate: [authGuard],
    title: 'My Orders - Book Worm'
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard],
    title: 'Order Details - Book Worm'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent),
    canActivate: [authGuard],
    title: 'My Wishlist - Book Worm'
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'My Profile - Book Worm'
  },
  {
    path: 'writers',
    loadComponent: () => import('./features/writers/writers.component').then(m => m.WritersComponent),
    canActivate: [authGuard],
    title: 'My Writers - Book Worm'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
```

### 3.2 Route Guards

**authGuard** (Existing)
- Protects authenticated routes
- Redirects to login if not authenticated
- Stores intended URL for post-login redirect

**cartGuard** (New)
- Ensures cart has items before checkout
- Redirects to cart if empty

---

## 4. Data Models

### 4.1 Enhanced/New TypeScript Interfaces

```typescript
// core/models/ui.model.ts (New)

export interface PaymentMethod {
  type: 'card' | 'upi' | 'wallet';
  label: string;
  icon: string;
}

export interface Address {
  _id?: string;
  addressType: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  giftPointsUsed: number;
  total: number;
}

export interface FilterOptions {
  categories: Category[];
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  languages: string[];
  formats: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

export interface ToastMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}
```

```typescript
// core/models/writer.model.ts (New)

export interface Writer {
  _id: string;
  name: string;
  bio?: string;
  image?: string;
  books: Product[] | string[];
  followers: number;
  isFollowing: boolean;
}
```

### 4.2 Existing Models (Reference)

- **Product** - Already defined in `product.model.ts`
- **User** - Already defined in `user.model.ts`
- **Order** - Already defined in `order.model.ts`
- **Cart** - Already defined in `cart.model.ts`

---

## 5. Service Architecture

### 5.1 Existing Services (To be Enhanced)

**AuthService** (`core/services/auth.service.ts`)
- Add methods:
  - `addAddress(address: Address): Observable<any>`
  - `updateAddress(addressId: string, address: Address): Observable<any>`
  - `deleteAddress(addressId: string): Observable<any>`
  - `getAddresses(): Observable<Address[]>`

**ProductService** (`core/services/product.service.ts`)
- Add methods:
  - `getCategories(): Observable<Category[]>`
  - `searchProducts(query: string, filters: ProductFilters): Observable<ProductListResponse>`

**CartService** (`core/services/cart.service.ts`)
- Add methods:
  - `getCartSummary(): Observable<CartSummary>`
  - `applyCoupon(code: string): Observable<any>`
  - `applyGiftPoints(points: number): Observable<any>`

**OrderService** (`core/services/order.service.ts`)
- Add methods:
  - `calculateShipping(address: Address): Observable<number>`
  - `validateCoupon(code: string): Observable<{valid: boolean, discount: number}>`

### 5.2 New Services to Create

**WishlistService** (`core/services/wishlist.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;
  
  getWishlist(): Observable<Product[]>
  addToWishlist(productId: string): Observable<any>
  removeFromWishlist(productId: string): Observable<any>
  isInWishlist(productId: string): Observable<boolean>
  clearWishlist(): Observable<any>
}
```

**WriterService** (`core/services/writer.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class WriterService {
  private apiUrl = `${environment.apiUrl}/writers`;
  
  getFollowedWriters(): Observable<Writer[]>
  followWriter(writerId: string): Observable<any>
  unfollowWriter(writerId: string): Observable<any>
  getWriterBooks(writerId: string): Observable<Product[]>
  searchWriters(query: string): Observable<Writer[]>
}
```

**CategoryService** (`core/services/category.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;
  
  getAllCategories(): Observable<Category[]>
  getCategoryById(id: string): Observable<Category>
  getCategoryBySlug(slug: string): Observable<Category>
}
```

**ToastService** (`core/services/toast.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage>();
  toast$ = this.toastSubject.asObservable();
  
  success(message: string, duration?: number): void
  error(message: string, duration?: number): void
  warning(message: string, duration?: number): void
  info(message: string, duration?: number): void
}
```

**ThemeService** (`core/services/theme.service.ts`)
```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private currentTheme = new BehaviorSubject<'light' | 'dark'>('dark');
  theme$ = this.currentTheme.asObservable();
  
  setTheme(theme: 'light' | 'dark'): void
  toggleTheme(): void
  getCurrentTheme(): 'light' | 'dark'
}
```

---

## 6. UI/UX Specifications

### 6.1 Color Scheme (Dark Theme)

```css
/* CSS Variables - styles.css */
:root {
  /* Primary Colors */
  --primary-bg: #1a1a1a;           /* Main background */
  --secondary-bg: #2d2d2d;         /* Card/component background */
  --tertiary-bg: #3a3a3a;          /* Hover states */
  
  /* Text Colors */
  --text-primary: #ffffff;         /* Primary text */
  --text-secondary: #b3b3b3;       /* Secondary text */
  --text-muted: #808080;           /* Muted text */
  
  /* Accent Colors */
  --accent-primary: #ff6b35;       /* Primary CTA buttons */
  --accent-secondary: #4ecdc4;     /* Secondary actions */
  --accent-success: #2ecc71;       /* Success states */
  --accent-warning: #f39c12;       /* Warning states */
  --accent-error: #e74c3c;         /* Error states */
  --accent-info: #3498db;          /* Info states */
  
  /* Border Colors */
  --border-light: #404040;
  --border-medium: #505050;
  --border-dark: #606060;
  
  /* Shadow */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  --gradient-secondary: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  
  /* Rating Star */
  --star-filled: #ffd700;
  --star-empty: #404040;
}
```

### 6.2 Typography

```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-secondary: 'Merriweather', Georgia, serif;  /* For book titles */

/* Font Sizes */
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### 6.3 Spacing System

```css
/* Spacing Scale (rem) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 6.4 Responsive Breakpoints

```css
/* Breakpoints */
--breakpoint-xs: 0px;
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 992px;
--breakpoint-xl: 1200px;
--breakpoint-xxl: 1400px;
```

### 6.5 Component-Specific Styles

#### Header Component
```css
.header {
  height: 70px;
  background: var(--secondary-bg);
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-md);
}

.logo {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--accent-primary);
}

.nav-link {
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--text-primary);
}

.cart-badge {
  background: var(--accent-primary);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  font-size: var(--text-xs);
}
```

#### Sidebar Component
```css
.sidebar {
  width: 250px;
  background: var(--secondary-bg);
  height: calc(100vh - 70px);
  position: sticky;
  top: 70px;
  overflow-y: auto;
  border-right: 1px solid var(--border-light);
}

.category-item {
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background 0.2s ease;
}

.category-item:hover {
  background: var(--tertiary-bg);
}

.category-item.active {
  background: var(--accent-primary);
  color: white;
  font-weight: var(--font-semibold);
}
```

#### Product Card
```css
.product-card {
  background: var(--secondary-bg);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-light);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.product-image {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.product-title {
  font-family: var(--font-secondary);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.product-author {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.product-price {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--accent-primary);
}

.product-price-original {
  text-decoration: line-through;
  color: var(--text-muted);
  font-size: var(--text-base);
  margin-left: var(--space-2);
}
```

#### Button Styles
```css
.btn {
  padding: var(--space-3) var(--space-6);
  border-radius: 6px;
  font-weight: var(--font-semibold);
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: var(--text-base);
}

.btn-primary {
  background: var(--accent-primary);
  color: white;
}

.btn-primary:hover {
  background: #ff5722;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--accent-secondary);
  color: white;
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--accent-primary);
  color: var(--accent-primary);
}

.btn-outline:hover {
  background: var(--accent-primary);
  color: white;
}

.btn-icon {
  padding: var(--space-2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### Form Styles
```css
.form-group {
  margin-bottom: var(--space-5);
}

.form-label {
  display: block;
  margin-bottom: var(--space-2);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
  font-size: var(--text-sm);
}

.form-control {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  background: var(--tertiary-bg);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-control.error {
  border-color: var(--accent-error);
}

.form-error {
  color: var(--accent-error);
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}
```

#### Rating Stars
```css
.rating-stars {
  display: flex;
  gap: var(--space-1);
}

.star {
  color: var(--star-empty);
  font-size: var(--text-lg);
}

.star.filled {
  color: var(--star-filled);
}

.star.half {
  background: linear-gradient(90deg, var(--star-filled) 50%, var(--star-empty) 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 6.6 Animation & Transitions

```css
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Slide In Animation */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Loading Spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
}

/* Skeleton Loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--secondary-bg) 0%,
    var(--tertiary-bg) 50%,
    var(--secondary-bg) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## 7. Feature Implementation Plan

### 7.1 Phase 1: Core Infrastructure (Week 1)

#### Tasks:
1. **Setup Shared Components**
   - Create HeaderComponent with navigation
   - Create SidebarComponent with category list
   - Create FooterComponent
   - Create LoadingSpinnerComponent
   - Create ErrorMessageComponent
   - Create ModalComponent

2. **Setup Services**
   - Enhance existing services with new methods
   - Create WishlistService
   - Create WriterService
   - Create CategoryService
   - Create ToastService
   - Create ThemeService

3. **Setup Global Styles**
   - Define CSS variables for dark theme
   - Create utility classes
   - Setup responsive breakpoints
   - Create animation keyframes

4. **Setup State Management**
   - Create CartStateService (BehaviorSubject-based)
   - Create WishlistStateService
   - Create UserStateService

**Dependencies**: None
**Estimated Time**: 5-7 days

### 7.2 Phase 2: Home Page (Week 2)

#### Tasks:
1. **Home Component Structure**
   - Implement HeroSectionComponent with carousel
   - Implement RecommendedBooksComponent
   - Implement BestsellersComponent
   - Implement NewLaunchesComponent

2. **Product Card Component**
   - Create reusable ProductCardComponent
   - Implement lazy loading for images
   - Add hover effects and animations
   - Implement Add to Cart functionality
   - Implement Add to Wishlist functionality

3. **Integration**
   - Connect to ProductService
   - Implement data fetching
   - Add loading states
   - Add error handling

**Dependencies**: Phase 1
**Estimated Time**: 5-7 days

### 7.3 Phase 3: Catalogue/Product List (Week 3)

#### Tasks:
1. **Product List Component**
   - Implement grid layout
   - Add pagination
   - Add sorting functionality
   - Implement infinite scroll (optional)

2. **Search & Filters**
   - Create SearchBarComponent
   - Create ProductFiltersComponent
   - Implement filter logic
   - Add URL query parameter sync

3. **Category Navigation**
   - Integrate SidebarComponent
   - Implement category filtering
   - Add breadcrumb navigation
   - Handle route parameters

**Dependencies**: Phase 1, Phase 2
**Estimated Time**: 5-7 days

### 7.4 Phase 4: Product Detail Page (Week 4)

#### Tasks:
1. **Product Detail Layout**
   - Create product detail template
   - Implement image gallery/zoom
   - Display product information
   - Show specifications

2. **Reviews Section**
   - Create ProductReviewsComponent
   - Create ReviewFormComponent
   - Implement review submission
   - Add rating distribution chart

3. **Related Products**
   - Create RelatedProductsComponent
   - Implement sidebar layout
   - Add quick add to cart

4. **Actions**
   - Implement Add to Cart
   - Implement Add to Wishlist
   - Add quantity selector
   - Show delivery estimate

**Dependencies**: Phase 1, Phase 2
**Estimated Time**: 5-7 days

### 7.5 Phase 5: Shopping Cart (Week 5)

#### Tasks:
1. **Cart Component**
   - Create cart item list
   - Create CartItemComponent
   - Implement quantity controls
   - Add remove functionality

2. **Cart Summary**
   - Create CartSummaryComponent
   - Display price breakdown
   - Add coupon code input
   - Add gift points redemption

3. **Cart State Management**
   - Implement cart synchronization
   - Add optimistic updates
   - Handle stock validation
   - Add empty cart state

**Dependencies**: Phase 1, Phase 2
**Estimated Time**: 4-5 days

### 7.6 Phase 6: Checkout & Payment (Week 6)

#### Tasks:
1. **Checkout Component**
   - Create multi-step checkout flow
   - Implement progress indicator
   - Add form validation

2. **Address Management**
   - Create AddressFormComponent
   - Create AddressListComponent
   - Implement address selection
   - Add new address functionality

3. **Payment Method**
   - Create PaymentMethodComponent
   - Implement payment method selection
   - Add payment form validation
   - Create mock payment processing

4. **Order Summary**
   - Create OrderSummaryComponent
   - Display final pricing
   - Show selected address
   - Add place order button

5. **Order Confirmation**
   - Create OrderConfirmationModalComponent
   - Display success message
   - Show order details
   - Add navigation options

**Dependencies**: Phase 1, Phase 5
**Estimated Time**: 7-10 days

### 7.7 Phase 7: Orders & Profile (Week 7)

#### Tasks:
1. **Order List**
   - Create OrderListComponent
   - Create OrderCardComponent
   - Implement order filtering
   - Add status badges

2. **Order Detail**
   - Create OrderDetailComponent
   - Display order timeline
   - Show tracking information
   - Add cancel/return options

3. **Profile Management**
   - Create ProfileComponent
   - Implement profile editing
   - Add password change
   - Manage addresses

4. **Wishlist**
   - Create WishlistComponent
   - Create WishlistItemComponent
   - Implement remove functionality
   - Add move to cart option

**Dependencies**: Phase 1, Phase 2
**Estimated Time**: 5-7 days

### 7.8 Phase 8: Additional Features (Week 8)

#### Tasks:
1. **My Writers Feature**
   - Create WritersComponent
   - Implement follow/unfollow
   - Display writer's books
   - Add writer search

2. **Toast Notifications**
   - Create ToastComponent
   - Integrate ToastService
   - Add success/error messages
   - Implement auto-dismiss

3. **Responsive Design**
   - Optimize for mobile
   - Add mobile menu
   - Adjust layouts for tablets
   - Test across devices

4. **Performance Optimization**
   - Implement lazy loading
   - Add image optimization
   - Optimize bundle size
   - Add caching strategies

**Dependencies**: All previous phases
**Estimated Time**: 5-7 days

### 7.9 Phase 9: Testing & Polish (Week 9)

#### Tasks:
1. **Testing**
   - Write unit tests for services
   - Write component tests
   - Perform integration testing
   - Test user flows

2. **Accessibility**
   - Add ARIA labels
   - Ensure keyboard navigation
   - Test with screen readers
   - Fix contrast issues

3. **Bug Fixes**
   - Fix identified bugs
   - Handle edge cases
   - Improve error messages
   - Optimize loading states

4. **Documentation**
   - Update component documentation
   - Create user guide
   - Document API integration
   - Add inline code comments

**Dependencies**: All previous phases
**Estimated Time**: 5-7 days

---

## 8. State Management Strategy

### 8.1 Service-Based State Management

Using RxJS BehaviorSubjects for lightweight state management:

```typescript
// core/services/cart-state.service.ts
@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartSubject = new BehaviorSubject<CartSummary | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  cart$ = this.cartSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  
  updateCart(cart: CartSummary): void {
    this.cartSubject.next(cart);
  }
  
  getCartSnapshot(): CartSummary | null {
    return this.cartSubject.value;
  }
  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
```

### 8.2 State to Manage

1. **User State**
   - Authentication status
   - User profile
   - Addresses
   - Gift points balance

2. **Cart State**
   - Cart items
   - Cart summary
   - Applied coupons
   - Gift points used

3. **Wishlist State**
   - Wishlist items
   - Item count

4. **UI State**
   - Loading states
   - Error messages
   - Toast notifications
   - Modal visibility
   - Sidebar collapsed state

5. **Filter State**
   - Active filters
   - Search query
   - Sort option
   - Current page

---

## 9. API Integration Points

### 9.1 Existing Endpoints (Reference)

All endpoints are documented in [`docs/API.md`](docs/API.md:1)

### 9.2 Additional Endpoints Needed

**Wishlist Endpoints** (Backend needs to implement)
```
GET    /api/wishlist              - Get user's wishlist
POST   /api/wishlist/:productId   - Add to wishlist
DELETE /api/wishlist/:productId   - Remove from wishlist
```

**Writer Endpoints** (Backend needs to implement)
```
GET    /api/writers                - Get followed writers
POST   /api/writers/:id/follow     - Follow writer
DELETE /api/writers/:id/follow     - Unfollow writer
GET    /api/writers/:id/books      - Get writer's books
GET    /api/writers/search         - Search writers
```

**Category Endpoints** (Backend needs to implement)
```
GET    /api/categories             - Get all categories
GET    /api/categories/:id         - Get category by ID
GET    /api/categories/slug/:slug  - Get category by slug
```

---

## 10. Performance Considerations

### 10.1 Optimization Strategies

1. **Lazy Loading**
   - Use Angular's lazy loading for routes
   - Implement image lazy loading
   - Load components on demand

2. **Change Detection**
   - Use OnPush change detection strategy
   - Avoid unnecessary re-renders
   - Use trackBy in *ngFor loops

3. **Bundle Optimization**
   - Code splitting by routes
   - Tree shaking unused code
   - Minimize third-party dependencies

4. **Caching**
   - Cache API responses
   - Use HTTP interceptor for caching
   - Implement service worker (PWA)

5. **Image Optimization**
   - Use WebP format with fallbacks
   - Implement responsive images
   - Add loading="lazy" attribute
   - Use CDN for static assets

### 10.2 Performance Metrics

Target metrics:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

## 11. Accessibility Requirements

### 11.1 WCAG 2.1 Level AA Compliance

1. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Visible focus indicators
   - Logical tab order

2. **Screen Reader Support**
   - Semantic HTML elements
   - ARIA labels and roles
   - Alt text for images
   - Descriptive link text

3. **Color Contrast**
   - Minimum 4.5:1 for normal text
   - Minimum 3:1 for large text
   - Don't rely on color alone

4. **Form Accessibility**
   - Label associations
   - Error messages
   - Required field indicators
   - Helpful instructions

### 11.2 Accessibility Testing

- Use axe DevTools
- Test with NVDA/JAWS screen readers
- Keyboard-only navigation testing
- Color contrast validation

---

## 12. Security Considerations

### 12.1 Frontend Security

1. **XSS Prevention**
   - Angular's built-in sanitization
   - Avoid innerHTML with user content
   - Validate all inputs

2. **CSRF Protection**
   - Use HTTP-only cookies
   - Implement CSRF tokens
   - Validate origin headers

3. **Authentication**
   - Secure token storage
   - Token expiration handling
   - Automatic logout on inactivity

4. **Data Validation**
   - Client-side validation
   - Server-side validation (primary)
   - Sanitize user inputs

### 12.2 Best Practices

- Use HTTPS only
- Implement Content Security Policy
- Regular dependency updates
- Security audit before deployment

---

## 13. Testing Strategy

### 13.1 Unit Testing

**Tools**: Jasmine, Karma

**Coverage Goals**:
- Services: 80%+
- Components: 70%+
- Utilities: 90%+

**Test Examples**:
```typescript
// product.service.spec.ts
describe('ProductService', () => {
  it('should fetch products with filters', () => {
    // Test implementation
  });
  
  it('should handle API errors gracefully', () => {
