import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ExitConfirmation} from '../../../toitsu-shared/exit-confirmation.guard';
import {Vaccination} from '../vaccination.model';
import {VaccinationService} from '../vaccination.service';
import {VaccineService} from '../../vaccine/vaccine.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {inmateConsts} from '../../../inm/inmate/inmate.consts';
import {Observable} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-vaccination-view-dialog',
  templateUrl: 'vaccination-view-dialog.component.html'
})
export class VaccinationViewDialogComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) vaccinationForm: NgForm;
  vaccination: Vaccination = new Vaccination();
  inmateDialogUrl: string;
  vaccines = [];
  vaccinationStatuses = [];

  constructor(
    private vaccinationService: VaccinationService,
    private vaccineService: VaccineService,
    public authService: AuthService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private enumService: EnumService
  ) {
    this.vaccination = this.dynamicDialogConfig.data['vaccination'];
  }

  ngOnInit() {

    this.vaccineService.getAllVaccines().subscribe(responseData => {
      this.vaccines = responseData;
    });

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;

    this.enumService.getEnumValues('med.core.enums.VaccinationStatus').subscribe(responseData => {
      this.vaccinationStatuses = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.vaccinationForm.dirty;
  }

  saveVaccination() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.vaccinationService.saveVaccination(this.vaccination).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close(this.vaccination);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteVaccination() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.vaccinationService.deleteVaccination(this.vaccination.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.dynamicDialogRef.close();
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
  cancel() {
    if (this.vaccinationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
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

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.vaccination.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.vaccination.dcId !== this.authService.getUserDcId()) {
      return true;
    }

    return false;
  }
}
