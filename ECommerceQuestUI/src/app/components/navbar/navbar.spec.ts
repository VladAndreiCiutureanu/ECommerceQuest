import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

describe('Navbar', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  const mockIsLoggedIn = signal(false);
  const mockFullName = signal<string | null>(null);
  const mockItemCount = signal(0);

  let mockAuthService = {
    isLoggedIn: mockIsLoggedIn,
    fullName: mockFullName,
    logout: jasmine.createSpy('logout')
  };

  let mockCartService = {
    itemCount: mockItemCount
  };

  beforeEach(async () => {
    mockIsLoggedIn.set(false);
    mockFullName.set(null);
    mockItemCount.set(0);
    mockAuthService.logout.calls.reset();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: CartService, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the Login and Register buttons for unauthenticated users', () => {
    mockIsLoggedIn.set(false);
    fixture.detectChanges();

    const htmlElement: HTMLElement = fixture.nativeElement;
    
    expect(htmlElement.textContent).toContain('Login');
    expect(htmlElement.textContent).toContain('Register');
    expect(htmlElement.textContent).not.toContain('Logout');
  });

  it('should render the greeting and the Logout button when the user is authenticated', () => {
    mockIsLoggedIn.set(true);
    mockFullName.set('Vlad Tester');
    fixture.detectChanges(); 

    const htmlElement: HTMLElement = fixture.nativeElement;
    
    expect(htmlElement.textContent).not.toContain('Login');
    expect(htmlElement.textContent).not.toContain('Register');
    
    expect(htmlElement.textContent).toContain('Hello, Vlad Tester');
    expect(htmlElement.textContent).toContain('Logout');
  });

  it('should hide the red badge on the cart icon when the item count is zero', () => {
    mockItemCount.set(0);
    fixture.detectChanges();

    const badgeElement = fixture.debugElement.query(By.css('.badge'));
    expect(badgeElement).toBeNull();
  });

  it('should render the red badge with the correct number of items when the count is greater than zero', () => {
    mockItemCount.set(3);
    fixture.detectChanges();

    const badgeElement = fixture.debugElement.query(By.css('.badge')).nativeElement as HTMLElement;
    
    expect(badgeElement).toBeTruthy();
    expect(badgeElement.textContent?.trim()).toBe('3');
  });

  it('should invoke the service\'s logout method and navigate to the home/login page on Logout click', () => {
    mockIsLoggedIn.set(true);
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(By.css('button.btn-outline-light')).nativeElement as HTMLButtonElement;
    
    logoutBtn.click();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
