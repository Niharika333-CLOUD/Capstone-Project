import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  recommendedProducts: Product[] = [];
  bestsellers: Product[] = [];
  newLaunches: Product[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Load recommended products
    this.productService.getRecommendations().subscribe({
      next: (response) => {
        this.recommendedProducts = response.data || [];
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
        // Fallback to featured products
        this.loadFeaturedProducts();
      }
    });

    // Load bestsellers (popular products)
    this.productService.getProducts({ sort: 'popular', limit: 8 }).subscribe({
      next: (response) => {
        this.bestsellers = response.data || [];
      },
      error: (error) => {
        console.error('Error loading bestsellers:', error);
      }
    });

    // Load new launches
    this.productService.getProducts({ sort: 'newest', limit: 8 }).subscribe({
      next: (response) => {
        this.newLaunches = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading new launches:', error);
        this.loading = false;
      }
    });
  }

  loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (response) => {
        this.recommendedProducts = response.data || [];
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
      }
    });
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    
    this.cartService.addToCart(product._id, 1).subscribe({
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

  getDeliveryDate(product: Product): string {
    const today = new Date();
    const deliveryDays = product.deliveryTime?.max || 7;
    const deliveryDate = new Date(today.setDate(today.getDate() + deliveryDays));
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    };
    
    return deliveryDate.toLocaleDateString('en-US', options);
  }

  getStarArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => index < Math.round(rating));
  }
}

// Made with Bob
