import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ExportModel} from '../../cm/export/export.model';
import {classificationConsts} from './classification.consts';

@Component({
  selector: 'app-sa-classification-list',
  templateUrl: 'classification-list.component.html'
})
export class ClassificationListComponent {
  
  url = classificationConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'description', header: this.translate.instant('classification.description'), sortField: 'description', width: '20rem'},
    {field: 'isClosingRecordLabel', header: this.translate.instant('classification.isClosingRecord'), sortField: 'isClosingRecord', width: '8rem', align: 'center'},
    {field: 'isCrimeLabel', header: this.translate.instant('classification.isCrime'), sortField: 'isCrime', width: '8rem', align: 'center'},
    {field: 'isTransferLabel', header: this.translate.instant('classification.isTransfer'), sortField: 'isTransfer', width: '8rem', align: 'center'},
    {field: 'isClosingFolderLabel', header: this.translate.instant('classification.isClosingFolder'), sortField: 'isClosingFolder', width: '8rem', align: 'center'},
    {field: 'isDeathLabel', header: this.translate.instant('classification.isDeath'), sortField: 'isDeath', width: '8rem', align: 'center'},
    {field: 'isEscapeLabel', header: this.translate.instant('classification.isEscape'), sortField: 'isEscape', width: '8rem', align: 'center'},
    {field: 'isReleaseLabel', header: this.translate.instant('classification.isRelease'), sortField: 'isRelease', width: '8rem', align: 'center'}
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
  
  exportModel = new ExportModel(this.translate.instant('sa.classification'), 'classificationController', 'classificationIndex', 'inm.args.ClassificationArgs');
  
  viewLink = '/sa/classification/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService
  ) {}
  
  initializeArgs() {
    return {
      description : null
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
