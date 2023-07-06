import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {examinationConsts} from './examination.consts';
import {Examination} from './examination.model';
import {ExaminationType} from '../examination-type/examination-type.model';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-examination-list',
  templateUrl: 'examination-list.component.html'
})
export class ExaminationListComponent implements OnInit {

  url = examinationConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('examination.inmateId'), sortField: 'inmateFullName', width: '25rem', align: 'center'},
    {field: 'examinationTypeCategory', header: this.translate.instant('examination.examinationTypeCategory'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '25rem', align: 'center'},
    {field: 'examinationDate', header: this.translate.instant('examination.examinationDate'), sortField: 'examinationDate', width: '25rem', align: 'center'},
    {field: 'results', header: this.translate.instant('examination.results'), sortField: 'results', width: '25rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'examinationDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.examination'), 'examinationController', 'examinationIndex', 'med.args.ExaminationArgs');
  viewLink = '/med/examination/view';

  @ViewChild('table') table: ToitsuTableComponent;

  pExaminationTypeCategory = {};
  examination: Examination = new Examination();
  examinationType: ExaminationType = new ExaminationType();
  inmateDialogUrl: string;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Examination_Category, [this.examinationType.categoryPid]).subscribe(responseData => {
      this.pExaminationTypeCategory = responseData;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      fromTestDate: null,
      toTestDate: null,
      examinationTypeCategory: null,
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
