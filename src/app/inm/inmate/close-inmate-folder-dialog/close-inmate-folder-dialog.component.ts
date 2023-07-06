import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {InmateService} from '../inmate.service';
import {ClassificationService} from '../../../sa/classification/classification.service';

@Component({
  selector: 'app-inm-close-inmate-folder-dialog',
  templateUrl: 'close-inmate-folder-dialog.component.html'
})
export class CloseInmateFolderDialogComponent {
  
  data = {
    inmateId: null,
    folderClosingDate: null,
    folderClosingClassificationId: null,
    folderClosingComments: null,
  };
  
  closingFolderClassifications = [];
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private inmateService: InmateService,
    private classificationService: ClassificationService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    
    // Αν δεν έχει δοθεί ως παράμετρος στο dialog η λίστα κατατάξεων κλεσίματος φακέλου, τότε γίνεται εδώ η ανάκτησή τους
    if (this.dynamicDialogConfig.data['closingRecordClassifications']) {
      this.closingFolderClassifications = this.dynamicDialogConfig.data['closingFolderClassifications'];
    }
    else {
      this.classificationService.getActiveClassificationsByTypeOption('CLOSING_FOLDER', []).subscribe(responseData => {
        this.closingFolderClassifications = responseData;
      });
    }
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateService.closeInmateFolder(this.data).subscribe({
      next: (responseData) => {
        if (responseData['inmateRecordClosed']) {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('inmate.folder.close.successAndClosedRecord'));
        }
        else {
          this.toitsuToasterService.showSuccessStay(this.translate.instant('inmate.folder.close.success'));
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
