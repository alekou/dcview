import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {JudgmentService} from '../judgment.service';

@Component({
  selector: 'app-inm-move-beneficial-calculation-dialog',
  templateUrl: 'move-beneficial-calculation-dialog.component.html'
})
export class MoveBeneficialCalculationDialogComponent {
  
  data = {
    inmateId: null,
    originJudgmentId: null,
    destinationJudgmentId: null,
    moveAll: true,
    beneficialCalculation: null
  };
  
  candidateJudgmentsToMove = [];
  originJudgmentBeneficialCalculation: 0;
  originJudgmentBeneficialCalculationText: null;
  
  integerPart = 0;
  numeratorPart = 0;
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private judgmentService: JudgmentService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.data.originJudgmentId = this.dynamicDialogConfig.data['originJudgmentId'];
    this.candidateJudgmentsToMove = this.dynamicDialogConfig.data['candidateJudgmentsToMove'];
    this.originJudgmentBeneficialCalculation = this.dynamicDialogConfig.data['originJudgmentBeneficialCalculation'];
    this.originJudgmentBeneficialCalculationText = this.dynamicDialogConfig.data['originJudgmentBeneficialCalculationText'];
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    
    // Από τα πεδία του ευεργετικού που συμπλήρωσε ο χρήστης γίνεται η μετατροπή του σε double.
    // Παράλληλα γίνεται έλεγχος ώστε να μην ξεπερνά τον ευεργετικό της απόφασης προέλευσης.
    this.data.beneficialCalculation = this.integerPart + (this.numeratorPart / 4);
    
    if (this.data.beneficialCalculation > this.originJudgmentBeneficialCalculation) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('judgment.moveBeneficialCalculation.error.originBeneficialCalculationExceeded', {beneficialCalculationText: this.originJudgmentBeneficialCalculationText}));
      return;
    }
    
    this.toitsuBlockUiService.blockUi();
    
    this.judgmentService.moveBeneficialCalculation(this.data).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.moveBeneficialCalculation.success'));
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
