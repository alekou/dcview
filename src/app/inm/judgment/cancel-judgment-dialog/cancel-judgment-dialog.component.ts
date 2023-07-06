import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {JudgmentService} from '../judgment.service';

@Component({
  selector: 'app-inm-cancel-judgment-dialog',
  templateUrl: 'cancel-judgment-dialog.component.html'
})
export class CancelJudgmentDialogComponent {
  
  data = {
    inmateId: null,
    judgmentIdToCancel: null,
    cancelComments: null,
    relatedJudgmentId: null,
    cancelCurrentJudgmentAction: 'SET_NEW_CURRENT',
    newCurrentJudgmentId: null,
    folderClosingDate: null,
    folderClosingClassificationId: null,
    folderClosingComments: null
  };
  
  willCancelCurrentJudgment = false;
  
  candidateJudgmentsToSetAsRelated = [];
  candidateJudgmentsToSetCurrent = [];
  closingFolderClassifications = [];
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private judgmentService: JudgmentService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.data.judgmentIdToCancel = this.dynamicDialogConfig.data['judgmentIdToCancel'];
    this.willCancelCurrentJudgment = this.dynamicDialogConfig.data['willCancelCurrentJudgment'];
    this.candidateJudgmentsToSetAsRelated = this.dynamicDialogConfig.data['candidateJudgmentsToSetAsRelated'];
    this.candidateJudgmentsToSetCurrent = this.dynamicDialogConfig.data['candidateJudgmentsToSetCurrent'];
    this.closingFolderClassifications = this.dynamicDialogConfig.data['closingFolderClassifications'];
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.judgmentService.cancelJudgment(this.data).subscribe({
      next: (responseData) => {
        if (responseData['action'] === 'SET_NEW_CURRENT') {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.cancel.success.setNewCurrent'));
        }
        else if (responseData['action'] === 'CLOSE_INMATE_FOLDER') {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.cancel.success.closedInmateFolder'));
        }
        else {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.cancel.success'));
        }
        this.dynamicDialogRef.close(true);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
  
  cancel() {
    this.toitsuToasterService.clearMessages();
    this.dynamicDialogRef.close();
  }
}
