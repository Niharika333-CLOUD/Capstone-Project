import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="order-detail-container"><h1>Order Details</h1><p>Order detail page - Implementation in progress</p></div>`,
  styles: [`.order-detail-container { padding: 2rem; }`]
})
export class OrderDetailComponent {}

// Made with Bob
