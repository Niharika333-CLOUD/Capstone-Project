import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="logo-section">
          <span class="logo-icon">📚</span>
          <h1>Book Worm</h1>
          <p>Create your account to start your reading journey</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              [(ngModel)]="formData.name"
              name="name"
              placeholder="Enter your full name"
              required>
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="formData.email"
              name="email"
              placeholder="Enter your email"
              required>
          </div>

          <div class="form-group">
            <label for="phone">Phone Number (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              [(ngModel)]="formData.phone"
              name="phone"
              placeholder="Enter your phone number">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="formData.password"
              name="password"
              placeholder="Create a password (min 6 characters)"
              required>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              required>
          </div>

          <div class="terms-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="acceptTerms" name="acceptTerms" required>
              <span>I agree to the Terms & Conditions and Privacy Policy</span>
            </label>
          </div>

          <button type="submit" class="btn-register" [disabled]="loading || !acceptTerms">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <div class="login-link">
            Already have an account? 
            <a routerLink="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-primary);
      padding: 2rem;
    }

    .register-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 3rem;
      width: 100%;
      max-width: 500px;
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
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

    .terms-checkbox {
      margin-top: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      color: var(--text-secondary);
      cursor: pointer;
      font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin-top: 2px;
    }

    .btn-register {
      padding: 1rem;
      background: var(--accent-primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 0.5rem;
    }

    .btn-register:hover:not(:disabled) {
      background: var(--accent-hover);
      transform: translateY(-2px);
    }

    .btn-register:disabled {
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

    .login-link {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .login-link a {
      color: var(--accent-primary);
      text-decoration: none;
      font-weight: 600;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .register-card {
        padding: 2rem;
      }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };

  confirmPassword = '';
  acceptTerms = false;
  loading = false;
  errorMessage = '';

  onSubmit() {
    // Validate passwords match
    if (this.formData.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Validate password length
    if (this.formData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}

// Made with Bob
