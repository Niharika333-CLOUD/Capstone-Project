import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  Product, 
  ProductFilters, 
  ProductListResponse,
  Category 
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(filters?: ProductFilters): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(this.apiUrl, { params: filters as any });
  }

  getProduct(id: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: string, page = 1, limit = 12): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/category/${categoryId}`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getProductsByBrand(brand: string, page = 1, limit = 12): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/brand/${brand}`, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getFeaturedProducts(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.http.get<{ success: boolean; count: number; data: Product[] }>(`${this.apiUrl}/featured`);
  }

  getRecommendations(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.http.get<{ success: boolean; count: number; data: Product[] }>(`${this.apiUrl}/user/recommendations`);
  }

  addReview(productId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/reviews`, { rating, comment });
  }

  getAllBrands(): Observable<{ success: boolean; count: number; data: string[] }> {
    return this.http.get<{ success: boolean; count: number; data: string[] }>(`${this.apiUrl}/brands`);
  }
}

// Made with Bob
