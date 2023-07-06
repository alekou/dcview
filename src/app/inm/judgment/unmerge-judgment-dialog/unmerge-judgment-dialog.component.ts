import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {JudgmentService} from '../judgment.service';

@Component({
  selector: 'app-inm-unmerge-judgment-dialog',
  templateUrl: 'unmerge-judgment-dialog.component.html'
})
export class UnmergeJudgmentDialogComponent {
  
  data = {
    inmateId: null,
    judgmentIdToUnmerge: null,
    newCurrentJudgmentId: null,
    beneficialCalculationMoveMap: {}
  };
  
  willUnmergeCurrentJudgment = false;
  mergedJudgmentsHavingThisAsRelated = [];
  mergingJudgmentBeneficialCalculation: 0;
  mergingJudgmentBeneficialCalculationText: null;
  
  beneficialCalculationSplitMoveMap: {};
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private judgmentService: JudgmentService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.data.judgmentIdToUnmerge = this.dynamicDialogConfig.data['judgmentIdToUnmerge'];
    this.willUnmergeCurrentJudgment = this.dynamicDialogConfig.data['willUnmergeCurrentJudgment'];
    this.mergedJudgmentsHavingThisAsRelated = this.dynamicDialogConfig.data['mergedJudgmentsHavingThisAsRelated'];
    this.mergingJudgmentBeneficialCalculation = this.dynamicDialogConfig.data['mergingJudgmentBeneficialCalculation'];
    this.mergingJudgmentBeneficialCalculationText = this.dynamicDialogConfig.data['mergingJudgmentBeneficialCalculationText'];
    
    this.beneficialCalculationSplitMoveMap = {};
    for (let mergedJudgment of this.mergedJudgmentsHavingThisAsRelated) {
      this.beneficialCalculationSplitMoveMap[mergedJudgment.id] = {integerPart: 0, numeratorPart: 0};
    }
  }
  
  newCurrentJudgmentIdChanged() {
    for (let judgmentId of Object.keys(this.beneficialCalculationSplitMoveMap)) {
      if (Number(judgmentId) === this.data.newCurrentJudgmentId) {
        let integerPart = Math.trunc(this.mergingJudgmentBeneficialCalculation);
        let decimalPart = this.mergingJudgmentBeneficialCalculation - integerPart;
        let numeratorPart = 0;
        if (decimalPart >= 0.25 && decimalPart < 0.5) {
          numeratorPart = 1;
        }
        else if (decimalPart >= 0.5 && decimalPart < 0.75) {
          numeratorPart = 2;
        }
        else if (decimalPart >= 0.75 && decimalPart < 1) {
          numeratorPart = 3;
        }
        
        this.beneficialCalculationSplitMoveMap[judgmentId].integerPart = integerPart;
        this.beneficialCalculationSplitMoveMap[judgmentId].numeratorPart = numeratorPart;
      }
      else {
        this.beneficialCalculationSplitMoveMap[judgmentId].integerPart = 0;
        this.beneficialCalculationSplitMoveMap[judgmentId].numeratorPart = 0;
      }
    }
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    
    // Από τα πεδία του ευεργετικού που συμπλήρωσε ο χρήστης για κάθε απόφαση γίνεται η μετατροπή του σε double.
    // Παράλληλα γίνεται άθροισμα του δεδομένου ευεργετικού όλων των αποφάσεων και γίνεται έλεγχος ώστε να μην ξεπερνά τον ευεργετικό της συγχωνευτικής.
    let givenBeneficialCalculationSum = 0;
    
    for (let judgmentId of Object.keys(this.beneficialCalculationSplitMoveMap)) {
      
      let integerPart = this.beneficialCalculationSplitMoveMap[judgmentId].integerPart;
      let numeratorPart = this.beneficialCalculationSplitMoveMap[judgmentId].numeratorPart;
      let beneficialCalculation = integerPart + (numeratorPart / 4);
      
      // Ορισμός του ευεργετικού στα δεδομένα προς επιστροφή
      this.data.beneficialCalculationMoveMap[judgmentId] = beneficialCalculation;
      
      givenBeneficialCalculationSum += beneficialCalculation;
    }
    
    if (givenBeneficialCalculationSum > this.mergingJudgmentBeneficialCalculation) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('judgment.unmerge.error.beneficialCalculationSumToMoveExceeded', {beneficialCalculationText: this.mergingJudgmentBeneficialCalculationText}));
      return;
    }
    
    this.toitsuBlockUiService.blockUi();
    
    this.judgmentService.unmergeJudgment(this.data).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('judgment.unmerge.success'));
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
