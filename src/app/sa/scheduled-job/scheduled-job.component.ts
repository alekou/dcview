import {Component, OnInit} from '@angular/core';
import {NotificationService} from '../notification/notification.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ScheduledJobService} from './scheduled-job.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-sa-scheduled-job',
  templateUrl: 'scheduled-job.component.html'
})
export class ScheduledJobComponent implements OnInit {
  generateNotificationsJobExists: boolean;
  constructor(
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private scheduledJobService: ScheduledJobService,
    public authService: AuthService,
    private notificationService: NotificationService) {}
  
  ngOnInit(): void {
    // setTimeout(() => {
    //   // Ανάκτηση ένδειξης για το αν υπάρχει το job παραγωγής ειδοποιήσεων
    // });
  }
  
  checkIfGenerateNotificationsJobExists() {
    // Ανάκτηση ένδειξης για το αν υπάρχει το job παραγωγής ειδοποιήσεων
    this.toitsuBlockUiService.blockUi();

    this.scheduledJobService.generateNotificationsJobExists().subscribe({
      next: (responseData: any) => {
      this.generateNotificationsJobExists = responseData['jobExists'] ? responseData['jobExists'] : false;
    }, 
      error: (responseError) => {
      this.toitsuToasterService.apiValidationErrors(responseError);
    }
  }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  createGenerateNotificationsJob() {
    // Δημιουργία job παραγωγής ειδοποιήσεων
    this.toitsuBlockUiService.blockUi();
    this.scheduledJobService.createGenerateNotificationsJob().subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('scheduledJob.create.success'));
        this.checkIfGenerateNotificationsJobExists();
        // Εκκίνηση ελέγχου αριθμού ειδοποιήσεων με interval ανά 2 ώρες.
        // Σταματάει μόνο σε περίπτωση διαγραφής του job.
        this.notificationService.startPolling();
    },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
    }
  }).add(() => {
    this.toitsuBlockUiService.unblockUi();
    });
  }
  
  deleteGenerateNotificationsJob() {
    this.scheduledJobService.deleteGenerateNotificationsJob().subscribe({
      next: (responseData: any) => {
      this.checkIfGenerateNotificationsJobExists();
      // Το τρέχουμε για να κάνει έναν τελευταίο έλεγχο για νέες ειδοποιήσεις και καθαρίζουμε το interval
      this.notificationService.getNotificationCountForUser();
      this.notificationService.stopPolling();
      this.toitsuToasterService.showSuccessStay(this.translate.instant('scheduledJob.delete.success'));
    },
      error: (responseError) => {
      this.toitsuToasterService.apiValidationErrors(responseError);
    }
  }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  generateNotifications() {
    this.toitsuBlockUiService.blockUi();

    this.notificationService.generateNotifications().subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('scheduledJob.start.success'));
        this.checkIfGenerateNotificationsJobExists();
        // Εκκίνηση ελέγχου αριθμού ειδοποιήσεων με interval ανά 2 ώρες.
        // Σταματάει μόνο σε περίπτωση διαγραφής του job.
        this.notificationService.startPolling();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
  }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
