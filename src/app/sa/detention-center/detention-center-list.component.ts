import {Component, OnInit, ViewChild} from '@angular/core';
import {detentionCenterConsts} from './detention-center.consts';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-sa-detention-center-list',
  templateUrl: 'detention-center-list.component.html'
})
export class DetentionCenterListComponent implements OnInit {
  
  url = detentionCenterConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'name', header: this.translate.instant('detentionCenter.name'), sortField: 'name', width: '25rem', align: 'center'},
    {field: 'city', header: this.translate.instant('detentionCenter.cityId'), sortField: 'cm/QCity.city.nameGreek', width: '12rem', align: 'center'},
    {field: 'address', header: this.translate.instant('detentionCenter.address'), sortField: 'address', width: '17rem'},
    {field: 'phone', header: this.translate.instant('detentionCenter.phone'), sortField: 'phone', width: '9rem', align: 'center'},
    {field: 'capacity', header: this.translate.instant('detentionCenter.capacity'), sortField: 'capacity', width: '9rem', align: 'center'}
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
  
  exportModel = new ExportModel(this.translate.instant('sa.detentionCenter'), 'detentionCenterController', 'detentionCenterIndex', 'inm.args.DetentionCenterArgs');
  
  viewLink = '/sa/detentioncenter/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  detentionCenters = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    this.clearArgs();
    this.enumService.getEnumValues('inm.core.enums.DcType').subscribe(responseData => {
      this.detentionCenters = responseData;
    });
  }
  
  initializeArgs() {
    if (this.authService.isMinistry()) {
      return {
        name : null,
        dcId : null
      };
    }
    else {
      return {
        name : this.authService.getUserDcName(),
        dcId : null
      }; 
    }
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
