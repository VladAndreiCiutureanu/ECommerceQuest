import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../services/notification.service';
import { signal } from '@angular/core';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockNotificationService = {
      message: signal<string | null>(null)
    };

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show toast when message is null', () => {
    mockNotificationService.message.set(null);
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast-container');
    expect(toastElement).toBeNull();
  });

  it('should show toast with message when message is set', () => {
    const testMessage = 'Product added successfully';
    mockNotificationService.message.set(testMessage);
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast-container');
    const toastBody = fixture.nativeElement.querySelector('.toast-body');

    expect(toastElement).not.toBeNull();
    expect(toastBody.textContent.trim()).toContain(testMessage);
  });
});
