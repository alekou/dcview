import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {InmateRecordService} from '../inmate-record.service';
import {ClassificationService} from '../../../sa/classification/classification.service';

@Component({
  selector: 'app-inm-close-inmate-record-dialog',
  templateUrl: 'close-inmate-record-dialog.component.html'
})
export class CloseInmateRecordDialogComponent {
  
  data = {
    inmateId: null,
    exitDate: null,
    closingClassificationId: null,
    closingComments: null,
    clearInmateArea: false
  };
  
  temporaryRecordExistsInDifferentDc = false;
  closingRecordClassifications = [];
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private inmateRecordService: InmateRecordService,
    private classificationService: ClassificationService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    this.temporaryRecordExistsInDifferentDc = this.dynamicDialogConfig.data['temporaryRecordExistsInDifferentDc'];
    
    // Αν δεν έχει δοθεί ως παράμετρος στο dialog η λίστα κατατάξεων κλεσίματος κράτησης, τότε γίνεται εδώ η ανάκτησή τους
    if (this.dynamicDialogConfig.data['closingRecordClassifications']) {
      this.closingRecordClassifications = this.dynamicDialogConfig.data['closingRecordClassifications'];
    }
    else {
      this.classificationService.getActiveClassificationsByTypeOption('CLOSING_RECORD', []).subscribe(responseData => {
        this.closingRecordClassifications = responseData;
      });
    }
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateRecordService.closeInmateRecord(this.data).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateRecord.close.success'));
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
