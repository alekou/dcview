import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {NotificationTypeService} from './notification-type.service';

@Injectable({providedIn: 'root'})
export class NotificationTypeResolver implements Resolve<any> {
  constructor(private notificationTypeService: NotificationTypeService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.notificationTypeService.getNotificationType(route.paramMap.get('id'));
  }
}
