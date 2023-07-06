import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {JudgmentService} from '../judgment.service';

@Component({
  selector: 'app-inm-revert-cancelled-judgment-dialog',
  templateUrl: 'revert-cancelled-judgment-dialog.component.html'
})
export class RevertCancelledJudgmentDialogComponent {
  
  inmateId = null;
  judgmentIdToRevert = null;
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private judgmentService: JudgmentService
  ) {
    this.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.judgmentIdToRevert = this.dynamicDialogConfig.data['judgmentIdToRevert'];
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.judgmentService.revertCancelledJudgment(this.inmateId, this.judgmentIdToRevert).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.revertCancelled.success'));
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
