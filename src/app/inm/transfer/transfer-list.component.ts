import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {TransferTypeService} from '../../sa/transfer-type/transfer-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {transferConsts} from './transfer.consts';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-transfer-list',
  templateUrl: 'transfer-list.component.html'
})
export class TransferListComponent implements OnInit {
  
  url = transferConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('transfer.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'transferTypeDescription', header: this.translate.instant('transfer.transferTypeId'), sortField: 'inm/QTransferType.transferType.description', width: '10rem'},
    {field: 'moveDate', header: this.translate.instant('transfer.moveDate'), sortField: 'moveDate', width: '8rem', align: 'center'},
    {field: 'calcDestination', header: this.translate.instant('transfer.list.toDestination'), sortField: 'calcDestination', width: '15rem'},
    {field: 'courtDate', header: this.translate.instant('transfer.courtDate'), sortField: 'courtDate', width: '8rem', align: 'center'},
    {field: 'orderNo', header: this.translate.instant('transfer.orderNo'), sortField: 'orderNo', width: '8rem'},
    {field: 'exitedLabel', header: this.translate.instant('transfer.exited'), sortField: 'exited', width: '6rem', align: 'center'},
    {field: 'exitDate', header: this.translate.instant('transfer.list.exitDate'), sortField: 'exitDate', width: '8rem', align: 'center'},
    {field: 'receivedLabel', header: this.translate.instant('transfer.received'), sortField: 'received', width: '6rem', align: 'center'},
    {field: 'receiveDate', header: this.translate.instant('transfer.list.receiveDate'), sortField: 'receiveDate', width: '8rem', align: 'center'},
    {field: 'returnedLabel', header: this.translate.instant('transfer.returned'), sortField: 'returned', width: '6rem', align: 'center'},
    {field: 'returnDate', header: this.translate.instant('transfer.list.returnDate'), sortField: 'returnDate', width: '8rem', align: 'center'},
    {field: 'cancelledLabel', header: this.translate.instant('transfer.cancelled'), sortField: 'cancelled', width: '6rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'moveDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.transfer'), 'transferController', 'transferIndex', 'inm.args.TransferArgs');
  
  viewLink = '/inm/transfer/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  inmateDialogUrl: string;
  transferTypes = [];
  transportStatuses = [];
  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private transferTypeService: TransferTypeService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.transferTypeService.getActiveTransferTypesByUserDc([]).subscribe(responseData => {
      this.transferTypes = responseData;
    });
    this.enumService.getEnumValues('inm.core.enums.option.TransferStatusOption').subscribe(responseData => {
      this.transportStatuses = responseData;
    });
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      inmateId: null,
      inmateCode: null,
      transferTypeIds: [],
      status: null,
      moveDateAfter: null,
      moveDateBefore: null,
      courtDateAfter: null,
      courtDateBefore: null,
      expected: null,
      toBeReturned: null,
      cancelled: null,
      cancelDateAfter: null,
      cancelDateBefore: null
    };
  }
  
  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }
  
  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
