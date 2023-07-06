import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {diseaseConsts} from './disease.consts';
import {inmateConsts} from '../../inm/inmate/inmate.consts';

@Component({
  selector: 'app-med-disease-list',
  templateUrl: 'disease-list.component.html'
})
export class DiseaseListComponent implements OnInit {

  url = diseaseConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('disease.inmateId'), sortField: 'inmateFullName', width: '30rem', align: 'center'},
    {field: 'diseaseTypeDescription', header: this.translate.instant('disease.diseaseTypeId'), sortField: 'med/QDiseaseType.diseaseType.description', width: '35rem', align: 'center'},
    {field: 'diagnosisDate', header: this.translate.instant('disease.diagnosisDate'), sortField: 'diagnosisDate', width: '15rem', align: 'center'},
    {field: 'progression', header: this.translate.instant('disease.progression'), sortField: 'progression', width: '10rem', align: 'center'},
    {field: 'chronicOption', header: this.translate.instant('disease.isChronic'), sortField: 'isChronic', width: '10rem', align: 'center'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'diagnosisDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.disease'), 'diseaseController', 'diseaseIndex', 'med.args.DiseaseArgs');
  viewLink = '/med/disease/view';

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
      diseaseDescription: null,
      fromDiagnosisDate: null,
      toDiagnosisDate: null
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
