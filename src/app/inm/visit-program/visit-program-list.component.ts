import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';
import {visitProgramConsts} from './visit-program.consts';


@Component({
  selector: 'app-inm-visit-program-list',
  templateUrl: 'visit-program-list.component.html'
})
export class VisitProgramListComponent implements OnInit {
  
  url = visitProgramConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', header: '', width: '4rem', align: 'center'},
    {field: 'extraActions', header: '', sortField: '', width: '4rem', align: 'center'},
    {field: 'visitDayLabel', header: this.translate.instant('visitProgramTimeFrame.day'), sortField: '', width: '10rem'},
    {field: 'description', header: this.translate.instant('visitProgram.description'), sortField: '', width: '10rem'},
    {field: 'fromTime', header: this.translate.instant('visitProgram.list.fromTime'), sortField: '', width: '10rem'},
    {field: 'toTime', header: this.translate.instant('visitProgram.list.toTime'), sortField: '', width: '8rem'},
    {field: 'fromNameInitials', header: this.translate.instant('visitProgram.list.fromNameInitials'), sortField: '', width: '8rem'},
    {field: 'toNameInitials', header: this.translate.instant('visitProgram.list.toNameInitials'), sortField: '', width: '8rem'},
    {field: 'areaFullDescription', header: this.translate.instant('visitProgramTimeFrame.areaId'), sortField: '', width: '8rem'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'id',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.visitor'), 'visitorController', 'visitorIndex', 'inm.args.VisitorArgs');
  
  viewLink = '/inm/visitprogram/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    // YesNoEnums
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      visitDay: null,
      fromTimeAfter: null,
      fromTimeBefore: null,
      toTimeAfter: null,
      toTimeBefore: null,
      areaId: null
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
