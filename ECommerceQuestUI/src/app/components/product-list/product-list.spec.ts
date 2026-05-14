import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.models';

describe('ProductList', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  
  let mockProductService: any;
  let mockCartService: any;
  let mockNotificationService: any;

  const mockProducts: Product[] = [
    { id: 1, name: 'Smartphone', description: 'Description 1', price: 1500, imageUrl: null },
    { id: 2, name: 'Laptop', description: 'Description 2', price: 4000, imageUrl: 'laptop.jpg' }
  ];

  beforeEach(async () => {
    mockProductService = {
      getAllProducts: jasmine.createSpy('getAllProducts').and.returnValue(of(mockProducts))
    };

    mockCartService = {
      addItem: jasmine.createSpy('addItem')
    };

    mockNotificationService = {
      show: jasmine.createSpy('show')
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve products during ngOnInit and update the DOM accordingly', () => {
    fixture.detectChanges();

    expect(mockProductService.getAllProducts).toHaveBeenCalled();
    expect(component.products().length).toBe(2);

    const productCards = fixture.debugElement.queryAll(By.css('.card'));
    expect(productCards.length).toBe(2);

    const firstCardTitle = productCards[0].query(By.css('.card-title')).nativeElement;
    expect(firstCardTitle.textContent).toContain('Smartphone');
    
    const firstCardPrice = productCards[0].query(By.css('.fw-bold')).nativeElement;

    expect(firstCardPrice.textContent).toContain('$1,500.00'); 
  });

  it('should console.error a message if the async product fetch fails', () => {
    spyOn(console, 'error');
    
    mockProductService.getAllProducts.and.returnValue(throwError(() => new Error('API down')));
    
    fixture.detectChanges();

    expect(component.products().length).toBe(0);
    expect(console.error).toHaveBeenCalledWith('Failed to load products.');
    
    const productCards = fixture.debugElement.queryAll(By.css('.card'));
    expect(productCards.length).toBe(0);
  });

  it('should add the item to the cart and display a success toast upon clicking the \'Add To Cart\' button', () => {
    fixture.detectChanges();
    
    const addToCartBtns = fixture.debugElement.queryAll(By.css('button.btn-primary'));
    
    addToCartBtns[0].nativeElement.click();

    expect(mockCartService.addItem).toHaveBeenCalledWith(mockProducts[0]);
    
    expect(mockNotificationService.show).toHaveBeenCalledWith('Smartphone added to cart');
  });
});
