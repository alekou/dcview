import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {inmateConsts} from '../../../inm/inmate/inmate.consts';
import {ConfirmationService} from 'primeng/api';
import {Examination} from '../examination.model';
import {ExaminationService} from '../examination.service';
import {ExaminationTypeService} from '../../examination-type/examination-type.service';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {NgForm} from '@angular/forms';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-examination-view-dialog',
  templateUrl: 'examination-view-dialog.component.html'
})
export class ExaminationViewDialogComponent implements OnInit {

  @ViewChild(NgForm) examinationForm: NgForm;
  examination: Examination = new Examination();
  inmateDialogUrl: string = inmateConsts.getActiveUrl;
  examinationTypes = [];

  constructor(
    private examinationTypeService: ExaminationTypeService,
    private examinationService: ExaminationService,
    public authService: AuthService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private confirmationService: ConfirmationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {
    this.examination = this.dynamicDialogConfig.data['examination'];
  }

  ngOnInit() {
    this.examinationTypeService.getAllExaminationTypes().subscribe(examinationTypes => {
      this.examinationTypes = examinationTypes;
    });
  }

  saveExamination() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.examinationService.saveExamination(this.examination).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.dynamicDialogRef.close(this.examination);
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteExamination() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.examinationService.deleteExamination(this.examination.id).subscribe({
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
    if (this.examinationForm.dirty) {
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
    if (!this.examination.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.examination.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
}
