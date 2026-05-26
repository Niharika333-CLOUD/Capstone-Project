import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../core/models/product.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories: Category[] = [];
  selectedCategory: string | null = null;
  isCollapsed = false;

  ngOnInit(): void {
    this.loadCategories();
    
    // Listen to route changes to update selected category
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || null;
    });
  }

  loadCategories(): void {
    this.http.get<{ success: boolean; data: Category[] }>(`${environment.apiUrl}/products/categories`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.categories = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  selectCategory(categoryId: string | null): void {
    this.selectedCategory = categoryId;
    
    if (categoryId) {
      this.router.navigate(['/products'], { 
        queryParams: { category: categoryId } 
      });
    } else {
      this.router.navigate(['/products']);
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

// Made with Bob
