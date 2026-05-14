import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  
  let mockCartItems = signal<any[]>([]);
  let mockTotal = signal(0);
  
  let mockCartService: any;

  beforeEach(async () => {
    mockCartItems.set([]);
    mockTotal.set(0);

    mockCartService = {
      cartItems: mockCartItems,
      total: mockTotal,
      removeItem: jasmine.createSpy('removeItem')
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an empty state indicator when the cart is empty', () => {
    fixture.detectChanges();

    const alertMessage = fixture.debugElement.query(By.css('.alert-info')).nativeElement;
    expect(alertMessage.textContent).toContain('Your cart is empty.');
    
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeNull();
  });

  it('should display the table and rows corresponding to the cart items', () => {
    mockCartItems.set([
      { product: { id: 1, name: 'T-Shirt', price: 50 }, quantity: 2 },
      { product: { id: 2, name: 'Shorts', price: 100 }, quantity: 1 },
    ]);
    mockTotal.set(200);

    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(tableRows.length).toBe(2);

    const firstRowCols = tableRows[0].queryAll(By.css('td'));
    expect(firstRowCols[0].nativeElement.textContent).toContain('T-Shirt');
    expect(firstRowCols[1].nativeElement.textContent).toContain('$50.00');
    expect(firstRowCols[2].nativeElement.textContent).toContain('2');

    const totalDisplay = fixture.debugElement.query(By.css('h4')).nativeElement;
    expect(totalDisplay.textContent).toContain('$200.00');
  });

  it('Should trigger the delete request upon clicking the \'Remove\' button', () => {
    mockCartItems.set([
      { product: { id: 10, name: 'Smartphone', price: 500 }, quantity: 1 }
    ]);
    fixture.detectChanges();

    const removeBtn = fixture.debugElement.query(By.css('.btn-danger')).nativeElement;
    removeBtn.click();

    expect(mockCartService.removeItem).toHaveBeenCalledWith(10);
  });
});

