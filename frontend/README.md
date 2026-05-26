# eCommerce Frontend - Angular Application

This is the Angular frontend for the eCommerce bookstore platform, featuring a modern dark theme UI based on the provided design specifications.

## Features

- **Dark Theme UI**: Modern, sleek dark interface matching the design mockups
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Product Catalog**: Browse books by category, brand, with search and filtering
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Complete purchase with address selection and payment
- **Order Management**: View order history, track orders, cancel within 48 hours
- **User Authentication**: Secure login and registration
- **Personalized Recommendations**: AI-powered product suggestions
- **Gift Points System**: Earn and redeem points on purchases
- **Wishlist**: Save favorite books for later
- **Product Reviews**: Rate and review purchased books

## Technology Stack

- **Framework**: Angular 17 (Standalone Components)
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables for theming
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **State Management**: RxJS with Services
- **Build Tool**: Angular CLI

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── models/
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── cart.model.ts
│   │   │   │   └── order.model.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       ├── product.service.ts
│   │   │       ├── cart.service.ts
│   │   │       └── order.service.ts
│   │   ├── features/
│   │   │   ├── home/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── products/
│   │   │   │   ├── product-list/
│   │   │   │   └── product-detail/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── profile/
│   │   │   └── wishlist/
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   ├── sidebar/
│   │   │   │   ├── product-card/
│   │   │   │   └── loading/
│   │   │   └── pipes/
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   └── environment.ts
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally (if not already installed)**
   ```bash
   npm install -g @angular/cli
   ```

## Configuration

The application uses environment files for configuration:

**`src/environments/environment.ts`**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

For production, create `environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

## Running the Application

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## Key Pages and Features

### 1. Home Page (`/home`)
- Featured books
- Recommended products
- Category navigation
- Search functionality

### 2. Product Catalog (`/products`)
- Category sidebar
- Brand filtering
- Price range filtering
- Sort options (price, rating, newest, popular)
- Pagination
- Product grid with cards

### 3. Product Detail (`/products/:id`)
- Product images
- Detailed information
- Add to cart
- Add to wishlist
- Related products
- Customer reviews
- Rating system

### 4. Shopping Cart (`/cart`)
- Cart items list
- Quantity adjustment
- Remove items
- Price calculation
- Proceed to checkout
- Recommended items based on order history

### 5. Checkout (`/checkout`)
- Shipping address selection/addition
- Order summary
- Gift points redemption
- Coupon code application
- Payment method selection
- Order confirmation

### 6. Payment (`/checkout/payment`)
- Multiple payment options (Card, UPI, Wallet, COD)
- Secure payment form
- Payment confirmation
- Success message

### 7. Orders (`/orders`)
- Order history
- Order status tracking
- Cancel order (within 48 hours)
- Reorder functionality
- Order details

### 8. Profile (`/profile`)
- User information
- Address management
- Password change
- Gift points balance
- Order history

### 9. Wishlist (`/wishlist`)
- Saved products
- Add to cart from wishlist
- Remove from wishlist

## Design System

### Color Palette (Dark Theme)

```css
--bg-primary: #1a1a1a;      /* Main background */
--bg-secondary: #2d2d2d;    /* Secondary background */
--bg-tertiary: #3a3a3a;     /* Tertiary background */
--text-primary: #ffffff;     /* Primary text */
--text-secondary: #b0b0b0;  /* Secondary text */
--text-muted: #808080;      /* Muted text */
--accent-primary: #4a90e2;  /* Primary accent (blue) */
--accent-hover: #357abd;    /* Hover state */
--border-color: #404040;    /* Borders */
--success: #4caf50;         /* Success messages */
--warning: #ff9800;         /* Warnings */
--error: #f44336;           /* Errors */
```

### Typography

- **Font Family**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Font Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Components

- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Product cards, info cards with hover effects
- **Forms**: Styled inputs, selects, textareas
- **Modals**: Overlay with backdrop blur
- **Toasts**: Notification system
- **Badges**: Status indicators

## API Integration

The frontend communicates with the backend API using Angular's HttpClient. All API calls are made through services:

- **AuthService**: Authentication and user management
- **ProductService**: Product catalog and search
- **CartService**: Shopping cart operations
- **OrderService**: Order management

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in localStorage
4. AuthInterceptor adds token to all API requests
5. AuthGuard protects authenticated routes

## State Management

The application uses RxJS and Angular services for state management:

- **BehaviorSubject**: For reactive state updates
- **Signals**: For reactive UI updates (Angular 17+)
- **LocalStorage**: For persisting auth token and user data

## Routing

The application uses Angular Router with lazy loading for optimal performance:

```typescript
{
  path: 'products',
  loadComponent: () => import('./features/products/product-list/product-list.component')
}
```

## Guards

- **authGuard**: Protects routes requiring authentication
- Redirects to login if not authenticated
- Preserves return URL for post-login redirect

## Development Guidelines

### Component Structure

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, FormsModule, ...],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.css']
})
export class ComponentNameComponent {
  // Component logic
}
```

### Service Structure

```typescript
@Injectable({
  providedIn: 'root'
})
export class ServiceName {
  private http = inject(HttpClient);
  
  // Service methods
}
```

## Testing

```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e
```

## Common Issues and Solutions

### Issue 1: CORS Errors

**Solution**: Ensure backend CORS is configured to allow `http://localhost:4200`

### Issue 2: API Connection Failed

**Solution**: 
- Check backend is running on port 5000
- Verify `environment.ts` has correct API URL
- Check network tab in browser DevTools

### Issue 3: Authentication Not Persisting

**Solution**:
- Clear localStorage
- Check token expiration
- Verify JWT_SECRET matches between frontend and backend

## Performance Optimization

- **Lazy Loading**: Routes are lazy loaded
- **OnPush Change Detection**: Used where applicable
- **Image Optimization**: Lazy loading images
- **Bundle Optimization**: Production builds are optimized

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the Applied AI Specialist Capstone Project.

## Support

For issues or questions, join the Slack channel: **#applied-ai-specialist-capstone-project**

---

**Note**: This frontend is designed to work with the Node.js/Express backend API. Ensure the backend is running before starting the frontend application.