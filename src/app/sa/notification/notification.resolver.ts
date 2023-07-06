import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {NotificationService} from './notification.service';

@Injectable({providedIn: 'root'})
export class NotificationResolver implements Resolve<any> {
  constructor(private notificationService: NotificationService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.notificationService.getNotification(route.paramMap.get('id'));
  }
}
