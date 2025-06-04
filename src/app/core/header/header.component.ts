import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';

  showDropdown = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  onSearch() {
    const term = this.searchTerm.trim();
    if (term) {
      // Navega a /search?q=term
      this.router.navigate(['/search'], { queryParams: { q: term } });
      this.searchTerm = '';
    }
  }
}

