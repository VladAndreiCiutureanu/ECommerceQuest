import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form status to invalid by default upon initialization', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark the form as invalid when the password length is less than 8', () => {
    component.form.controls.emailOrUsername.setValue('testuser');
    component.form.controls.password.setValue('short'); 
    
    expect(component.form.invalid).toBeTrue();
    component.onSubmit();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should invoke the login method and navigate upon successful authentication', () => {
    component.form.controls.emailOrUsername.setValue('vlad123');
    component.form.controls.password.setValue('good-password');
    
    expect(component.form.valid).toBeTrue();

    mockAuthService.login.and.returnValue(of({ token: '123', fullName: 'Vlad' }));

    const formElement = fixture.debugElement.query(By.css('form'));
    formElement.triggerEventHandler('ngSubmit', null);

    expect(mockAuthService.login).toHaveBeenCalledWith({ emailOrUsername: 'vlad123', password: 'good-password' });
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should show a red alert box when the credentials/data are invalid', () => {
    component.form.controls.emailOrUsername.setValue('vlad123');
    component.form.controls.password.setValue('wrong-password');
    
    mockAuthService.login.and.returnValue(throwError(() => new Error('Unauthorized')));
    component.onSubmit();
    fixture.detectChanges(); 
    
    const alertBox = fixture.debugElement.query(By.css('.alert-danger')).nativeElement;
    expect(alertBox.textContent).toContain('Invalid credentials.');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
