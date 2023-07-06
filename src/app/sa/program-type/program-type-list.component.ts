import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {programTypeConsts} from './program-type.consts';
import {GenParameterType} from '../gen-parameter-type/gen-parameter-type.model';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-program-type-list',
  templateUrl: 'program-type-list.component.html'
})
export class ProgramTypeListComponent implements OnInit {
  url = programTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'kindLabel', header: this.translate.instant('programType.kind'), sortField: 'kind', width: '15rem'},
    {
      field: 'category',
      header: this.translate.instant('programType.categoryPid'),
      sortField: 'cm/QGenParameter.category.description',
      width: '12rem',
      align: 'center'
    },
    {
      field: 'description',
      header: this.translate.instant('programType.description'),
      sortField: 'description',
      width: '12rem'
    }
  ];
  exportModel = new ExportModel(this.translate.instant('sa.programType'), 'programTypeController', 'programTypeIndex', 'inm.args.ProgramTypeArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'kind',
    sortOrder: 1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  pCategory: GenParameterType = new GenParameterType();
  kinds = [];
  yesNoEnums = [];
  cities = [];

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/sa/programtype/view';

  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private genParameterTypeService: GenParameterTypeService,
              private enumService: EnumService
  ) {
  }

  ngOnInit(): void {
    
    // Categories
    this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramType_SchoolCategory, []).subscribe((schoolResponseData: GenParameterType) => {
      this.pCategory = schoolResponseData;
      // School Categories
      this.genParameterTypeService.getByCategory(GenParameterCategory.ProgramType_CourseCategory, []).subscribe((courseResponseData: GenParameterType) => {
          courseResponseData.genParameters.forEach((currentValue) => {
            this.pCategory.genParameters.push(currentValue);
          });
      });
    });
    
    // Kind
    this.enumService.getEnumValues('inm.core.enums.ProgramTypeKind').subscribe(responseData => {
      this.kinds = responseData;
    });

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

  initializeArgs() {
    return {};
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.args.isActive = 'NO';
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
