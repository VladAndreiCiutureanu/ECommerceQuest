import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CheckoutComponent } from './checkout.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

describe('Checkout', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let mockCartService: jasmine.SpyObj<CartService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let router: Router;

  beforeEach(async () => {
    mockCartService = jasmine.createSpyObj('CartService', ['getOrderItems', 'clear']);
    mockOrderService = jasmine.createSpyObj('OrderService', ['checkout']);

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CartService, useValue: mockCartService },
        { provide: OrderService, useValue: mockOrderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.form.valid).toBeFalse();
    expect(component.form.get('shippingAddress')?.hasError('required')).toBeTrue();
  });

  it('should not submit if the form is invalid', () => {
    component.form.setValue({ shippingAddress: '' });
    component.onSubmit();

    expect(mockOrderService.checkout).not.toHaveBeenCalled();
    expect(mockCartService.getOrderItems).not.toHaveBeenCalled();
  });

  it('should call checkout, clear cart, show success message, and navigate after 2 seconds on success', fakeAsync(() => {
    const mockItems = [{ productId: 1, quantity: 2, price: 10 }];
    const mockResponse = { totalAmount: 20 };

    mockCartService.getOrderItems.and.returnValue(mockItems);
    mockOrderService.checkout.and.returnValue(of(mockResponse as any));

    component.form.setValue({ shippingAddress: '123 Main St' });
    component.onSubmit();

    expect(mockCartService.getOrderItems).toHaveBeenCalled();
    expect(mockOrderService.checkout).toHaveBeenCalledWith({
      shippingAddress: '123 Main St',
      items: mockItems
    });


    expect(mockCartService.clear).toHaveBeenCalled();
    expect(component.successMessage()).toBe('Order placed! Total: $20.00');
    
    expect(router.navigate).not.toHaveBeenCalled();

    tick(2000);

    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  }));

  it('should set error message on checkout failure', () => {
    const mockItems = [{ productId: 1, quantity: 2, price: 10 }];
    const errorMessage = 'Insufficient stock';

    mockCartService.getOrderItems.and.returnValue(mockItems);
    mockOrderService.checkout.and.returnValue(throwError(() => ({ error: errorMessage })));

    component.form.setValue({ shippingAddress: '123 Main St' });
    component.onSubmit();

    expect(mockOrderService.checkout).toHaveBeenCalled();
    expect(component.errorMessage()).toContain(errorMessage);
    expect(mockCartService.clear).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
