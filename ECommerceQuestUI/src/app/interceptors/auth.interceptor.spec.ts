import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpClient, HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [

        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not modify the request (omit Authorization header) when the token is missing', () => {
    mockAuthService.getToken.and.returnValue(null);


    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    

    expect(req.request.headers.has('Authorization')).toBeFalse();
    
    req.flush(null);
  });

  it('should add "Authorization: Bearer <token>" header if the user has a Token', () => {
    const fakeToken = 'secret-jwt-token-123';
    mockAuthService.getToken.and.returnValue(fakeToken);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
    
    req.flush(null);
  });

  it('should force logout and redirect to /login if the API returns a "401 Unauthorized" error', () => {
    mockAuthService.getToken.and.returnValue('invalid-or-expired-token');

    httpClient.get('/api/test').subscribe({
      next: () => fail('should have returned a 401 error'),
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne('/api/test');

    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});

