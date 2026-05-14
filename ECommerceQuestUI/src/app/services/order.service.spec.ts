import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { CheckoutRequest, OrderResponse } from '../models/order.models';
import { environment } from '../../environments/environment';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  const mockCheckoutRequest: CheckoutRequest = {
    shippingAddress: 'Test Road, 123',
    items: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
  };

  const mockOrderResponse: OrderResponse = {
    orderId: 1001,
    totalAmount: 5500,
    orderDate: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should submit a new order (checkout) via a POST request to the proper endpoint', () => {
    const expectedUrl = `${environment.apiUrl}/orders/checkout`;

    service.checkout(mockCheckoutRequest).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.orderId).toBe(1001);
      expect(response.totalAmount).toBe(5500);
      expect(response).toEqual(mockOrderResponse);
    });


    const req = httpMock.expectOne(expectedUrl);

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(mockCheckoutRequest);

    req.flush(mockOrderResponse);
  });
});

