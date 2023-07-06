import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {notificationTypeConsts} from './notification-type.consts';

@Injectable({providedIn: 'root'})
export class NotificationTypeService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  getNotificationType(id) {
    return this.http
      .get(
        environment.apiBaseUrl + notificationTypeConsts.getUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
  
  saveNotificationType(notificationType) {
    return this.http
      .post(
        environment.apiBaseUrl + notificationTypeConsts.saveUrl, 
        notificationType
      );
  }

  getNotificationTypes(centralNotice, onlyActive) {
    return this.http
      .get<{}[]> (
        environment.apiBaseUrl + notificationTypeConsts.getActiveUrl,
        {
          params: this.toitsuSharedService.initHttpParams({centralNotice, onlyActive})
        }
      );
  }
}
