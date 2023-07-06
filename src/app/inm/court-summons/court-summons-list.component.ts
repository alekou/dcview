import {Component, ViewChild} from '@angular/core';
import {courtSummonsConsts} from './court-summons.consts';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-court-summons-list',
  templateUrl: 'court-summons-list.component.html'
})
export class CourtSummonsListComponent {
  url = courtSummonsConsts.indexUrl;
  inmatesUrl = inmateConsts.lastRecordIndexUrl;
  inmates = [];
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'summonsNo', header: this.translate.instant('courtSummons.summonsNo'), sortField: 'summonsNo', width: '10rem'},
    {field: 'summonsDate', header: this.translate.instant('courtSummons.summonsDate'), sortField: 'summonsDate', width: '8rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('courtSummons.inmateId'), sortField: 'inmateFullName', width: '15rem'},
    {field: 'courthouseName', header: this.translate.instant('courtSummons.courthouseId'), sortField: 'inm/QCourthouse.courthouse.name', width: '15rem'},
    {field: 'courtDate', header: this.translate.instant('courtSummons.courtDate'), sortField: 'courtDate', width: '8rem', align: 'center'},
    {field: 'deliveryStatusLabel', header: this.translate.instant('courtSummons.deliveryStatus'), sortField: 'deliveryStatus', width: '10rem', align: 'center'}
  ];

  exportModel = new ExportModel(this.translate.instant('inm.courtSummons'), 'courtSummonsController', 'courtSummonsIndex', 'inm.args.CourtSummonsArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'summonsDate',
    sortOrder: -1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/courtsummons/view';
  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService) {
  }
  
  initializeArgs() {
    return {
      summonsNo: null,
      summonsDateAfter: null,
      summonsDateBefore: null,
      courtDateAfter: null,
      courtDateBefore: null,
      inmateId: null,
      inmateCode: null,
      courthouseId: null
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
