import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {hospitalConsts} from './hospital.consts';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-hospital-list',
  templateUrl: 'hospital-list.component.html'
})
export class HospitalListComponent {
  
  url = hospitalConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'name', header: this.translate.instant('hospital.name'), sortField: 'name', width: '19rem'},
    {field: 'hospitalCity', header: this.translate.instant('hospital.cityPid'), sortField: 'cm/QGenParameter.hospitalCity.description', width: '13rem', align: 'center'},
    {field: 'address', header: this.translate.instant('hospital.address'), sortField: 'address', width: '14rem', align: 'center'},
    {field: 'telephone', header: this.translate.instant('hospital.telephone'), sortField: 'telephone', width: '10rem', align: 'center'},
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
  
  exportModel = new ExportModel(this.translate.instant('sa.hospital'), 'hospitalController', 'hospitalIndex', 'inm.args.HospitalArgs');
  
  viewLink = '/sa/hospital/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
  ) {}
  
  initializeArgs() {
    return {
      name : null
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
