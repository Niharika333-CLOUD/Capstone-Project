import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `<div class="checkout-container"><h1>Checkout</h1><p>Checkout page - Implementation in progress</p></div>`,
  styles: [`.checkout-container { padding: 2rem; }`]
})
export class CheckoutComponent {}

// Made with Bob
