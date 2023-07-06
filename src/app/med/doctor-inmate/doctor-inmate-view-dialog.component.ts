import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DoctorInmate} from './doctor-inmate.model';
import {DoctorInmateService} from './doctor-inmate.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {NgForm} from '@angular/forms';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-doctor-inmate-view',
  templateUrl: 'doctor-inmate-view-dialog.component.html'
})
export class DoctorInmateViewDialogComponent implements OnInit{
  
  @ViewChild(NgForm) doctorInmateForm: NgForm;
  doctorInmate: DoctorInmate = new DoctorInmate();
  allDoctors = [];
  constructor(
    private doctorInmateService: DoctorInmateService,
    private doctorService: DoctorService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    this.doctorInmate = this.dynamicDialogConfig.data['doctorInmate'];
  }
  
  ngOnInit() {
    // All Doctors
    this.doctorService.getAllDoctors().subscribe(doctors => {
      this.allDoctors = doctors;
    });
  }

  saveDoctorInmate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.doctorInmateService.saveDoctorInmate(this.doctorInmate).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
      this.dynamicDialogRef.close(this.doctorInmate);
    });
  }

  deleteDoctorInmate() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.doctorInmateService.deleteDoctorInmate(this.doctorInmate.id).subscribe({
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
    if (this.doctorInmateForm.dirty) {
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

  isActiveChecked() {
    if (this.doctorInmate.isActive) {
      this.toitsuToasterService.showInfoStay(this.translate.instant('med.doctorInmateIsActive.checked'));
    }
  }
}
