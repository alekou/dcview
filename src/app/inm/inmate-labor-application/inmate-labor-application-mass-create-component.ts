import {Component, OnInit} from '@angular/core';
import {InmateLaborApplicationService} from './inmate-labor-application.service';
import {InmateService} from '../inmate/inmate.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {DateService} from '../../toitsu-shared/date.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {InmateLaborApplication} from './inmate-labor-application.model';
import {inmateConsts} from '../inmate/inmate.consts';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {Observable} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-inm-inmate-labor-application-mass-create',
  templateUrl: 'inmate-labor-application-mass-create-component.html'
})
export class InmateLaborApplicationMassCreateComponent implements OnInit, ExitConfirmation {

  inmateLaborApplication: InmateLaborApplication;
  inmateLaborApplicationsToSave: InmateLaborApplication[] = [];

  inmateDialogUrl: string;
  professions = [];

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

    // Φόρτωση λίστας κρατουμένων
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    // Φόρτωση λίστας ενεργών θέσεων εργασίας
    this.professionService.getActiveProfessionsByUserDc([]).subscribe(responseData => {
      this.professions = responseData;
    });

  }

  confirmExit(): boolean | Observable<boolean> {
    return this.inmateLaborApplicationsToSave.length > 0;
  }

  addRecord() {
    this.inmateLaborApplicationsToSave.push(new InmateLaborApplication());
  }

  removeRecord(index) {
    this.inmateLaborApplicationsToSave.splice(index,  1);
  }

  removeAllRecords() {
    this.confirmationService.confirm({
      message: this.translate.instant('inmateLaborApplication.massCreate.removeAll.confirmation'),
      accept: () => {
        this.inmateLaborApplicationsToSave.length = 0;
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateLaborApplication.massCreate.removeAll.success'));
      }
    });
  }

  massCreate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.inmateLaborApplicationService.massCreateInmateLaborApplication(this.inmateLaborApplicationsToSave).subscribe({
      next: (responseData: InmateLaborApplication[]) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateLaborApplication.massCreate.save.success'));
        this.inmateLaborApplicationsToSave.length = 0;
        this.router.navigate(['/inm/inmatelaborapplication/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  getLastInmateProfession(index) {
    this.loading = true;
    if (this.inmateLaborApplicationsToSave[index].inmateId && this.inmateLaborApplicationsToSave[index].renewal) {
      this.professionService.getLastInmateProfession(this.inmateLaborApplicationsToSave[index].inmateId).subscribe({
        next: (responseData: any) => {
          this.inmateLaborApplicationsToSave[index].requestedProfessionId = responseData.id;
          this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.success'));
        },
        error: (responseError: HttpErrorResponse) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
          // Αν δεν υπάρχει προηγούμενη θέση εργασίας για επανατοποθέτηση, επιστροφή στην αρχική κατάσταση επανατοποθέτησης
          if (this.inmateLaborApplicationsToSave[index].renewal === true) {
            this.inmateLaborApplicationsToSave[index].renewal = false;
          }
        }
      }).add(() => {
        this.loading = false;
      });
    }
    else if (!this.inmateLaborApplicationsToSave[index].renewal) {
      this.inmateLaborApplicationsToSave[index].requestedProfessionId = null;
    }
    else if (!this.inmateLaborApplicationsToSave[index].inmateId) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('inmateLaborApplication.getLastInmateProfession.info'));
    }
  }

  goToList() {
    this.router.navigate(['/inm/inmatelaborapplication/list']);
  }

  enableProtocolDate(index) {
    if (this.inmateLaborApplicationsToSave[index].protocolNo) {
      this.inmateLaborApplicationsToSave[index].protocolDate = this.dateService.getCurrentDateString() as unknown as Date;
    }
    else {
      this.inmateLaborApplicationsToSave[index].protocolDate = null;
    }
  }

  restartRenewalStatus(index) {
    if (this.inmateLaborApplicationsToSave[index].renewal) {
      this.inmateLaborApplicationsToSave[index].renewal = false;
      this.inmateLaborApplicationsToSave[index].requestedProfessionId = null;
    }
  }

}
