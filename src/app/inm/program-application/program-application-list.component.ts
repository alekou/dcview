import {Component, ViewChild} from '@angular/core';
import {programApplicationConsts} from './program-application.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-program-application-list',
  templateUrl: 'program-application-list.component.html'
})
export class ProgramApplicationListComponent {

  url = programApplicationConsts.indexUrl;
  inmatesUrl = inmateConsts.lastRecordIndexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('programApplication.protocolNo'), sortField: 'protocolNo', width: '10rem'},
    {field: 'inmateFullName', header: this.translate.instant('programApplication.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'applicationDate', header: this.translate.instant('programApplication.applicationDate'), sortField: 'applicationDate', width: '8rem', align: 'center'},
    {field: 'program', header: this.translate.instant('programApplication.programId'), sortField: 'inm/QProgram.program.description', width: '10rem'},
    {field: 'professionLabel', header: this.translate.instant('programApplication.professionId'), sortField: 'professionLabel', width: '7rem', align: 'center'},
    {field: 'rejectedLabel', header: this.translate.instant('programApplication.rejected'), sortField: 'rejected', width: '10rem', align: 'center'},
    {field: 'withdrawalLabel', header: this.translate.instant('programApplication.withdrawal'), sortField: 'withdrawal', width: '10rem', align: 'center'},
  ];

  exportModel = new ExportModel(this.translate.instant('inm.programApplication'), 'programApplicationController', 'programApplicationIndex', 'inm.args.ProgramApplicationArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'applicationDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/programapplication/view';

  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService) {
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
