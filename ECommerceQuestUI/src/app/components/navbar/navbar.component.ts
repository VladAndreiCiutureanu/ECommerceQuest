import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    protected authService: AuthService,
    protected cartService: CartService,
    private router: Router
  ){}

  logout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
