import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/wishlist`;
  
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  getWishlist(): Observable<{ success: boolean; count: number; data: Product[] }> {
    return this.http.get<{ success: boolean; count: number; data: Product[] }>(this.apiUrl).pipe(
      tap(response => this.wishlistCountSubject.next(response.count))
    );
  }

  addToWishlist(productId: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/${productId}`, {}).pipe(
      tap(() => this.updateWishlistCount())
    );
  }

  removeFromWishlist(productId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.updateWishlistCount())
    );
  }

  isInWishlist(productId: string): Observable<{ success: boolean; inWishlist: boolean }> {
    return this.http.get<{ success: boolean; inWishlist: boolean }>(`${this.apiUrl}/check/${productId}`);
  }

  clearWishlist(): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(this.apiUrl).pipe(
      tap(() => this.wishlistCountSubject.next(0))
    );
  }

  private updateWishlistCount() {
    this.getWishlist().subscribe();
  }
}

// Made with Bob