import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {shiftConsts} from './shift.consts';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-med-shift-list',
  templateUrl: 'shift-list.component.html'
})
export class ShiftListComponent implements OnInit {

  url = shiftConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'isActiveStatus', header: this.translate.instant('shift.list.isActive'), sortField: 'isActive', width: '6rem', align: 'center'},
    {field: 'name1', header: this.translate.instant('shift.list.name1'), sortField: 'name1', width: '12rem', align: 'center'},
    {field: 'used1Status', header: this.translate.instant('shift.list.used1'), sortField: 'used1', width: '7rem', align: 'center'},
    {field: 'name2', header: this.translate.instant('shift.list.name2'), sortField: 'name2', width: '12rem', align: 'center'},
    {field: 'used2Status', header: this.translate.instant('shift.list.used2'), sortField: 'used2', width: '7rem', align: 'center'},
    {field: 'name3', header: this.translate.instant('shift.list.name3'), sortField: 'name3', width: '12rem', align: 'center'},
    {field: 'used3Status', header: this.translate.instant('shift.list.used3'), sortField: 'used3', width: '7rem', align: 'center'},
    {field: 'name4', header: this.translate.instant('shift.list.name4'), sortField: 'name4', width: '12rem', align: 'center'},
    {field: 'used4Status', header: this.translate.instant('shift.list.used4'), sortField: 'used4', width: '7rem', align: 'center'},
    {field: 'name5', header: this.translate.instant('shift.list.name5'), sortField: 'name5', width: '12rem', align: 'center'},
    {field: 'used5Status', header: this.translate.instant('shift.list.used5'), sortField: 'used5', width: '7rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'isActive',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.shift'), 'shiftController', 'shiftIndex', 'med.args.ShiftArgs');
  viewLink = '/med/shift/view';

  @ViewChild('table') table: ToitsuTableComponent;
  yesNoEnumOptions = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    // yesNoEnumOptions
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnumOptions = responseData;
    });
  }

  initializeArgs() {
    return {
      isActive: null
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
