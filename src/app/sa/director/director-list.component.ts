import {Component, OnInit, ViewChild} from '@angular/core';
import {directorConsts} from './director.consts';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-sa-director-list',
  templateUrl: 'director-list.component.html'
})
export class DirectorListComponent implements OnInit {
  
  url = directorConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'dcName', header: this.translate.instant('director.dcName'), sortField: 'inm/QDetentionCenter.detentionCenter.name', width: '13rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('director.lastName'), sortField: 'lastName', width: '9rem', align: 'center'},
    {field: 'firstName', header: this.translate.instant('director.firstName'), sortField: 'firstName', width: '9rem', align: 'center'},
    {field: 'fatherName', header: this.translate.instant('director.fatherName'), sortField: 'fatherName', width: '9rem', align: 'center'},
    {field: 'typeLabel', header: this.translate.instant('director.type'), sortField: 'type', width: '12rem', align: 'center'},
    {field: 'isActiveLabel', header: this.translate.instant('director.isActive'), sortField: 'isActive', width: '7rem', align: 'center'},
    {field: 'startDate', header: this.translate.instant('director.startDate'), sortField: 'startDate', width: '8rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('director.endDate'), sortField: 'endDate', width: '8rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'type',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('sa.director'), 'directorController', 'directorIndex', 'inm.args.directorArgs');
  
  viewLink = '/sa/director/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  directorTypes = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
  ) {}
  
  ngOnInit() {
    this.enumService.getEnumValues('inm.core.enums.directorType').subscribe(responseData => {
      this.directorTypes = responseData;
    });
  }
  
  initializeArgs() {
    return {
      dcId: null,
      lastName: null,
      firstName: null,
      fatherName: null,
    };
  }
  
  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
