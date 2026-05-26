import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="profile-container"><h1>My Profile</h1><p>User profile page - Implementation in progress</p></div>`,
  styles: [`.profile-container { padding: 2rem; }`]
})
export class ProfileComponent {}

// Made with Bob
