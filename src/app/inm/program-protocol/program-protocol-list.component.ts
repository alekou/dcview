import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {programProtocolConsts} from './program-protocol.consts';

@Component({
  selector: 'app-inm-program-protocol-list',
  templateUrl: 'program-protocol-list.component.html'
})
export class ProgramProtocolListComponent implements OnInit {

  url = programProtocolConsts.indexUrl;
  yesNoEnums = [];

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'protocolDate', header: this.translate.instant('programProtocol.protocolDate'), sortField: 'protocolDate', width: '8rem', align: 'center'},
    {field: 'startDate', header: this.translate.instant('programProtocol.index.startDate'), sortField: 'inm/QProgram.program.startDate', width: '8rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('programProtocol.index.endDate'), sortField: 'inm/QProgram.program.endDate', width: '8rem', align: 'center'},
    {field: 'approvedLabel', header: this.translate.instant('programProtocol.approved'), sortField: 'approved', width: '8rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('programProtocol.protocolNo'), sortField: 'protocolNo', width: '10rem', align: 'center'},
    {field: 'approvalDate', header: this.translate.instant('programProtocol.approvalDate'), sortField: 'approvalDate', width: '8rem', align: 'center'},
  ];

  exportModel = new ExportModel(this.translate.instant('inm.programProtocol'), 'programProtocolController', 'programProtocolIndex', 'inm.args.ProgramProtocolArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'protocolDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/programprotocol/view';

  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private enumService: EnumService) {
  }

  ngOnInit(): void {
    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

  initializeArgs() {
    return {
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

