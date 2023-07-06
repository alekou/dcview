import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {environment} from '../../../environments/environment';
import {notificationTypeRecipientConsts} from './notification-type-recipient.consts';

@Injectable({providedIn: 'root'})
export class NotificationTypeRecipientService {

  constructor(
    private http: HttpClient,
    private toitsuSharedService: ToitsuSharedService
  ) {}
  
  deleteNotificationTypeRecipient(id) {
    return this.http
      .delete(
        environment.apiBaseUrl + notificationTypeRecipientConsts.deleteUrl,
        {
          params: this.toitsuSharedService.initHttpParams({id})
        }
      );
  }
}
