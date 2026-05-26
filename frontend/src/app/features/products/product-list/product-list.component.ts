import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../../shared/components/layout/layout.component';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product, ProductFilters } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  loading = true;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;
  pageSize = 12;

  // Filters
  filters: ProductFilters = {
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    sort: undefined,
    page: 1,
    limit: 12
  };

  // Filter Options
  languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];
  formats = ['Paperback', 'Hardcover', 'eBook', 'Audiobook'];
  priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
    { label: 'Above ₹2000', min: 2000, max: undefined }
  ];
  sortOptions = [
    { label: 'Relevance', value: '' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Newest', value: 'newest' },
    { label: 'Popular', value: 'popular' }
  ];

  selectedLanguage = '';
  selectedFormat = '';
  selectedPriceRange: any = null;

  ngOnInit(): void {
    // Subscribe to query params
    this.route.queryParams.subscribe(params => {
      this.filters.search = params['search'] || '';
      this.filters.category = params['category'] || '';
      this.filters.sort = params['sort'] || 'relevance';
      this.currentPage = parseInt(params['page']) || 1;
      this.filters.page = this.currentPage;
      
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts(this.filters).subscribe({
      next: (response) => {
        this.products = response.data;
        this.totalProducts = response.total;
        this.totalPages = response.pages;
        this.currentPage = response.page;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.error = 'Failed to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 1;
    this.updateQueryParams();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  onLanguageChange(): void {
    // Apply language filter logic
    this.applyFilters();
  }

  onFormatChange(): void {
    // Apply format filter logic
    this.applyFilters();
  }

  onPriceRangeChange(range: any): void {
    this.selectedPriceRange = range;
    this.filters.minPrice = range.min;
    this.filters.maxPrice = range.max;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: this.filters.category, // Keep category filter
      minPrice: undefined,
      maxPrice: undefined,
      sort: undefined,
      page: 1,
      limit: 12
    };
    this.selectedLanguage = '';
    this.selectedFormat = '';
    this.selectedPriceRange = null;
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    const queryParams: any = {};
    
    if (this.filters.search) queryParams.search = this.filters.search;
    if (this.filters.category) queryParams.category = this.filters.category;
    if (this.filters.sort) queryParams.sort = this.filters.sort;
    if (this.filters.page && this.filters.page > 1) queryParams.page = this.filters.page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.updateQueryParams();
    }
  }

  viewProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    
    this.cartService.addToCart(product._id, 1).subscribe({
      next: (response) => {
        console.log('Added to cart:', response);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
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

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }
}

// Made with Bob
