import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.models';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: () => {
        console.error('Failed to load products.');
      }
    });
  }

  addToCart(product: Product): void{
    this.cartService.addItem(product);
    this.notificationService.show(`${product.name} added to cart`);
  }
}
