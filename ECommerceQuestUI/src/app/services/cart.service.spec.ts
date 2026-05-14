import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { Product } from '../models/product.models';

describe('CartService', () => {
  let service: CartService;

  const mockProduct1: Product = {
    id: 1,
    name: 'Smartphone',
    description: 'Versatile Device',
    price: 1500,
    imageUrl: null
  };

  const mockProduct2: Product = {
    id: 2,
    name: 'Laptop',
    description: 'Gaming Laptop',
    price: 4000,
    imageUrl: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should start with an absolutely empty cart', () => {
    expect(service.cartItems().length).toBe(0);
    expect(service.total()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });

  it('should correctly add a new product to the cart', () => {
    service.addItem(mockProduct1);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(1);

    expect(service.total()).toBe(1500);
    expect(service.itemCount()).toBe(1);
  });

  it('should increase quantity by +1 if the product is already in the cart', () => {
    service.addItem(mockProduct1);
    service.addItem(mockProduct1);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.total()).toBe(3000);
    expect(service.itemCount()).toBe(2);
  });

  it('should correctly calculate totals for multiple products', () => {
    service.addItem(mockProduct1);
    service.addItem(mockProduct2);

    expect(service.cartItems().length).toBe(2);
    expect(service.total()).toBe(5500);
    expect(service.itemCount()).toBe(2);
  });

  it('should completely remove a product from the cart using its ID', () => {
    service.addItem(mockProduct1);
    service.addItem(mockProduct2);
    
    service.removeItem(1);

    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe(2);
    expect(service.total()).toBe(4000);
  });

  it('Should correctly map cart items for the backend (getOrderItems)', () => {
    service.addItem(mockProduct1);
    service.addItem(mockProduct1);
    service.addItem(mockProduct2);

    const orderItems = service.getOrderItems();

    expect(orderItems.length).toBe(2);
    expect(orderItems[0]).toEqual({ productId: 1, quantity: 2 });
    expect(orderItems[1]).toEqual({ productId: 2, quantity: 1 });
  });

  it('should completely empty the cart', () => {
    service.addItem(mockProduct1);
    service.addItem(mockProduct2);

    service.clear();

    expect(service.cartItems().length).toBe(0);
    expect(service.total()).toBe(0);
    expect(service.itemCount()).toBe(0);
  });
});

