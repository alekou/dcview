import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {NotificationService} from '../notification.service';

@Component({
  selector: 'app-sa-notification-alert-dialog',
  templateUrl: 'notification-alert-dialog.component.html'
})
export class NotificationAlertDialogComponent {
  
  notifications = [];
  username = '';
  
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService) {
    
    this.notifications = this.dynamicDialogConfig.data['notifications'];
    this.username = this.dynamicDialogConfig.data['username'];
  }
  
  goToList() {
    this.dynamicDialogRef.close();
    this.router.navigate(['/sa/notification/list']);
  }
  
  receiveAll() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    let notificationRecipientIds = [];
    this.notifications.forEach(response => {
      if (response) {
        notificationRecipientIds.push(response.notificationRecipientId);
      }
    });
    this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(this.notifications);
        this.router.navigate(['sa/notification/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  goToEntityNotification(notification) {
    let entityUrl = this.getRedirectEntityUrl(notification.entity);
    let notificationRecipientIds = [];
    notificationRecipientIds.push(notification.notificationReceiverId);
    
    this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(notificationRecipientIds);
        this.router.navigate([entityUrl, notification.entityId]);
        this.notificationService.getNotificationCountForUser();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  getRedirectEntityUrl(entity){
    let url  = '';
    
    switch (entity) {

      case 'VACATION':
        return url = '/inm/vacation/view';

      case 'TRANSFER':
        return url = '/inm/transfer/view';

      case 'INMATE':
        return url = '/inm/inmate/view';

      case 'INMATE_FOLDER':
        return url = '/inm/inmatefolder/view';

      case 'TRANSPORT':
        return url = '/inm/transport/view';

      case 'InmateLabor':
        return url = '/inm/inmatelabor/view';

      case 'TREATMENT':
        return url = '/med/treatment/view';

      case 'VACCINATION':
        return url = '/med/vaccination/view';
    }
    return url;
  }
}
