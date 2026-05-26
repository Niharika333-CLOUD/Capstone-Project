# Frontend Implementation Guide

This document provides a comprehensive guide for implementing the Angular frontend based on the UI screenshots provided.

## Overview

The frontend is built using **Angular 17** with standalone components, featuring a modern dark theme UI that matches the design specifications from the screenshots.

## Completed Implementation

### ✅ Core Infrastructure

1. **Angular Project Setup**
   - Angular 17 with standalone components
   - TypeScript configuration
   - Build and development configurations
   - Environment setup

2. **Routing System**
   - Lazy-loaded routes for optimal performance
   - Auth guard for protected routes
   - Route configuration for all pages

3. **State Management**
   - RxJS-based services
   - Angular Signals for reactive UI
   - LocalStorage for persistence

4. **HTTP Communication**
   - HttpClient setup
   - Auth interceptor for JWT tokens
   - API service layer

5. **Models & Interfaces**
   - User model with authentication
   - Product model with full specifications
   - Cart model with items
   - Order model with complete workflow

6. **Services**
   - AuthService (authentication & user management)
   - ProductService (catalog & search)
   - CartService (shopping cart operations)
   - OrderService (order management)

7. **Guards & Interceptors**
   - Auth guard for route protection
   - HTTP interceptor for token injection

8. **Styling System**
   - Dark theme with CSS variables
   - Responsive design utilities
   - Component styling guidelines
   - Global styles and utilities

## UI Components to Implement

Based on the screenshots, here are the key components that need to be created:

### 1. Layout Components

#### Header Component
**Location**: `src/app/shared/components/header/`

**Features**:
- Logo and branding ("Book Worm")
- Navigation menu (My Orders, My Wishlist, My Writers)
- Search bar with icon
- Language selector dropdown
- Format selector (Paperback, ebook, etc.)
- Price range filter
- Sort by dropdown
- Shopping cart icon with badge
- User profile icon

**Screenshot Reference**: All screenshots show the header

#### Sidebar Component
**Location**: `src/app/shared/components/sidebar/`

**Features**:
- Category list (All, Romance, Mystery, Science Fiction, Fantasy, Historical, Self-help, Memoir, Travel, Horror, Children's, Young Adult, Comics & Graphic Novels, Poetry, Drama, Science, Philosophy, Religion, Language Learning)
- Active category highlighting
- Collapsible on mobile

**Screenshot Reference**: Left sidebar in catalog pages

### 2. Home Page Components

#### Home Component
**Location**: `src/app/features/home/`

**Sections**:
1. **Recommended for You**
   - Product cards in grid layout
   - Book cover images
   - Title, author, format
   - Price with delivery date
   - "Non-fiction, Self Help" tags

2. **Bestsellers this Month**
   - Similar card layout
   - Different products

3. **New Launches**
   - Latest books section
   - Same card design

**Screenshot Reference**: First two screenshots

### 3. Product Components

#### Product Card Component
**Location**: `src/app/shared/components/product-card/`

**Features**:
- Book cover image
- Title (clickable)
- Author name (clickable)
- Description preview
- Format (Paperback/eBook)
- Price (₹)
- Delivery date
- Hover effects

**Design**:
```css
.product-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
}
```

#### Product Detail Component
**Location**: `src/app/features/products/product-detail/`

**Features**:
- Large book cover image
- Full description
- Author bio section
- Reviews section with star ratings
- "Add to Cart" button
- "Add to Wishlist" button
- Language selector
- Rating display (stars + count)
- Price and delivery info
- Related Reads sidebar

**Screenshot Reference**: Third screenshot (Product Detail/Cart page)

### 4. Cart & Checkout Components

#### Cart Component
**Location**: `src/app/features/cart/`

**Features**:
- Cart items list with:
  - Book cover thumbnail
  - Title and author
  - Price
  - Quantity selector (+/-)
  - Remove button
- Related Reads sidebar
- Breadcrumb navigation
- Continue shopping button

**Screenshot Reference**: Third screenshot

#### Checkout Component
**Location**: `src/app/features/checkout/`

**Features**:
1. **Shopping Cart Summary**
   - Items with quantity controls
   - Subtotal calculation

2. **Address Section**
   - "Use Saved Address" checkbox
   - Form fields:
     - First Name, Last Name
     - Email
     - Address Line 2
     - City, Pin, Phone Number
     - State, Country

3. **Grand Total Section**
   - Price breakdown
   - Tax calculation
   - Delivery charges
   - Discount
   - Total amount
   - "Apply" button for discounts
   - "Pay Now" button

**Screenshot Reference**: Fourth screenshot

#### Payment Component
**Location**: `src/app/features/checkout/payment/`

**Features**:
- Payment method tabs:
  - Credit Card
  - Debit Card
  - UPI
  - Wallet
- Card form fields:
  - Card Number
  - CVV
  - Date of Expiry
  - Name on Card
- "Pay Now" button
- Decorative background with book illustrations

**Screenshot Reference**: Fifth screenshot

#### Order Confirmation Component
**Location**: `src/app/features/checkout/confirmation/`

**Features**:
- Success checkmark icon
- "Your purchase of the following reads is successful" message
- Purchased items display
- "Continue your Shopping" button
- Same decorative background

**Screenshot Reference**: Sixth screenshot

### 5. Additional Components

#### Loading Spinner
**Location**: `src/app/shared/components/loading/`

#### Toast Notification
**Location**: `src/app/shared/components/toast/`

#### Modal Dialog
**Location**: `src/app/shared/components/modal/`

## Styling Guidelines

### Color Scheme (Dark Theme)

```css
:root {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-tertiary: #3a3a3a;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --text-muted: #808080;
  --accent-primary: #4a90e2;
  --accent-hover: #357abd;
  --border-color: #404040;
  --success: #4caf50;
  --card-bg: #252525;
  --sidebar-bg: #1e1e1e;
}
```

### Typography

- **Font**: Inter (already loaded in index.html)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Use rem units for scalability

### Component Patterns

#### Product Grid
```html
<div class="product-grid">
  <app-product-card *ngFor="let product of products" [product]="product" />
</div>
```

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}
```

#### Button Styles
```css
.btn-primary {
  background: var(--accent-primary);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}
```

## Implementation Priority

### Phase 1: Core Pages (Week 1)
1. ✅ Project setup and configuration
2. ✅ Models and services
3. ✅ Routing and guards
4. 🔄 Header component
5. 🔄 Sidebar component
6. 🔄 Home page with product grid

### Phase 2: Product Features (Week 2)
1. 🔄 Product list page
2. 🔄 Product detail page
3. 🔄 Product card component
4. 🔄 Search and filter functionality

### Phase 3: Cart & Checkout (Week 3)
1. 🔄 Shopping cart page
2. 🔄 Checkout flow
3. 🔄 Payment page
4. 🔄 Order confirmation

### Phase 4: User Features (Week 4)
1. 🔄 Login/Register pages
2. 🔄 User profile
3. 🔄 Order history
4. 🔄 Wishlist

### Phase 5: Polish & Testing (Week 5)
1. 🔄 Responsive design
2. 🔄 Loading states
3. 🔄 Error handling
4. 🔄 Testing
5. 🔄 Performance optimization

## Next Steps

To complete the frontend implementation:

1. **Create Component Files**
   ```bash
   ng generate component features/home
   ng generate component features/auth/login
   ng generate component features/auth/register
   ng generate component features/products/product-list
   ng generate component features/products/product-detail
   ng generate component features/cart
   ng generate component features/checkout
   ng generate component shared/components/header
   ng generate component shared/components/sidebar
   ng generate component shared/components/product-card
   ```

2. **Implement Services**
   - Complete ProductService
   - Complete CartService
   - Complete OrderService

3. **Build Components**
   - Follow the design from screenshots
   - Use the styling system
   - Implement responsive behavior

4. **Connect to Backend**
   - Test all API endpoints
   - Handle loading states
   - Implement error handling

5. **Test & Refine**
   - Cross-browser testing
   - Mobile responsiveness
   - Performance optimization

## API Integration Examples

### Fetching Products
```typescript
this.productService.getProducts({ 
  category: 'fiction',
  sort: 'popular',
  page: 1,
  limit: 12
}).subscribe(response => {
  this.products = response.data;
});
```

### Adding to Cart
```typescript
this.cartService.addToCart(productId, quantity).subscribe(
  response => {
    this.showToast('Added to cart successfully');
  },
  error => {
    this.showToast('Failed to add to cart', 'error');
  }
);
```

### Placing Order
```typescript
this.orderService.createOrder({
  shippingAddress: this.selectedAddress,
  paymentMethod: 'card',
  useGiftPoints: this.giftPointsToUse
}).subscribe(
  response => {
    this.router.navigate(['/checkout/payment'], {
      queryParams: { orderId: response.data._id }
    });
  }
);
```

## Resources

- **Angular Documentation**: https://angular.io/docs
- **RxJS Documentation**: https://rxjs.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

## Support

For implementation questions or issues:
- Review the backend API documentation in `docs/API.md`
- Check the setup guide in `SETUP_GUIDE.md`
- Join the Slack channel: #applied-ai-specialist-capstone-project

---

**Status**: Core infrastructure complete. Component implementation in progress.