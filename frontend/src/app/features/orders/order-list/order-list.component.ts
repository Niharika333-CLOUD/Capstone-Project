import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="order-list-container"><h1>My Orders</h1><p>Order history page - Implementation in progress</p></div>`,
  styles: [`.order-list-container { padding: 2rem; }`]
})
export class OrderListComponent {}

// Made with Bob
