import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  isAuthenticated = signal<boolean>(false);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.isAuthenticated.set(true);
      this.currentUserSubject.next(user);
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthSuccess(response);
          }
        })
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success) {
            this.handleAuthSuccess(response);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.isAuthenticated.set(true);
    this.currentUserSubject.next(response.user as any);
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.currentUserSubject.next(response.data);
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
          }
        })
      );
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/profile`, data)
      .pipe(
        tap(() => this.getProfile().subscribe())
      );
  }

  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/password`, data);
  }

  addAddress(address: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/address`, address)
      .pipe(
        tap(() => this.getProfile().subscribe())
      );
  }

  updateAddress(addressId: string, address: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/auth/address/${addressId}`, address)
      .pipe(
        tap(() => this.getProfile().subscribe())
      );
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/auth/address/${addressId}`)
      .pipe(
        tap(() => this.getProfile().subscribe())
      );
  }
}

// Made with Bob
