import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, LayoutComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = true;
  error: string | null = null;
  
  selectedImageIndex = 0;
  quantity = 1;
  
  // Review form
  reviewForm: FormGroup;
  showReviewForm = false;
  submittingReview = false;

  constructor() {
    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(productId: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(productId).subscribe({
      next: (response) => {
        this.product = response.data;
        this.loading = false;
        
        // Load related products
        if (this.product.relatedProducts && this.product.relatedProducts.length > 0) {
          this.loadRelatedProducts();
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product details. Please try again.';
        this.loading = false;
      }
    });
  }

  loadRelatedProducts(): void {
    if (!this.product) return;
    
    const categoryId = typeof this.product.category === 'string' 
      ? this.product.category 
      : this.product.category._id;

    this.productService.getProductsByCategory(categoryId, 1, 4).subscribe({
      next: (response) => {
        this.relatedProducts = response.data.filter(p => p._id !== this.product?._id);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    this.cartService.addToCart(this.product._id, this.quantity).subscribe({
      next: (response) => {
        console.log('Added to cart:', response);
        // Show success message
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        // Show error message
      }
    });
  }

  addToWishlist(): void {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    
    this.wishlistService.addToWishlist(this.product._id).subscribe({
      next: (response) => {
        console.log('Added to wishlist:', response);
        alert('Product added to wishlist successfully!');
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Failed to add product to wishlist. Please try again.');
        }
      }
    });
  }

  buyNow(): void {
    if (!this.product) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }

    this.addToCart();
    this.router.navigate(['/cart']);
  }

  toggleReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.showReviewForm = !this.showReviewForm;
  }

  submitReview(): void {
    if (this.reviewForm.invalid || !this.product) return;

    this.submittingReview = true;
    const { rating, comment } = this.reviewForm.value;

    this.productService.addReview(this.product._id, rating, comment).subscribe({
      next: (response) => {
        console.log('Review submitted:', response);
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.showReviewForm = false;
        this.submittingReview = false;
        // Reload product to show new review
        this.loadProduct(this.product!._id);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.submittingReview = false;
      }
    });
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }

  getDeliveryDate(): string {
    if (!this.product) return '';
    
    const today = new Date();
    const deliveryDays = this.product.deliveryTime?.max || 7;
    const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    };
    
    return deliveryDate.toLocaleDateString('en-US', options);
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
    window.scrollTo(0, 0);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  getUserName(user: any): string {
    if (typeof user === 'string') return 'Anonymous';
    return user?.name || 'Anonymous';
  }
}

// Made with Bob
