import {Component, ViewChild} from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {SelectItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {DateService} from '../../toitsu-shared/date.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {AppLogDisplayJsonDialogComponent} from './app-log-display-json-dialog/app-log-display-json-dialog.component';
import {appLogConsts} from './app-log.consts';

@Component({
  selector: 'app-sa-app-log-list',
  templateUrl: 'app-log-list.component.html'
})
export class AppLogListComponent {
  
  url = appLogConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'level', header: this.translate.instant('appLog.level'), sortField: 'level', width: '10rem', align: 'center'},
    {field: 'loggerName', header: this.translate.instant('appLog.loggerName'), sortField: 'loggerName', width: '30rem'},
    {field: 'message', header: this.translate.instant('appLog.message'), sortField: 'message', width: '40rem'},
    {field: 'date', header: this.translate.instant('appLog.date'), sortField: 'date', width: '10rem', align: 'center'},
    {field: 'thrown', header: this.translate.instant('appLog.thrown'), width: '10rem', align: 'center', customCell: 'cell1'},
    {field: 'contextMap', header: this.translate.instant('appLog.contextMap'), width: '10rem', align: 'center', customCell: 'cell2'}
  ];
  
  sortField = 'date';
  sortOrder = -1;
  
  args = this.initializeArgs();
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  levels: Array<SelectItem>;
  
  constructor(
    private dialogService: DialogService,
    private translate: TranslateService,
    private dateService: DateService
  ) {
    this.levels = [
      {label: 'ERROR', value: 'ERROR'},
      {label: 'WARN', value: 'WARN'},
      {label: 'INFO', value: 'INFO'},
      {label: 'DEBUG', value: 'DEBUG'},
      {label: 'TRACE', value: 'TRACE'}
    ];
  }
  
  initializeArgs() {
    return {
      level: null,
      dateFrom: this.dateService.getCurrentDateString() as unknown as Date,
      dateTo: null,
      loggerName: null,
      message: null,
      thrownClassName: null,
      thrownMethodName: null,
      contextMapUser: null,
      contextMapUrl: null
    };
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
    this.args.dateFrom = null;
  }
  
  openViewFormattedJsonDialog(title, json) {
    this.dialogService.open(AppLogDisplayJsonDialogComponent, {
      data: {
        json: json
      },
      header: title,
      width: '700px'
    });
  }
}
