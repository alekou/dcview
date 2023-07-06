import {Component, OnInit, ViewChild} from '@angular/core';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {NgForm} from '@angular/forms';
import {InmateLaborApplication} from './inmate-labor-application.model';
import {InmateLaborApplicationService} from './inmate-labor-application.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {DateService} from '../../toitsu-shared/date.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {ifTrue} from 'codelyzer/util/function';

@Component({
  selector: 'app-inm-inmate-labor-application-view',
  templateUrl: 'inmate-labor-application-view.component.html'
})
export class InmateLaborApplicationViewComponent implements OnInit, ExitConfirmation {

  id: number;
  inmateLaborApplication: InmateLaborApplication;
  connectedPlacementProtocolDetails: string;
  @ViewChild(NgForm) inmateLaborApplicationForm: NgForm;

  inmateDialogUrl: string;

  professions = [];

  renewalStatus: boolean = null;
  loading = false;

  constructor(
    private inmateLaborApplicationService: InmateLaborApplicationService,
    private inmateService: InmateService,
    private professionService: ProfessionService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private dateService: DateService,
    private translate: TranslateService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {

    // Αποθήκευση του id της εγγραφής από το URL
    this.id = +this.route.snapshot.params['id'];

    // Φόρτωση εγγραφής βάση του id ή δημιουργία νέας εγγραφής
    this.inmateLaborApplication = this.id ? this.route.snapshot.data['record'] : new InmateLaborApplication();

    // Αποθήκευση της αρχικής κατάστασης επανατοποθέτησης του αιτήματος εργασίας
    if (this.id) {
      this.renewalStatus = this.inmateLaborApplication.renewal;
    }

    // Φόρτωση στοιχείων συνδεδεμένου πρακτικού τοποθέτησης για προβολή
    if (this.inmateLaborApplication.placementProtocolId) {
      this.composePlacementProtocolDetails();
    }

    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([this.inmateLaborApplication.requestedProfessionId]).subscribe(responseData => {
      this.professions = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.inmateLaborApplicationForm.dirty;
  }

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.inmateLaborApplication.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    // Εγγραφή αίτημα εργασίας συσχετισμένη με πρακτικό τοποθέτησης - κλειδωμένη
    if (this.inmateLaborApplication.placementProtocolId) {
      return true;
    }

    return false;
  }

  newRecord() {
    this.router.navigate(['/inm/inmatelaborapplication/view']);
  }

  goToList() {
    this.router.navigate(['/inm/inmatelaborapplication/list']);
  }

  saveInmateLaborApplication() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.inmateLaborApplicationService.saveInmateLaborApplication(this.inmateLaborApplication).subscribe({
      next: (responseData: InmateLaborApplication) => {
        this.toitsuToasterService.showSuccessStay();
        this.inmateLaborApplicationForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/inmatelaborapplication/view', responseData.id]);
        } else {
          this.inmateLaborApplication = responseData;
        }
      },
      error: (responseError: HttpErrorResponse) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteInmateLaborApplication() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.inmateLaborApplicationService.deleteInmateLaborApplication(this.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.inmateLaborApplicationForm.form.markAsPristine();
            this.router.navigate(['/inm/inmatelaborapplication/list']);
          },
          error: (responseError: HttpErrorResponse) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  getLastInmateProfession() {
    this.loading = true;
    if (this.inmateLaborApplication.inmateId && this.inmateLaborApplication.renewal) {
      this.professionService.getLastInmateProfession(this.inmateLaborApplication.inmateId).subscribe({
        next: (responseData: any) => {
          this.inmateLaborApplication.requestedProfessionId = responseData.id;
          this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.success'));
        },
        error: (responseError: HttpErrorResponse) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
          // Αν δεν υπάρχει προηγούμενη θέση εργασίας για επανατοποθέτηση, επιστροφή στην αρχική κατάσταση επανατοποθέτησης
          if (this.renewalStatus !== this.inmateLaborApplication.renewal) {
            this.inmateLaborApplication.renewal = this.renewalStatus;
          }
        }
      }).add(() => {
        this.loading = false;
      });
    }
    else if (!this.inmateLaborApplication.renewal) {
      this.inmateLaborApplication.requestedProfessionId = null;
    }
    else if (!this.inmateLaborApplication.inmateId) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.info'));
    }
  }

  enableProtocolDate() {
    if (this.inmateLaborApplication.protocolNo) {
      this.inmateLaborApplication.protocolDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateLaborApplication.protocolDate = null;
    }
  }

  enableRejectionDate() {
    if (this.inmateLaborApplication.rejected) {
      this.inmateLaborApplication.rejectionDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateLaborApplication.rejectionDate = null;
    }
  }

  composePlacementProtocolDetails() {
    if (this.inmateLaborApplication.placementProtocolNo !== null || undefined) {
      this.connectedPlacementProtocolDetails = this.inmateLaborApplication.placementProtocolNo;
    } else {
      this.connectedPlacementProtocolDetails = '-';
    }
    if (this.inmateLaborApplication.placementProtocolDate !== null || undefined) {
      this.connectedPlacementProtocolDetails += ' | ' + this.inmateLaborApplication.placementProtocolDate;
    }
  }

  refreshRenewalStatus() {
    if (this.inmateLaborApplication.renewal) {
      this.inmateLaborApplication.renewal = false;
      this.inmateLaborApplication.requestedProfessionId = null;
    }
  }

}
