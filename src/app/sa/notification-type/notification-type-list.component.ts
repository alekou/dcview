import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {notificationTypeConsts} from './notification-type.consts';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-sa-notification-type-list',
  templateUrl: 'notification-type-list.component.html'
})
export class NotificationTypeListComponent implements OnInit {
  
  url = notificationTypeConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'title', header: this.translate.instant('notificationType.title'), sortField: 'title', width: '15rem'},
    {field: 'query', header: this.translate.instant('notificationType.query'), sortField: 'query', width: '25rem', align: 'center'},
    {field: 'entity', header: this.translate.instant('notificationType.entity'), sortField: 'entity', width: '12rem', align: 'center'},
    {field: 'activeOption', header: this.translate.instant('notificationType.active'), sortField: 'active', width: '8rem', align: 'center'},
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'title',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('sa.notificationType'), 'notificationTypeController', 'notificationTypeIndex', 'cm.args.notificationTypeArgs');
  
  viewLink = '/sa/notificationtype/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  yesNoEnumOptions = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private enumService: EnumService,
  ) {}
  
  ngOnInit() {
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnumOptions = responseData;
    });
  }
  
  initializeArgs() {
    return {
      title : null,
      entity : null,
      active : null
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
