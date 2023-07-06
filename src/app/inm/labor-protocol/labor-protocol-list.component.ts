import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {laborProtocolConsts} from './labor-protocol.consts';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-inm-labor-protocol-list',
  templateUrl: 'labor-protocol-list.component.html'
})
export class LaborProtocolListComponent implements OnInit {
  
  url = laborProtocolConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('laborProtocol.protocolNo'), sortField: 'protocolNo', width: '8rem'},
    {field: 'protocolDate', header: this.translate.instant('laborProtocol.protocolDate'), sortField: 'protocolDate', width: '8rem', align: 'center'},
    {field: 'typeLabel', header: this.translate.instant('laborProtocol.type'), sortField: 'type', width: '12rem'},
    {field: 'professionCategory', header: this.translate.instant('laborProtocol.professionCategoryPid'), sortField: 'cm/QGenParameter.professionCategory.description', width: '14rem'},
    {field: 'startDate', header: this.translate.instant('laborProtocol.startDate'), sortField: 'startDate', width: '8rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('laborProtocol.endDate'), sortField: 'endDate', width: '8rem', align: 'center'},
    {field: 'approvedLabel', header: this.translate.instant('laborProtocol.approved'), sortField: 'approved', width: '6rem', align: 'center'},
    {field: 'approvalDate', header: this.translate.instant('laborProtocol.approvalDate'), sortField: 'approvalDate', width: '8rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'protocolDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.laborProtocol'), 'laborProtocolController', 'laborProtocolIndex', 'inm.args.LaborProtocolArgs');
  
  viewLink = '/inm/laborprotocol/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  laborProtocolTypes = [];
  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    this.enumService.getEnumValues('inm.core.enums.LaborProtocolType').subscribe(responseData => {
      this.laborProtocolTypes = responseData;
    });
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      protocolNo: null,
      protocolDateAfter: null,
      protocolDateBefore: null,
      type: null,
      approved: null,
      approvalDateAfter: null,
      approvalDateBefore: null
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
