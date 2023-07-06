import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {notificationConsts} from './notification.consts';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {NotificationService} from './notification.service';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-sa-notification-list',
  templateUrl: 'notification-list.component.html'
})
export class NotificationListComponent implements OnInit {

  url = notificationConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'checkboxes', width: '4rem', align: 'center'},
    {field: 'view', width: '8rem', align: 'center' , customCell: 'cell1'},
    {field: 'notificationDate', header: this.translate.instant('notification.notificationDate'), sortField: 'notificationDate', width: '15rem'},
    {field: 'notificationMessage', header: this.translate.instant('notification.notificationMessage'), sortField: 'notificationMessage', width: '25rem', align: 'center'},
    {field: 'receivedOption', header: this.translate.instant('notification.receivedOption'), sortField: '', width: '12rem', align: 'center'},
    {field: 'receiveDate', header: this.translate.instant('notification.receiveDate'), sortField: '', width: '10rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'notificationDate',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('sa.notification'), 'notificationController', 'notificationIndex', 'cm.args.notificationArgs');
  viewLink = '/sa/notification/view';

  @ViewChild('table') table: ToitsuTableComponent;
  
  yesNoEnumOptions = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
    public authService: AuthService,
    private notificationService: NotificationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {}

  ngOnInit() {
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnumOptions = responseData;
    });
  }

  initializeArgs() {
    return {
      fromDate : null,
      toDate : null,
      received : null
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
  
  markAsReceived() {
    if (this.table.selectedItems.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.toitsuBlockUiService.blockUi();

      let notificationRecipientIds = [];
      this.table.selectedItems.forEach(response => {
        if (response) {
          if (response.received) {
            this.toitsuToasterService.showErrorStay('error.notificationAlreadyReceived');
          }
          else {
            notificationRecipientIds.push(response.notificationRecipientId);
          }
        }
      });
      this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
        next: (responseData: any) => {
          this.toitsuToasterService.showSuccessStay();
          this.loadTableData();
          this.notificationService.getNotificationCountForUser();
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    }
  }
  
  goToEntity(rowData) {
    let notificationRecipientIds = [];
    let entityUrl = this.getRedirectEntityUrl(rowData.entity);
    notificationRecipientIds.push(rowData.notificationRecipientId);
    if (rowData.received) {
      this.router.navigate([entityUrl, rowData.entityId]);
    }
    else {
      this.notificationService.markAllAsReceived(notificationRecipientIds).subscribe( {
        next: (responseData: any) => {
          this.toitsuToasterService.showSuccessStay();
          this.router.navigate([entityUrl, rowData.entityId]);
          this.notificationService.getNotificationCountForUser();
        },
        error: (responseError) => {
          this.toitsuToasterService.apiValidationErrors(responseError);
        }
      }).add(() => {
        this.toitsuBlockUiService.unblockUi();
      });
    }
  }

  getRedirectEntityUrl(entity){
  let url  = '';
  
  switch (entity) {
    
  case 'VACATION': 
    return url = '/inm/vacation/view';
    
  case 'TRANSFER': 
    return url = '/inm/transfer/view';
    
  case 'INMATE': 
    return url = '/inm/inmate/view';
    
  case 'INMATE_FOLDER': 
    return url = '/inm/inmatefolder/view';
    
  case 'TRANSPORT':	
    return url = '/inm/transport/view';
    
  case 'INMATE_LABOR':	
    return url = '/inm/inmatelabor/view';
    
  case 'TREATMENT':	
    return url = '/med/treatment/view';
    
  case 'VACCINATION':	
    return url = '/med/vaccination/view';
  }
  return url;
  }
}
