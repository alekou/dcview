import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuNavService} from '../../toitsu-layout/toitsu-nav/toitsu-nav.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {AuthService} from '../../toitsu-auth/auth.service';
import {TransferService} from './transfer.service';
import {EnumService} from '../../cm/enum/enum.service';
import {DetentionCenterService} from '../../sa/detention-center/detention-center.service';
import {CompleteTransferWithInabilityDialogComponent} from './complete-transfer-with-inability-dialog/complete-transfer-with-inability-dialog.component';
import {transferConsts} from './transfer.consts';

@Component({
  selector: 'app-inm-transfer-in-progress',
  templateUrl: 'transfer-in-progress.component.html'
})
export class TransferInProgressComponent implements OnInit {
  
  url = transferConsts.inProgressIndexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'actions', width: '7rem', align: 'center', customCell: 'cell1'},
    {field: 'inmateFullName', header: this.translate.instant('transfer.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'moveDate', header: this.translate.instant('transfer.moveDate'), sortField: 'moveDate', width: '8rem', align: 'center'},
    {field: 'fromDcName', header: this.translate.instant('transfer.inProgress.fromDcName'), sortField: 'inm/QDetentionCenter.fromDc.name', width: '15rem'},
    {field: 'toDcName', header: this.translate.instant('transfer.inProgress.toDcName'), sortField: 'inm/QDetentionCenter.toDc.name', width: '15rem'},
    {field: 'temporaryLabel', header: this.translate.instant('transfer.inProgress.temporary'), sortField: 'inm/QTransferType.transferType.temporary', width: '7rem', align: 'center'}
  ];
  
  paging = {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'moveDate',
    sortOrder: -1
  };
  
  args = this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('inm.transfer.inProgress.title'), 'transferController', 'transferInProgressIndex', 'inm.args.TransferInProgressArgs');
  @ViewChild('table') table: ToitsuTableComponent;
  
  origins = [];
  detentionCenters = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuNavService: ToitsuNavService,
    public authService: AuthService,
    private transferService: TransferService,
    private enumService: EnumService,
    private detentionCenterService: DetentionCenterService
  ) {}
  
  ngOnInit() {
    // Get the lists
    this.enumService.getEnumValues('inm.core.enums.option.TransferInProgressOriginOption').subscribe(responseData => {
      this.origins = responseData;
      if (this.authService.isMinistry()) {
        this.args.origin = 'ALL';
      }
      else {
        this.args.origin = 'EXPECTING';
      }
    });
    this.detentionCenterService.getOtherDetentionCenters([]).subscribe(responseData => {
      this.detentionCenters = responseData;
    });
  }
  
  initializeArgs() {
    return {
      origin: null,
      otherDcId: null
    };
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }
  
  completeTransferInProgressWithOpen(transferId, inmateId) {
    this.confirmationService.confirm({
      message: this.translate.instant('transfer.inProgress.complete.open.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        let completeData = {
          transferId: transferId,
          newInmateRecordStatus: 'OPEN'
        };
        
        this.transferService.completeTransferInProgress(completeData).subscribe({
          next: (responseData) => {
            // Γίνεται μετάβαση στο φάκελο του κρατουμένου
            this.router.navigate(['/inm/inmate/folder', inmateId]);
            this.toitsuNavService.onMenuStateChange('0');
            this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.complete.success'));
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
  
  openCompleteTransferWithInabilityDialog(transferId, inmateId) {
    this.toitsuToasterService.clearMessages();
    const dialogRef = this.dialogService.open(CompleteTransferWithInabilityDialogComponent, {
      header: this.translate.instant('transfer.inProgress.complete.inability.dialogTitle'),
      width: '40%',
      data: {
        transferId: transferId
      }
    });
    
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        // Γίνεται μετάβαση στο φάκελο του κρατουμένου
        this.router.navigate(['/inm/inmate/folder', inmateId]);
        this.toitsuNavService.onMenuStateChange('0');
      }
    });
  }
  
  completeTransferInProgressWithTemporary(transferId, inmateId) {
    this.confirmationService.confirm({
      message: this.translate.instant('transfer.inProgress.complete.temporary.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        let completeData = {
          transferId: transferId,
          newInmateRecordStatus: 'TEMPORARY'
        };
        
        this.transferService.completeTransferInProgress(completeData).subscribe({
          next: (responseData) => {
            // Γίνεται μετάβαση στο φάκελο του κρατουμένου
            this.router.navigate(['/inm/inmate/folder', inmateId]);
            this.toitsuNavService.onMenuStateChange('0');
            this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.complete.success'));
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
  
  cancelTransferInProgress(transferId, inmateId) {
    this.confirmationService.confirm({
      message: this.translate.instant('transfer.inProgress.cancel.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.transferService.cancelTransferInProgress(transferId).subscribe({
          next: (responseData) => {
            if (responseData['inmateRecordReopened']) {
              // Αν έχει γίνει επανάνοιγμα κράτησης, γίνεται μετάβαση στο φάκελο του κρατουμένου
              this.router.navigate(['/inm/inmate/folder', inmateId]);
              this.toitsuNavService.onMenuStateChange('0');
              this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.cancel.success.inmateRecordReopened'));
            }
            else {
              this.loadTableData();
              this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.cancel.success'));
            }
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
  
  receiveBackTransferFromTemporary(transferId, inmateId) {
    this.confirmationService.confirm({
      message: this.translate.instant('transfer.inProgress.receiveBackFromTemporary.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();
        
        this.transferService.receiveBackTransferFromTemporary(transferId).subscribe({
          next: (responseData) => {
            // Γίνεται μετάβαση στο φάκελο του κρατουμένου
            this.router.navigate(['/inm/inmate/folder', inmateId]);
            this.toitsuNavService.onMenuStateChange('0');
            this.toitsuToasterService.showSuccessStay(this.translate.instant('transfer.inProgress.receiveBackFromTemporary.success'));
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
}
