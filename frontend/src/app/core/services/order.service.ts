import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  createOrder(orderData: CreateOrderRequest): Observable<{ success: boolean; message: string; data: Order }> {
    return this.http.post<{ success: boolean; message: string; data: Order }>(this.apiUrl, orderData);
  }

  getMyOrders(): Observable<{ success: boolean; count: number; data: Order[] }> {
    return this.http.get<{ success: boolean; count: number; data: Order[] }>(this.apiUrl);
  }

  getOrder(orderId: string): Observable<{ success: boolean; data: Order }> {
    return this.http.get<{ success: boolean; data: Order }>(`${this.apiUrl}/${orderId}`);
  }

  updatePaymentStatus(orderId: string, transactionId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/payment`, { transactionId, status });
  }

  cancelOrder(orderId: string, reason: string): Observable<{ success: boolean; message: string; data: Order }> {
    return this.http.put<{ success: boolean; message: string; data: Order }>(`${this.apiUrl}/${orderId}/cancel`, { reason });
  }

  requestReturn(orderId: string, reason: string): Observable<{ success: boolean; message: string; data: Order }> {
    return this.http.put<{ success: boolean; message: string; data: Order }>(`${this.apiUrl}/${orderId}/return`, { reason });
  }

  reorder(orderId: string): Observable<{ success: boolean; message: string; data: any }> {
    return this.http.post<{ success: boolean; message: string; data: any }>(`${this.apiUrl}/${orderId}/reorder`, {});
  }
}

// Made with Bob
