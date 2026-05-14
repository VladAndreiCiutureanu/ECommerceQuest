import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should have the message initialized as "null"', () => {
    expect(service.message()).toBeNull();
  });

  it('should immediately set a message when show() is called', () => {
    service.show('Test');
    expect(service.message()).toBe('Test');
  });

  it('should clear the message after the standard timeout (2500ms)', fakeAsync(() => {
    service.show('Message');
    expect(service.message()).toBe('Message');

    tick(2499);
    expect(service.message()).toBe('Message');

    tick(1);
    expect(service.message()).toBeNull();
  }));


  it('should reset the existing timer when show() is called multiple times rapidly.', fakeAsync(() => {
    service.show('Message 1');
    tick(2000);
    
    service.show('Message 2', 3000);
    expect(service.message()).toBe('Message 2');
    
    tick(1000);
    expect(service.message()).toBe('Message 2'); 

    tick(2000);
    expect(service.message()).toBeNull();
  }));
});

