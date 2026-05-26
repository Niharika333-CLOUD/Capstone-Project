import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="wishlist-container"><h1>My Wishlist</h1><p>Wishlist page - Implementation in progress</p></div>`,
  styles: [`.wishlist-container { padding: 2rem; }`]
})
export class WishlistComponent {}

// Made with Bob
