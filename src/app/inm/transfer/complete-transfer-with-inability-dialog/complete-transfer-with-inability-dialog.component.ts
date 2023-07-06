import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {TransferService} from '../transfer.service';
import {GenParameterService} from '../../../sa/gen-parameter/gen-parameter.service';
import {GenParameterCategory} from '../../../sa/gen-parameter/gen-parameter.category';

@Component({
  selector: 'app-inm-complete-transfer-with-inability-dialog',
  templateUrl: 'complete-transfer-with-inability-dialog.component.html'
})
export class CompleteTransferWithInabilityDialogComponent implements OnInit {
  
  transferId = null;
  inabilityReasonPid = null;
  
  detentionInabilityEntryReasons = [];
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private transferService: TransferService,
    private genParameterService: GenParameterService
  ) {
    this.transferId = this.dynamicDialogConfig.data['transferId'];
  }
  
  ngOnInit() {
    // Entry Reasons - code TRANSFER_DETENTION_INABILITY
    this.genParameterService.getByCategoryAndCode(GenParameterCategory.InmateRecord_EntryReason, 'TRANSFER_DETENTION_INABILITY', true, []).subscribe(responseData => {
      this.detentionInabilityEntryReasons = responseData;
    });
  }
  
  confirm() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    let completeData = {
      transferId: this.transferId,
      newInmateRecordStatus: 'INABILITY',
      inabilityReasonPid: this.inabilityReasonPid
    };
    
    this.transferService.completeTransferInProgress(completeData).subscribe({
      next: (responseData) => {
        this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.complete.success'));
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
