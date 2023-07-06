import {Component, OnInit, ViewChild} from '@angular/core';
import {visitTypeConsts} from './visit-type.consts';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-sa-visit-type-list',
  templateUrl: 'visit-type-list.component.html'
})
export class VisitTypeListComponent implements OnInit {
  
  url = visitTypeConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'description', header: this.translate.instant('visitType.description'), sortField: 'description', width: '20rem', align: 'center'},
    {field: 'kindLabel', header: this.translate.instant('visitType.kind'), sortField: 'kind', width: '10rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'description',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('sa.visitType'), 'visitTypeController', 'visitTypeIndex', 'inm.args.VisitTypeArgs');
  
  viewLink = '/sa/visittype/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  visitTypeKinds = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    this.enumService.getEnumValues('inm.core.enums.VisitTypeKind').subscribe(responseData => {
      this.visitTypeKinds = responseData;
    });
  }
  
  initializeArgs() {
    return {
      dcId : null
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
