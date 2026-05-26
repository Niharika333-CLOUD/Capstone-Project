import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <span class="logo-icon">📚</span>
          <h1>Book Worm</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="credentials.email"
              name="email"
              placeholder="Enter your email"
              required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="credentials.password"
              name="password"
              placeholder="Enter your password"
              required>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" class="btn-login" [disabled]="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="signup-link">
            Don't have an account? 
            <a routerLink="/register">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      padding: 2rem;
    }

    .login-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 3rem;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }

    .logo-section {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    .logo-section h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    .logo-section p {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.95rem;
    }

    .form-group input {
      padding: 0.875rem 1rem;
      background: var(--bg-tertiary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--accent-primary);
      background: var(--bg-secondary);
    }

    .form-group input::placeholder {
      color: var(--text-muted);
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .forgot-link {
      color: var(--accent-primary);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn-login {
      padding: 1rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-login:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-2px);
    }

    .btn-login:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      padding: 0.875rem;
      background: rgba(244, 67, 54, 0.1);
      border: 1px solid var(--error);
      border-radius: 8px;
      color: var(--error);
      text-align: center;
      font-size: 0.9rem;
    }

    .signup-link {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .signup-link a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .signup-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  rememberMe = false;
  loading = false;
  errorMessage = '';

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }
}

// Made with Bob
