import {Component, OnInit, ViewChild} from '@angular/core';
import {DateService} from '../../../toitsu-shared/date.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {NgForm} from '@angular/forms';
import {InmateLaborApplication} from '../inmate-labor-application.model';

@Component({
  selector: 'app-inm-inmate-labor-application-rejection-details-dialog',
  templateUrl: 'inmate-labor-application-rejection-details-dialog.component.html'
})

export class InmateLaborApplicationRejectionDetailsDialogComponent implements OnInit {

  inmateLaborApplicationToReject: InmateLaborApplication = new InmateLaborApplication();
  placementProtocolApproveStatus: boolean = null;

  lastRejected: boolean = null;
  lastRejectionDate: Date = null;
  lastRejectionComments: string = null;

  @ViewChild(NgForm) inmateLaborApplicationRejectionDetailsForm: NgForm;

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private confirmationService: ConfirmationService,
    private dateService: DateService
  ) {
    // Αρχικοποίηση δεδομένων
    this.inmateLaborApplicationToReject = this.dynamicDialogConfig.data.inmateLaborApplicationToReject;
    this.placementProtocolApproveStatus = this.dynamicDialogConfig.data.placementProtocolApproveStatus;
  }

  ngOnInit(): void {
    // Αρχικοποίηση των υπάρχων στοιχείων απόρριψης σε τοπικές μεταβλητές
    this.lastRejected = this.inmateLaborApplicationToReject.rejected;
    this.lastRejectionDate = this.inmateLaborApplicationToReject.rejectionDate;
    this.lastRejectionComments = this.inmateLaborApplicationToReject.rejectionComments;
  }

  confirm() {
    // Κλείσιμο του dialog και επιστροφή των ενημερωμένων στοιχείων απόρριψης
    this.dynamicDialogRef.close(this.inmateLaborApplicationToReject);
  }

  cancel() {
    if (this.inmateLaborApplicationRejectionDetailsForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          // Επαναφορά των στοιχείων απόρριψης και κλείσιμο του dialog
          this.resetSpecificFormFields();
          this.dynamicDialogRef.close();
        },
        reject: () => {

        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }

  resetSpecificFormFields() {
    this.inmateLaborApplicationRejectionDetailsForm.controls['rejected'].setValue(this.lastRejected);
    this.inmateLaborApplicationRejectionDetailsForm.controls['rejectionDate'].setValue(this.lastRejectionDate);
    this.inmateLaborApplicationRejectionDetailsForm.controls['rejectionComments'].setValue(this.lastRejectionComments);
  }

  enableRejectionDate() {
    if (this.inmateLaborApplicationToReject.rejected) {
      this.inmateLaborApplicationToReject.rejectionDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateLaborApplicationToReject.rejectionDate = null;
    }
  }

  closeDisplayApprovedRejectionDetails() {
    this.dynamicDialogRef.close();
  }
}
