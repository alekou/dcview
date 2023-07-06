import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {examinationTypeConsts} from './examination-type.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {ExaminationType} from './examination-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';
import {GenParameterType} from '../../sa/gen-parameter-type/gen-parameter-type.model';

@Component({
  selector: 'app-med-examination-type-list',
  templateUrl: 'examination-type-list.component.html'
})
export class ExaminationTypeListComponent implements OnInit {

  url = examinationTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '10rem', align: 'center'},
    {field: 'code', header: this.translate.instant('examinationType.code'), sortField: 'code', width: '15rem', align: 'center'},
    {field: 'category', header: this.translate.instant('examinationType.categoryPid'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '20rem', align: 'center'},
    {field: 'type', header: this.translate.instant('examinationType.type'), sortField: 'type', width: '25rem', align: 'center'},
    {field: 'description', header: this.translate.instant('examinationType.description'), sortField: 'description', width: '25rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'code',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.examinationType'), 'examinationTypeController', 'examinationTypeIndex', 'med.args.ExaminationTypeArgs');
  viewLink = '/med/examinationtype/view';

  @ViewChild('table') table: ToitsuTableComponent;

  pExaminationTypeCategory = {};
  examinationType: ExaminationType = new ExaminationType();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    this.genParameterTypeService.getByCategory(GenParameterCategory.Examination_Category, [this.examinationType.categoryPid]).subscribe((responseData: GenParameterType) => {
      this.pExaminationTypeCategory = responseData;
    });
  }

  initializeArgs() {
    return {
      examinationTypeCategory: null,
      description: null,
      isBloodSampling: null
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
