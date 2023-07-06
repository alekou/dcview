import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {InmateRecordService} from '../inmate-record.service';

@Component({
  selector: 'app-inm-change-criminal-status-dialog',
  templateUrl: 'change-criminal-status-dialog.component.html'
})
export class ChangeCriminalStatusDialogComponent {
  
  data = {
    inmateId: null,
    oldExitDate: null,
    oldClosingClassificationId: null,
    oldClosingComments: null,
    newCategory: null,
    newCharacterizationPid: null,
    newDurationTypePid: null,
    newDurationPid: null,
    newEntryDate: null,
    newEntryReasonPid: null
  };
  
  closingRecordClassifications = [];
  inmateRecordCategories = [];
  pCharacterization = {};
  pDurationType = {};
  pDuration = {};
  pEntryReason = {};
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private inmateRecordService: InmateRecordService
  ) {
    this.data.inmateId = this.dynamicDialogConfig.data['inmateId'];
    
    this.closingRecordClassifications = this.dynamicDialogConfig.data['closingRecordClassifications'];
    this.pCharacterization = this.dynamicDialogConfig.data['pCharacterization'];
    this.pDurationType = this.dynamicDialogConfig.data['pDurationType'];
    this.pDuration = this.dynamicDialogConfig.data['pDuration'];
    this.pEntryReason = this.dynamicDialogConfig.data['pEntryReason'];
    
    // Οι διαθέσιμες κατηγορίες κράτησης προς επιλογή είναι αυτές που διαφέρουν από αυτή της ανοιχτής κράτησης
    let categoryOfOpenInmateRecordInUserDc = this.dynamicDialogConfig.data['categoryOfOpenInmateRecordInUserDc'];
    this.inmateRecordCategories = this.dynamicDialogConfig.data['inmateRecordCategories'].filter(item => {
      return (item.value !== categoryOfOpenInmateRecordInUserDc);
    });
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    this.inmateRecordService.changeCriminalStatus(this.data).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('inmateRecord.changeCriminalStatus.success'));
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
