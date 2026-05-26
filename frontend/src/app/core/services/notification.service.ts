import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  private idCounter = 0;

  success(message: string, duration: number = 3000) {
    this.show('success', message, duration);
  }

  error(message: string, duration: number = 5000) {
    this.show('error', message, duration);
  }

  warning(message: string, duration: number = 4000) {
    this.show('warning', message, duration);
  }

  info(message: string, duration: number = 3000) {
    this.show('info', message, duration);
  }

  private show(type: 'success' | 'error' | 'warning' | 'info', message: string, duration: number) {
    const notification: Notification = {
      id: `notification-${++this.idCounter}`,
      type,
      message,
      duration
    };

    this.notificationSubject.next(notification);
  }
}

// Made with Bob