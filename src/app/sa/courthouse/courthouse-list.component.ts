import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {courthouseConsts} from './courthouse.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {CityService} from '../city/city.service';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-courthouse-list',
  templateUrl: 'courthouse-list.component.html'
})
export class CourthouseListComponent implements OnInit{
  url = courthouseConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'name', header: this.translate.instant('courthouse.name'), sortField: 'name', width: '15rem'},
    {field: 'category', header: this.translate.instant('courthouse.categoryPid'), sortField: 'cm/QGenParameter.category.description', width: '12rem', align: 'center'},
    {field: 'kind', header: this.translate.instant('courthouse.kindPid'), sortField: 'cm/QGenParameter.kind.description', width: '12rem', align: 'center'},
    {field: 'type', header: this.translate.instant('courthouse.typePid'), sortField: 'cm/QGenParameter.type.description', width: '12rem', align: 'center'},
    {field: 'cityName', header: this.translate.instant('courthouse.cityId'), sortField: 'cm/QCity.city.nameGreek', width: '12rem', align: 'center'}
  ];
  exportModel = new ExportModel(this.translate.instant('sa.courthouse'), 'courthouseController', 'courthouseIndex', 'inm.args.CourthouseArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'name',
    sortOrder: 1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  pCategory = {};
  pKind = {};
  yesNoEnums = [];
  cities = [];
  
  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/sa/courthouse/view';
  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private genParameterTypeService: GenParameterTypeService,
              private enumService: EnumService,
              private cityService: CityService) {
  }

  ngOnInit(): void {
    // Categories
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_Category, []).subscribe(responseData => {
      this.pCategory = responseData;
    });

    // Kinds
    this.genParameterTypeService.getByCategory(GenParameterCategory.Courthouse_Kind, []).subscribe(responseData => {
      this.pKind = responseData;
    });

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });

    // Cities
    this.cityService.getGreekCities(true, []).subscribe({
      next: (responseData) => {this.cities = responseData;
      }
    });
  }

  initializeArgs() {
    return {
      isActive: 'YES'
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
    this.args.isActive = 'NO';
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
