import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  let store: { [key: string]: string } = {};

  beforeEach(() => {
    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should consider the user logged out by default if storage is empty', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.token()).toBeNull();
    expect(service.fullName()).toBeNull();
  });

  it('should recognize a logged-in user if there already is a token in LocalStorage on startup', () => {

    store['token'] = 'jwt-super-secret-token';
    store['fullName'] = 'Vlad User';
    
    
    const httpClient = TestBed.inject(HttpClient);
    const freshService = new AuthService(httpClient);
    
    expect(freshService.isLoggedIn()).toBeTrue();
    expect(freshService.token()).toBe('jwt-super-secret-token');
    expect(freshService.fullName()).toBe('Vlad User');
    expect(freshService.getToken()).toBe('jwt-super-secret-token');
  });

  it('should correctly send a registration request', () => {
    const mockRegister: RegisterRequest = {
      email: 'test@ecommerce.com',
      username: 'testvlad',
      fullName: 'Vlad Test',
      password: 'Password123!'
    };

    service.register(mockRegister).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegister);
    
    req.flush(null);
  });

  it('should correctly update LocalStorage and signals upon successful authentication.', () => {
    const mockLogin: LoginRequest = { emailOrUsername: 'testvlad', password: 'Password123!' };
    const mockResponse: LoginResponse = { token: 'bearer-token-1234', fullName: 'Vlad Test' };

    service.login(mockLogin).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'bearer-token-1234');
    expect(localStorage.setItem).toHaveBeenCalledWith('fullName', 'Vlad Test');

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.token()).toBe('bearer-token-1234');
    expect(service.fullName()).toBe('Vlad Test');
  });

  it('should clear all keys from LocalStorage and reset reactive state on logout()()', () => {

    store['token'] = 'old-token';
    store['fullName'] = 'Old Name';
    const loggedInService = TestBed.inject(AuthService); 
    
    loggedInService.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('fullName');

    expect(loggedInService.isLoggedIn()).toBeFalse();
    expect(loggedInService.token()).toBeNull();
    expect(loggedInService.fullName()).toBeNull();
  });
});

