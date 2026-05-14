import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { RegisterUserComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('Register', () => {
  let component: RegisterUserComponent;
  let fixture: ComponentFixture<RegisterUserComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterUserComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterUserComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should validate form controls completely', () => {
    const emailControl = component.form.get('email');
    const usernameControl = component.form.get('username');
    const fullNameControl = component.form.get('fullName');
    const passwordControl = component.form.get('password');

    expect(emailControl?.hasError('required')).toBeTrue();
    expect(usernameControl?.hasError('required')).toBeTrue();
    expect(fullNameControl?.hasError('required')).toBeTrue();
    expect(passwordControl?.hasError('required')).toBeTrue();


    emailControl?.setValue('invalidEmail');
    usernameControl?.setValue('ab');
    fullNameControl?.setValue('John Doe');
    passwordControl?.setValue('short');

    expect(emailControl?.hasError('email')).toBeTrue();
    expect(usernameControl?.hasError('minlength')).toBeTrue();
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    expect(component.form.valid).toBeFalse();
  });

  it('should consider the form valid when all requirements are met', () => {
    component.form.setValue({
      email: 'test@example.com',
      username: 'john_doe',
      fullName: 'John Doe',
      password: 'password123'
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should not call register if the form is invalid', () => {
    component.form.setValue({
      email: '',
      username: '',
      fullName: '',
      password: ''
    });

    component.onSubmit();
    expect(mockAuthService.register).not.toHaveBeenCalled();
  });

  it('should call register and navigate to /login on successful registration', () => {
    const validUser = {
      email: 'test@example.com',
      username: 'user123',
      fullName: 'Test User',
      password: 'password123'
    };

    component.form.setValue(validUser);
    mockAuthService.register.and.returnValue(of(true as any));
    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(validUser);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set an error message on registration failure', () => {
    const validUser = {
      email: 'test@example.com',
      username: 'user123',
      fullName: 'Test User',
      password: 'password123'
    };
    const errorMessage = 'Email already exists';

    component.form.setValue(validUser);
    mockAuthService.register.and.returnValue(throwError(() => ({ error: errorMessage })));

    component.onSubmit();

    expect(mockAuthService.register).toHaveBeenCalledWith(validUser);
    expect(component.errorMessage()).toBe(errorMessage);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
