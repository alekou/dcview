import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {eventRecordConsts} from './event-record.consts';
import {EnumService} from '../../cm/enum/enum.service';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-event-record-list',
  templateUrl: 'event-record-list.component.html',
})
export class EventRecordListComponent implements OnInit{

  url = eventRecordConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'eventType', header: this.translate.instant('eventRecord.list.type'), sortField: 'cm/QGenParameter.eventType.description', width: '13rem', align: 'center'},
    {field: 'description', header: this.translate.instant('eventRecord.description'), sortField: 'description', width: '15rem'},
    {field: 'eventStartDate', header: this.translate.instant('eventRecord.eventStartDate'), sortField: 'eventStartDate', width: '11rem', align: 'center'},
    {field: 'eventEndDate', header: this.translate.instant('eventRecord.eventEndDate'), sortField: 'eventEndDate', width: '11rem', align: 'center'},
    {field: 'daProtocolNo', header: this.translate.instant('eventRecord.daProtocolNo'), sortField: 'daProtocolNo', width: '11em', align: 'center'},
    {field: 'daProtocolDate', header: this.translate.instant('eventRecord.daProtocolDate'), sortField: 'daProtocolDate', width: '9rem', align: 'center'},
    {field: 'hasDisciplinaryControlLabel', header: this.translate.instant('eventRecord.hasDisciplinaryControl'), sortField: 'hasDisciplinaryControl', width: '9rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'eventStartDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.eventRecord'), 'eventRecordController', 'eventRecordIndex', 'inm.args.EventRecordArgs');

  viewLink = '/inm/eventrecord/view';

  @ViewChild('table') table: ToitsuTableComponent;
  
  pEventType = {};
  pEventPlace = {};
  yesNoEnums = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private genParameterTypeService: GenParameterTypeService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    this.genParameterTypeService.getByCategory(GenParameterCategory.Event_Type, []).subscribe(responseData => {
      this.pEventType = responseData;
    });
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Event_Place, []).subscribe(responseData => {
      this.pEventPlace = responseData;
    });
    
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      eventTypePid: null,
      eventPlacePid: null,
      eventStartDateAfter: null,
      eventStartDateBefore: null,
      eventEndDateAfter: null,
      eventEndDateBefore: null,
      description: null,
      daProtocolNo: null,
      daProtocolDateAfter: null,
      daProtocolDateBefore: null,
      hasDisciplinaryControl: null
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
