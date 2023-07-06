import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {diseaseTypeConsts} from './disease-type.consts';
import {DiseaseType} from './disease-type.model';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-med-disease-type-list',
  templateUrl: 'disease-type-list.component.html'
})
export class DiseaseTypeListComponent implements OnInit {

  url = diseaseTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'code', header: this.translate.instant('diseaseType.code'), sortField: 'code', width: '15rem', align: 'center'},
    {field: 'diseaseTypeCategory', header: this.translate.instant('diseaseType.categoryPid'), sortField: 'cm/QGenParameter.gen-parameter.description', width: '25rem', align: 'center'},
    {field: 'description', header: this.translate.instant('diseaseType.description'), sortField: 'description', width: '35rem', align: 'center'},
    {field: 'contagiousOption', header: this.translate.instant('diseaseType.isContagious'), sortField: 'isContagious', width: '20rem', align: 'center'},
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
  exportModel = new ExportModel(this.translate.instant('med.diseaseType'), 'diseaseTypeController', 'diseaseTypeIndex', 'med.args.DiseaseTypeArgs');
  viewLink = '/med/diseasetype/view';

  @ViewChild('table') table: ToitsuTableComponent;

  pDiseaseTypeCategory = {};
  diseaseType: DiseaseType = new DiseaseType();

  constructor(
    private translate: TranslateService,
    private router: Router,
    private genParameterTypeService: GenParameterTypeService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    this.genParameterTypeService.getByCategory(GenParameterCategory.DiseaseType_Category, [this.diseaseType.categoryPid]).subscribe(responseData => {
      this.pDiseaseTypeCategory = responseData;
    });
  }

  initializeArgs() {
    return {
      code: null,
      description: null,
      diseaseTypeCategory: null
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
