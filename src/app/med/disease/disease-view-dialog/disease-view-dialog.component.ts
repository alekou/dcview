import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DiseaseService} from '../disease.service';
import {Disease} from '../disease.model';
import {inmateConsts} from '../../../inm/inmate/inmate.consts';
import {DiseaseTypeService} from '../../disease-type/disease-type.service';
import {ConfirmationService} from 'primeng/api';
import {AuthService} from '../../../toitsu-auth/auth.service';
import {NgForm} from '@angular/forms';
import {ToitsuSharedModule} from '../../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../../_general/general-shared.module';

@Component({
  standalone: true,
  imports: [ToitsuSharedModule, GeneralSharedModule],
  selector: 'app-med-disease-view-dialog',
  templateUrl: 'disease-view-dialog.component.html'
})
export class DiseaseViewDialogComponent implements OnInit {

  @ViewChild(NgForm) diseaseForm: NgForm;
  disease: Disease = new Disease();
  inmateDialogUrl: string = inmateConsts.getActiveUrl;
  diseaseTypes = [];
  
  constructor(
    private diseaseTypeService: DiseaseTypeService,
    private diseaseService: DiseaseService,
    public authService: AuthService,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private confirmationService: ConfirmationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {
    this.disease = this.dynamicDialogConfig.data['disease'];
  }
  
  ngOnInit() {
    this.diseaseTypeService.getAllDiseaseTypes().subscribe(diseaseTypes => {
      this.diseaseTypes = diseaseTypes;
    });
  }

  saveDisease() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.diseaseService.saveDisease(this.disease).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.dynamicDialogRef.close(this.disease);
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteDisease() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.diseaseService.deleteDisease(this.disease.id).subscribe({
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
    if (this.diseaseForm.dirty) {
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
    if (!this.disease.id) {
      return false;
    }

    // Εγγραφή άλλου καταστήματος - κλειδωμένη
    if (this.disease.dcId !== this.authService.getUserDcId()) {
      return true;
    }
    return false;
  }
}
