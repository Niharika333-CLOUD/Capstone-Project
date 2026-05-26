import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="product-list-container"><h1>Product List</h1><p>Product listing page - Implementation in progress</p></div>`,
  styles: [`.product-list-container { padding: 2rem; }`]
})
export class ProductListComponent {}

// Made with Bob
