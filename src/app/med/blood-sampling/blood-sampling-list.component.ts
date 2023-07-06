import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {bloodSamplingConsts} from './blood-sampling.consts';
import {inmateConsts} from '../../inm/inmate/inmate.consts';

@Component({
  selector: 'app-med-blood-sampling-list',
  templateUrl: 'blood-sampling-list.component.html'
})
export class BloodSamplingListComponent implements OnInit {

  url = bloodSamplingConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('bloodSampling.inmateId'), sortField: 'inmateFullName', width: '15rem', align: 'center'},
    {field: 'samplingDate', header: this.translate.instant('bloodSampling.samplingDate'), sortField: 'samplingDate', width: '20rem', align: 'center'},
    {field: 'testDate', header: this.translate.instant('bloodSampling.testDate'), sortField: 'testDate', width: '20rem', align: 'center'},
    {field: 'resultDate', header: this.translate.instant('bloodSampling.resultDate'), sortField: 'resultDate', width: '20rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('bloodSampling.comments'), sortField: 'comments', width: '20rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'samplingDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.bloodSampling'), 'bloodSamplingController', 'bloodSamplingIndex', 'med.args.BloodSamplingArgs');
  viewLink = '/med/bloodsampling/view';

  @ViewChild('table') table: ToitsuTableComponent;
  inmateDialogUrl: string;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }

  initializeArgs() {
    return {
      inmateId: null,
      fromSamplingDate: null,
      toSamplingDate: null,
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
