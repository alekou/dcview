import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {EnumService} from '../../cm/enum/enum.service';
import {NotificationTypeService} from './notification-type.service';
import {NotificationType} from './notification-type.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../toitsu-auth/auth.service';
import {NotificationTypeRecipientService} from '../notification-type-recipient/notification-type-recipient.service';
import {notificationTypeRecipientConsts} from '../notification-type-recipient/notification-type-recipient.consts';
import {NotificationTypeRecipient} from '../notification-type-recipient/notification-type-recipient.model';

@Component({
  selector: 'app-sa-notification-type-view',
  templateUrl: 'notification-type-view.component.html'
})
export class NotificationTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) notificationTypeForm: NgForm;
  id: number;
  notificationType: NotificationType = new NotificationType();
  entities = [];
  users = ['ΕΙΔΙΚΟ ΚΕΝΤΡΟ ΥΓΕΙΑΣ ΚΡΑΤΟΥΜΕΝΩΝ ΚΟΡΥΔΑΛΛΟΥ', 'ΣΩΦΡΟΝΙΣΤΙΚΟ ΚΑΤΑΣΤΗΜΑ ΛΑΡΙΣΑΣ', 'ΣΩΦΡΟΝΙΣΤΙΚΟ ΚΑΤΑΣΤΗΜΑ ΠΑΤΡΑΣ', 'ΣΩΦΡΟΝΙΣΤΙΚΟ ΚΑΤΑΣΤΗΜΑ ΤΡΙΚΑΛΩΝ', 'ΑΓΡΟΤΙΚΟ ΣΩΦΡΟΝΙΣΤΙΚΟ ΚΑΤΑΣΤΗΜΑ ΑΓΙΑΣ ΧΑΝΙΩΝ', 'ΥΠΟΥΡΓΕΙΟ ΠΡΟΣΤΑΣΙΑΣ ΤΟΥ ΠΟΛΙΤΗ'];
  userGroups = ['userGroup1', 'userGroup2', 'userGroup3'];
  selectedUsers = [];
  selectedUserGroups = [];
  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private enumService: EnumService,
    private notificationTypeService: NotificationTypeService,
    private notificationTypeRecipientService: NotificationTypeRecipientService) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];
    
    // Get the record from the route resolver or initialize a new one
    this.notificationType = this.id ? this.route.snapshot.data['record'] : new NotificationType();
    
    this.enumService.getEnumValues('cm.core.enums.DcEntity').subscribe(responseData => {
      this.entities = responseData;
    });
    this.clearNotificationTypeRecipientArgs();
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.notificationTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/notificationtype/view']);
  }

  goToList() {
    this.router.navigate(['/sa/notificationtype/list']);
  }

  saveNotificationType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.composeUsers(this.selectedUsers);
    this.composeUserGroups(this.selectedUserGroups);
    
    this.notificationTypeService.saveNotificationType(this.notificationType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.notificationTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/notificationtype/view/', responseData.id]);
        } else {
          this.notificationType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.loadNotificationTypeRecipientTableData();
    });
  }
  // Παραλήπτης Τύπου Υπενθύμισης ---------------------------------------------------------------------------------------------

  notificationTypeRecipientUrl = notificationTypeRecipientConsts.indexUrl;
  notificationTypeRecipientCols = [
    {field: 'rowNum', width: '8rem', align: 'center'},
    {field: 'recipient', header: this.translate.instant('notificationTypeRecipient.recipient'), width: '25rem'},
    {field: 'view', width: '8rem', align: 'center' , customCell: 'cell1'},
  ];
  
  notificationTypeRecipientArgs = this.initializeNotificationTypeRecipientArgs();

  @ViewChild('notificationTypeRecipientTable') notificationTypeRecipientTable;
  
  initializeNotificationTypeRecipientArgs() {
    return {
      notificationTypeId: this.id,
    };
  }
  loadNotificationTypeRecipientTableData() {
    this.notificationTypeRecipientTable.loadTableData();
  }
  clearNotificationTypeRecipientArgs() {
    this.notificationTypeRecipientArgs = this.initializeNotificationTypeRecipientArgs();
  }
  
  deleteNotificationRecipient(id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.notificationTypeRecipientService.deleteNotificationTypeRecipient(id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.loadNotificationTypeRecipientTableData();
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }
  
  composeUsers(users) {
    if (users) {
      for (let i = 0; i < users.length; i++) {
        let notificationTypeRecipient: NotificationTypeRecipient =  new NotificationTypeRecipient();
        notificationTypeRecipient.username = users[i];
        this.notificationType.notificationTypeRecipients.push(notificationTypeRecipient);
      }
    }
  }
  
  composeUserGroups(userGroups) {
    if (userGroups) {
      for (let i = 0; i < userGroups.length; i++) {
        let notificationTypeRecipient: NotificationTypeRecipient =  new NotificationTypeRecipient();
        notificationTypeRecipient.userGroup = userGroups[i];
        this.notificationType.notificationTypeRecipients.push(notificationTypeRecipient);
      }
    }
  }
}
