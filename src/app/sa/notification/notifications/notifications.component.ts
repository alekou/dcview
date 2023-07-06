import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../notification.service';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DialogService} from 'primeng/dynamicdialog';
import {Router} from '@angular/router';
import {AppComponent} from '../../../app.component';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {NotificationAlertDialogComponent} from '../notification-alert-dialog/notification-alert-dialog.component';

@Component({
  selector: 'app-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  userNotifications = [];
  notificationsWithAlert = [];
  notificationCount: number = 0;
  
  constructor(
    private notificationService: NotificationService,
    public translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private dialogService: DialogService,
    private router: Router,
    public app: AppComponent,
    public authService: AuthService
  ) {
    notificationService.notificationCount.subscribe((count) => {
      this.notificationCount = count;
    });
  }
  
  ngOnInit(): void {
    this.loadUserNotifications();
  }
  
  goToList(event, notificationOverlayPanel) {
    this.router.navigate(['/sa/notification/list']);
    notificationOverlayPanel.hide(event);
  }
  
  notificationPanel(event, notificationOverlayPanel) {
    this.loadUserNotifications();
    notificationOverlayPanel.toggle(event);
  }
  
  loadUserNotifications() {
    if (this.authService.isLoggedIn()) {
      this.notificationService.getUnreceivedNotificationsByUser().subscribe(responseData => {
        if (responseData) {
          this.userNotifications = responseData;
          for (let i = 0; i < this.userNotifications.length; i++) {
            if (this.userNotifications[i].withAlert) {
              this.notificationsWithAlert.push(this.userNotifications[i]);
            }
          }
          let showAlertDialog = true;
          if (localStorage.getItem('notificationAlertsDismissed')) {
            showAlertDialog = false;
          }
          if (this.notificationsWithAlert.length > 0 && showAlertDialog) {
            this.toitsuToasterService.clearMessages();

            const ref = this.dialogService.open(NotificationAlertDialogComponent, {
              data: {
                notifications: this.notificationsWithAlert,
                username: this.authService.getUserDisplayName()
              },
              header: this.translate.instant('notification.alertDialog'),
              width: '50%'
            });

            ref.onClose.subscribe(result => {
              if (result) {
                this.notificationCount -= result.length;
              }
              localStorage.setItem('notificationAlertsDismissed', '1');
            });

          }
        }
      });
    }
  }
  
  markAsReceived(event, notificationOverlayPanel) {
    if (this.userNotifications.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.toitsuBlockUiService.blockUi();
      let notificationRecipientIds = [];
      this.userNotifications.forEach(response => {
        if (response) {
          notificationRecipientIds.push(response.notificationRecipientId);
        }
      });
      this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
        next: (responseData: any) => {
          this.toitsuToasterService.showSuccessStay();
          this.router.navigate(['sa/notification/list']);
          notificationOverlayPanel.hide(event);
          this.notificationCount -= this.userNotifications.length;
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    }
  }
  
  openNotificationDialog() {
    if (this.userNotifications) {
      const ref = this.dialogService.open(NotificationAlertDialogComponent, {
        data: {
          notifications: this.userNotifications,
          username: this.authService.getUserDisplayName()
        },
        header: this.translate.instant('notification.alertDialog'),
        width: '50%'
      });

      ref.onClose.subscribe(result => {
        if (result) {
          this.userNotifications.length -= result.length;
        }
      });
    }
  }

  goToEntityNotification(event, notificationOverlayPanel, notification) {
    let entityUrl = this.getRedirectEntityUrl(notification.entity);
    let notificationRecipientIds = [];
    notificationRecipientIds.push(notification.notificationRecipientId);
    
    this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.router.navigate([entityUrl, notification.entityId]);
        notificationOverlayPanel.hide(event);
        this.notificationCount -= 1;
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

      case 'INMATE_LABOR':
        return url = '/inm/inmatelabor/view';

      case 'TREATMENT':
        return url = '/med/treatment/view';

      case 'VACCINATION':
        return url = '/med/vaccination/view';
    }
    return url;
  }
}

