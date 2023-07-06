import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {EnumService} from '../../cm/enum/enum.service';
import {NotificationTypeService} from '../notification-type/notification-type.service';
import {Observable} from 'rxjs';
import {Notification} from './notification.model';
import {NotificationService} from './notification.service';

@Component({
  selector: 'app-sa-notification-view',
  templateUrl: 'notification-view.component.html'
})
export class NotificationViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) notificationForm: NgForm;
  id: number;
  notification: Notification = new Notification();
  notificationTypes = [];
  centralNotice = false;
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private enumService: EnumService,
    private notificationService: NotificationService,
    private notificationTypeService: NotificationTypeService) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.notification = this.id ? this.route.snapshot.data['record'] : new Notification();

    if (this.authService.isMinistry()) {
      this.centralNotice = true;
    }
    
    if (this.id) {
      this.notificationTypeService.getNotificationTypes(this.centralNotice, false).subscribe(responseData => {
        if (responseData) {
          this.notificationTypes = responseData;
        }
      });
    }
    
    if (!this.id) {
      this.notificationTypeService.getNotificationTypes(this.centralNotice, true).subscribe(responseData => {
        if (responseData) {
          this.notificationTypes = responseData;
        }
      });
    }
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.notificationForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/notification/view']);
  }

  goToList() {
    this.router.navigate(['/sa/notification/list']);
  }

  lockedRecord() {
    // Υπουργείο - όχι κλειδωμένη
    return !this.authService.isMinistry();
  }
  
  saveNotification() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.notificationService.saveNotification(this.notification).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.notificationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/notification/view/', responseData.id]);
        } else {
          this.notification = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
