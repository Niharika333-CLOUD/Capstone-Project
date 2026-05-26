import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WriterService, Writer } from '../../core/services/writer.service';

@Component({
  selector: 'app-writers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="writers-page">
      <div class="container">
        <!-- Back Button -->
        <button class="back-button" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </button>

        <div class="page-header">
          <h1 class="page-title">{{ isExploring ? 'Explore Writers' : 'My Writers' }}</h1>
          <p class="page-subtitle">{{ isExploring ? 'Discover and follow your favorite authors' : 'Authors you follow' }}</p>
        </div>

        <!-- Toggle View Buttons -->
        <div class="view-toggle">
          <button
            class="toggle-btn"
            [class.active]="!isExploring"
            (click)="showMyWriters()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Writers
          </button>
          <button
            class="toggle-btn"
            [class.active]="isExploring"
            (click)="exploreWriters()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Explore All
          </button>
        </div>

        <!-- Search Bar -->
        <div class="search-section">
          <div class="search-bar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search for authors..."
              [(ngModel)]="searchQuery"
              (input)="onSearchChange()">
            <button class="clear-btn" *ngIf="searchQuery" (click)="clearSearch()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading writers...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="error-message">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="loadWriters()">Try Again</button>
        </div>

        <!-- Writers Grid -->
        <div *ngIf="!loading && !error && writers.length > 0" class="writers-grid">
          <div class="writer-card" *ngFor="let writer of writers; trackBy: trackByWriterId">
            <!-- Writer Photo -->
            <div class="writer-photo">
              <img
                [src]="writer.photo || 'https://via.placeholder.com/400x250?text=' + writer.name"
                [alt]="writer.name"
                class="photo"
                (error)="onImageError($event)">
              <div class="photo-overlay"></div>
            </div>

            <!-- Writer Info -->
            <div class="writer-info">
              <h3 class="writer-name">{{ writer.name }}</h3>
              <p class="writer-bio" *ngIf="writer.bio">{{ writer.bio }}</p>
              
              <!-- Recent Works -->
              <div class="recent-works" *ngIf="writer.recentWorks && writer.recentWorks.length > 0">
                <h4 class="recent-works-title">Recent Works</h4>
                <div class="recent-work" *ngFor="let work of writer.recentWorks.slice(0, 2)">
                  <div class="work-header">
                    <span class="work-title">{{ work.title }}</span>
                    <span class="work-year">({{ work.year }})</span>
                  </div>
                  <p class="work-description">{{ work.description }}</p>
                </div>
              </div>

              <div class="writer-stats">
                <div class="stat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>{{ writer.bookCount }} {{ writer.bookCount === 1 ? 'Book' : 'Books' }}</span>
                </div>
              </div>

              <!-- Follow Button -->
              <button 
                class="btn"
                [class.btn-primary]="!writer.isFollowing"
                [class.btn-outline]="writer.isFollowing"
                (click)="toggleFollow(writer)"
                [disabled]="togglingFollow[writer._id]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" *ngIf="!togglingFollow[writer._id]">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" *ngIf="!writer.isFollowing"></path>
                  <circle cx="8.5" cy="7" r="4" *ngIf="!writer.isFollowing"></circle>
                  <line x1="20" y1="8" x2="20" y2="14" *ngIf="!writer.isFollowing"></line>
                  <line x1="23" y1="11" x2="17" y2="11" *ngIf="!writer.isFollowing"></line>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" *ngIf="writer.isFollowing"></path>
                  <circle cx="8.5" cy="7" r="4" *ngIf="writer.isFollowing"></circle>
                  <polyline points="23 11 20 14 17 11" *ngIf="writer.isFollowing"></polyline>
                  <line x1="20" y1="8" x2="20" y2="14" *ngIf="writer.isFollowing"></line>
                </svg>
                <div class="spinner" *ngIf="togglingFollow[writer._id]" style="width: 18px; height: 18px; border-width: 2px;"></div>
                {{ writer.isFollowing ? 'Following' : 'Follow' }}
              </button>

              <!-- View Books Button -->
              <button class="btn btn-secondary" (click)="viewWriterBooks(writer)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                View Books
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && !error && writers.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2>{{ searchQuery ? 'No writers found' : 'No followed writers' }}</h2>
          <p class="text-secondary">
            {{ searchQuery 
              ? 'Try searching with different keywords.' 
              : 'Start following your favorite authors to see them here.' }}
          </p>
          <button class="btn btn-primary btn-lg" (click)="exploreWriters()" *ngIf="!searchQuery">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            Explore Writers
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .writers-page {
      min-height: calc(100vh - var(--header-height) - 200px);
      padding: 2rem 0;
      background-color: var(--bg-primary);
    }

    /* Back Button */
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 1.5rem;
    }

    .back-button:hover {
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      border-color: var(--accent-primary);
    }

    .back-button svg {
      transition: transform 0.2s ease;
    }

    .back-button:hover svg {
      transform: translateX(-3px);
    }

    /* View Toggle */
    .view-toggle {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 0.5rem;
      background-color: var(--bg-secondary);
      border-radius: 10px;
      border: 1px solid var(--border-color);
      width: fit-content;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toggle-btn:hover {
      color: var(--text-primary);
      background-color: var(--bg-tertiary);
    }

    .toggle-btn.active {
      background-color: var(--accent-primary);
      color: white;
    }

    .toggle-btn svg {
      transition: transform 0.2s ease;
    }

    .toggle-btn:hover svg {
      transform: scale(1.1);
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .page-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    /* Search Section */
    .search-section {
      margin-bottom: 2rem;
    }

    .search-bar {
      position: relative;
      max-width: 600px;
      display: flex;
      align-items: center;
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      gap: 0.75rem;
    }

    .search-bar svg:first-child {
      color: var(--text-muted);
    }

    .search-bar input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 1rem;
      padding: 0;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .clear-btn:hover {
      color: var(--text-primary);
    }

    /* Loading & Error States */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 0;
      gap: 1rem;
    }

    .error-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
      padding: 3rem 2rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--error);
      color: var(--error);
    }

    /* Writers Grid */
    .writers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .writer-card {
      background-color: var(--card-bg);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .writer-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      border-color: var(--accent-primary);
    }

    /* Writer Photo */
    .writer-photo {
      position: relative;
      width: 100%;
      height: 250px;
      overflow: hidden;
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
    }

    .photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .writer-card:hover .photo {
      transform: scale(1.05);
    }

    .photo-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    }

    /* Writer Info */
    .writer-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .writer-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }

    .writer-bio {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Recent Works */
    .recent-works {
      margin: 1rem 0;
      padding: 1rem;
      background-color: var(--bg-secondary);
      border-radius: 8px;
      border: 1px solid var(--border-color);
    }

    .recent-works-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--accent-primary);
      margin: 0 0 0.75rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .recent-work {
      margin-bottom: 0.75rem;
    }

    .recent-work:last-child {
      margin-bottom: 0;
    }

    .work-header {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .work-title {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-primary);
      flex: 1;
    }

    .work-year {
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    .work-description {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .writer-stats {
      display: flex;
      gap: 1.5rem;
      padding: 0.75rem 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }

    .stat {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .stat svg {
      color: var(--accent-primary);
    }

    /* Buttons */
    .writer-info .btn {
      width: 100%;
    }

    .writer-info .btn:last-child {
      margin-top: auto;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background-color: var(--card-bg);
      border-radius: 12px;
      max-width: 600px;
      margin: 2rem auto;
    }

    .empty-icon {
      color: var(--text-muted);
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      margin-bottom: 2rem;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .writers-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 1.5rem;
      }

      .writers-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .writer-photo {
        height: 200px;
      }
    }

    @media (max-width: 480px) {
      .writers-page {
        padding: 1rem 0;
      }

      .writers-grid {
        grid-template-columns: 1fr;
      }

      .writer-photo {
        height: 250px;
      }

      .writer-info {
        padding: 1rem;
      }
    }
  `]
})
export class WritersComponent implements OnInit {
  private writerService = inject(WriterService);
  private router = inject(Router);

  writers: Writer[] = [];
  loading = false;
  error = '';
  searchQuery = '';
  togglingFollow: { [key: string]: boolean } = {};
  isExploring = false;
  private searchTimeout: any;

  ngOnInit() {
    this.loadWriters();
  }

  loadWriters() {
    this.loading = true;
    this.error = '';
    this.isExploring = false;

    this.writerService.getFollowedWriters().subscribe({
      next: (response) => {
        this.writers = response.data;
        console.log('Loaded writers:', this.writers);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load writers. Please try again.';
        this.loading = false;
        console.error('Writers load error:', err);
      }
    });
  }

  showMyWriters() {
    if (!this.isExploring) return;
    this.searchQuery = '';
    this.loadWriters();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    
    if (!this.searchQuery.trim()) {
      this.loadWriters();
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.searchWriters();
    }, 500);
  }

  searchWriters() {
    this.loading = true;
    this.error = '';

    this.writerService.searchWriters(this.searchQuery).subscribe({
      next: (response) => {
        this.writers = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to search writers. Please try again.';
        this.loading = false;
        console.error('Writer search error:', err);
      }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.loadWriters();
  }

  toggleFollow(writer: Writer) {
    this.togglingFollow[writer._id] = true;

    const action = writer.isFollowing 
      ? this.writerService.unfollowWriter(writer._id)
      : this.writerService.followWriter(writer._id);

    action.subscribe({
      next: () => {
        writer.isFollowing = !writer.isFollowing;
        this.togglingFollow[writer._id] = false;
      },
      error: (err) => {
        this.togglingFollow[writer._id] = false;
        console.error('Toggle follow error:', err);
        alert('Failed to update follow status. Please try again.');
      }
    });
  }

  viewWriterBooks(writer: Writer) {
    // Navigate to products page filtered by author
    window.location.href = `/products?author=${encodeURIComponent(writer.name)}`;
  }

  exploreWriters() {
    if (this.isExploring) return;
    
    this.loading = true;
    this.error = '';
    this.searchQuery = '';
    this.isExploring = true;

    this.writerService.getAllWriters().subscribe({
      next: (response) => {
        this.writers = response.data;
        console.log('Explore writers loaded:', this.writers);
        this.writers.forEach(w => console.log(`${w.name}: ${w.photo}`));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load writers. Please try again.';
        this.loading = false;
        console.error('Writers load error:', err);
      }
    });
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x250/1a1a2e/eee?text=Author+Photo';
  }

  trackByWriterId(index: number, writer: Writer): string {
    return writer._id;
  }
}

// Made with Bob