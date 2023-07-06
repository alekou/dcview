import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {notificationConsts} from './notification.consts';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthService} from '../../toitsu-auth/auth.service';

@Injectable({providedIn: 'root'})
export class NotificationService {

  private notificationCountSubject = new BehaviorSubject(0);
  notificationCount: Observable<number> = this.notificationCountSubject.asObservable();
  pollingInterval;
  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService,
    private authService: AuthService) 
  {
    if (authService.isLoggedIn()) {
      this.getNotificationCountForUser();
      
    }
  }
  
  generateNotifications() {
    return this.http
      .post(
        environment.apiBaseUrl + notificationConsts.generateNotificationUrl,
        {}
      );
  }
  
  getNotification(id) {
    return this.http
      .get(
        environment.apiBaseUrl + notificationConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  saveNotification(notification) {
    return this.http
      .post(
        environment.apiBaseUrl + notificationConsts.saveUrl,
        notification
      );
  }

  getUnreceivedNotificationsByUser() {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + notificationConsts.getUnreceivedNotificationsUrl
      );
  }
  
  markAllAsReceived(notificationReceiverIds) {
    return this.http
      .post(
        environment.apiBaseUrl + notificationConsts.markAllAsReceivedUrl,
        notificationReceiverIds
      );
  }

  getNotificationCountForUser() {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + notificationConsts.getUnreceivedCountUrl
      )
      .subscribe({
        next: (responseData ) => {
          this.notificationCountSubject.next(responseData && responseData['count'] ? responseData['count'] : 0);
        },
        error: (responseError) => {
          this.notificationCountSubject.next(0);
        }
      });
  }
  
  // Έναρξη για έλεγχο καινούργιων ειδοποιήσεων με interval
  startPolling() {
    // Κάθε 2 ώρες
    const interval = 2 * 60 * 60 * 1000;
    
    this.pollingInterval = setInterval(() => {
      this.getNotificationCountForUser();
    }, interval);
  }
  
  // Διακοπή του interval
  stopPolling() {
    clearInterval(this.pollingInterval);
  }
}
