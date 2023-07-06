import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {JudgmentService} from '../judgment.service';

@Component({
  selector: 'app-inm-merge-judgments-dialog',
  templateUrl: 'merge-judgments-dialog.component.html'
})
export class MergeJudgmentsDialogComponent {
  
  data = {
    inmateId: null,
    judgmentIdsToMerge: [],
    sortField: null,
    orderNo: null,
    orderDate: null,
    type: null,
    judgmentNo: null,
    judgmentDate: null,
    categoryPid: null,
    factPid: null,
    sentencePid: null
  };
  
  candidateJudgmentsToMerge = [];
  
  judgmentTypes = [];
  pJudgmentCategory = {};
  pFact = {};
  pSentence = {};
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private judgmentService: JudgmentService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.candidateJudgmentsToMerge = this.dynamicDialogConfig.data['candidateJudgmentsToMerge'];
    this.judgmentTypes = this.dynamicDialogConfig.data['judgmentTypes'];
    this.pJudgmentCategory = this.dynamicDialogConfig.data['pJudgmentCategory'];
    this.pFact = this.dynamicDialogConfig.data['pFact'];
    this.pSentence = this.dynamicDialogConfig.data['pSentence'];
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.judgmentService.mergeJudgments(this.data).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.merge.success'));
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
