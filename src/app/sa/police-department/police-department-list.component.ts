import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {policeDepartmentConsts} from './police-department.consts';
import {GenParameterCategory} from '../gen-parameter/gen-parameter.category';
import {AuthService} from '../../toitsu-auth/auth.service';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-police-department-list',
  templateUrl: 'police-department-list.component.html'
})
export class PoliceDepartmentListComponent implements OnInit {
  
  url = policeDepartmentConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'name', header: this.translate.instant('policeDepartment.name'), sortField: 'name', width: '19rem'},
    {field: 'city', header: this.translate.instant('policeDepartment.city'), sortField: 'city', width: '12rem', align: 'center'},
    {field: 'address', header: this.translate.instant('policeDepartment.address'), sortField: 'address', width: '14rem', align: 'center'},
    {field: 'telephone', header: this.translate.instant('policeDepartment.telephone'), sortField: 'telephone', width: '10rem', align: 'center'},
    {field: 'policeDepartmentType', header: this.translate.instant('policeDepartment.typePid'), sortField: 'cm/QGenParameter.policeDepartmentType.description', width: '13rem', align: 'center'},
    {field: 'fax1', header: this.translate.instant('policeDepartment.fax1'), sortField: 'fax1', width: '8rem', align: 'center'},
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'name',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('sa.policeDepartment'), 'policeDepartmentController', 'policeDepartmentIndex', 'inm.args.PoliceDepartmentArgs');
  
  viewLink = '/sa/policedepartment/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  pPoliceDepartmentType = {};
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private genParameterTypeService: GenParameterTypeService,
    public authService: AuthService
  ) {}
  
  ngOnInit() {
    this.genParameterTypeService.getByCategory(GenParameterCategory.PoliceDepartment_Type, []).subscribe(responseData => {
      this.pPoliceDepartmentType = responseData;
    });
  }
  
  initializeArgs() {
    return {
      name: null,
      city : null,
      typePid : null
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
