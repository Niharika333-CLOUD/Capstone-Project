import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  getCart(): Observable<{ success: boolean; data: Cart }> {
    return this.http.get<{ success: boolean; data: Cart }>(this.apiUrl)
      .pipe(
        tap(response => {
          if (response.success) {
            this.cartSubject.next(response.data);
          }
        })
      );
  }

  addToCart(productId: string, quantity: number): Observable<{ success: boolean; message: string; data: Cart }> {
    const request: AddToCartRequest = { productId, quantity };
    return this.http.post<{ success: boolean; message: string; data: Cart }>(`${this.apiUrl}/items`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.cartSubject.next(response.data);
          }
        })
      );
  }

  updateCartItem(productId: string, quantity: number): Observable<{ success: boolean; message: string; data: Cart }> {
    const request: UpdateCartItemRequest = { quantity };
    return this.http.put<{ success: boolean; message: string; data: Cart }>(`${this.apiUrl}/items/${productId}`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.cartSubject.next(response.data);
          }
        })
      );
  }

  removeFromCart(productId: string): Observable<{ success: boolean; message: string; data: Cart }> {
    return this.http.delete<{ success: boolean; message: string; data: Cart }>(`${this.apiUrl}/items/${productId}`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.cartSubject.next(response.data);
          }
        })
      );
  }

  clearCart(): Observable<{ success: boolean; message: string; data: Cart }> {
    return this.http.delete<{ success: boolean; message: string; data: Cart }>(this.apiUrl)
      .pipe(
        tap(response => {
          if (response.success) {
            this.cartSubject.next(response.data);
          }
        })
      );
  }

  getCartCount(): number {
    const cart = this.cartSubject.value;
    return cart ? cart.totalItems : 0;
  }
}

// Made with Bob
