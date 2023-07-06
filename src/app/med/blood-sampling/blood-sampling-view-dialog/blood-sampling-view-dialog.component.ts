import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ExitConfirmation} from '../../../toitsu-shared/exit-confirmation.guard';
import {BloodSampling} from '../blood-sampling.model';
import {BloodSamplingService} from '../blood-sampling.service';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {inmateConsts} from '../../../inm/inmate/inmate.consts';
import {Observable} from 'rxjs';
import {ExaminationTypeListDialogComponent} from '../../examination-type/examination-type-list-dialog/examination-type-list-dialog.component';
import {Examination} from '../../examination/examination.model';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {ExaminationService} from '../../examination/examination.service';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-blood-sampling-view-dialog',
  templateUrl: 'blood-sampling-view-dialog.component.html'
})
export class BloodSamplingViewDialogComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) bloodSamplingForm: NgForm;
  bloodSampling: BloodSampling = new BloodSampling();
  inmateDialogUrl: string;
  inmateId: number;

  constructor(
    private examinationService: ExaminationService,
    private bloodSamplingService: BloodSamplingService,
    public authService: AuthService,
    private dialogService: DialogService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
  ) {
    this.bloodSampling = this.dynamicDialogConfig.data['bloodSampling'];
  }

  ngOnInit() {
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  confirmExit(): boolean | Observable<boolean> {
    return this.bloodSamplingForm.dirty;
  }

  saveBloodSampling() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.bloodSamplingService.saveBloodSampling(this.bloodSampling).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.dynamicDialogRef.close();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteBloodSampling() {

    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.bloodSamplingService.deleteBloodSampling(this.bloodSampling.id).subscribe({
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

  lockedRecord() {
    // Νέα εγγραφή - όχι κλειδωμένη
    if (!this.bloodSampling.id) {
      return false;
    }
    
    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.bloodSampling.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
  // Επιλογή Εξετάσεων----------------------------------------------------------------------------------
  selectedExaminationTypes = [];
  openDialog() {
    const examinationTypeListDialog = this.dialogService.open(ExaminationTypeListDialogComponent, {
      data: {
        hearingId: null,
        inmateId: null
      },
      header: this.translate.instant('bloodSamplingExamination.dialogTitle'),
      width: '90%'
    });

    examinationTypeListDialog.onClose.subscribe(result => {
      this.selectedExaminationTypes = [];
      if (result) {
        result.filter(examinationType => {
          this.selectedExaminationTypes.push(examinationType);

        });
      }
      this.selectedExaminationTypes.forEach(examinationType => {
        let examination = new Examination();
        examination.examinationTypeId = examinationType.id;
        examination.examinationType.description = examinationType.description;
        this.bloodSampling.examinations.push(examination);
      });
    });
  }

  deleteExamination(index, id) {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        if (!id) {
          this.bloodSampling.examinations.splice(index, 1);
        }
        else {
          this.toitsuToasterService.clearMessages();
          this.toitsuBlockUiService.blockUi();
          this.examinationService.deleteExamination(id).subscribe({
            next: (responseData) => {
              this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
              this.bloodSampling.examinations.splice(index, 1);
            },
            error: (responseError) => {
              this.toitsuToasterService.apiValidationErrors(responseError);
            }
          }).add(() => {
            this.toitsuBlockUiService.unblockUi();
          });
        }
      }
    });
  }
  cancel() {
    if (this.bloodSamplingForm.dirty) {
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
}
