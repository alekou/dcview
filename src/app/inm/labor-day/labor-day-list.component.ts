import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';
import {ProfessionService} from '../../sa/profession/profession.service';
import {laborDayConsts} from './labor-day.consts';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-labor-day-list',
  templateUrl: 'labor-day-list.component.html'
})
export class LaborDayListComponent implements OnInit {
  
  url = laborDayConsts.indexUrl;
  footerUrl = laborDayConsts.indexFooterUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('laborDay.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '15rem'},
    {field: 'professionName', header: this.translate.instant('laborDay.professionId'), sortField: 'inm/QProfession.profession.name', width: '10rem'},
    {field: 'laborDate', header: this.translate.instant('laborDay.list.laborDate'), sortField: 'laborDate', width: '8rem', align: 'center'},
    {field: 'laborDateTo', header: this.translate.instant('laborDay.list.laborDateTo'), sortField: 'laborDateTo', width: '8rem', align: 'center'},
    {field: 'location', header: this.translate.instant('laborDay.locationPid'), sortField: 'cm/QGenParameter.location.description', width: '12rem'},
    {field: 'presenceLabel', header: this.translate.instant('laborDay.presence'), sortField: 'presence', width: '6rem', align: 'center'},
    {field: 'factorString', header: this.translate.instant('laborDay.factor'), sortField: 'factor', width: '8rem', align: 'center'},
    {field: 'workDays', header: this.translate.instant('laborDay.workDays'), sortField: 'workDays', width: '8rem', align: 'center', footer: true},
    {field: 'beneficialCalculation', header: this.translate.instant('laborDay.list.beneficialCalculation'), width: '8rem', align: 'center', footer: true},
    {field: 'approvedLabel', header: this.translate.instant('laborDay.approved'), sortField: 'approved', width: '6rem', align: 'center'},
    {field: 'censusLabel', header: this.translate.instant('laborDay.census'), sortField: 'census', width: '6rem', align: 'center'},
    {field: 'retractiveLabel', header: this.translate.instant('laborDay.retractive'), sortField: 'retractive', width: '6rem', align: 'center'},
    {field: 'creationDate', header: this.translate.instant('laborDay.creationDate'), sortField: 'creationDate', width: '8rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'laborDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.laborDay'), 'laborDayController', 'laborDayIndex', 'inm.args.LaborDayArgs');
  
  viewLink = '/inm/laborday/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  inmateDialogUrl: string;
  laborDayCategories = [];
  professions = [];
  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,
    private professionService: ProfessionService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.enumService.getEnumValues('inm.core.enums.option.LaborDayCategoryOption').subscribe(responseData => {
      this.laborDayCategories = responseData;
    });
    this.professionService.getActiveProfessionsByUserDc().subscribe(responseData => {
      this.professions = responseData;
    });
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      inmateId: null,
      inmateCode: null,
      laborDateAfter: null,
      laborDateBefore: null,
      laborDateToAfter: null,
      laborDateToBefore: null,
      category: null,
      professionId: null,
      presence: null,
      linkedToProtocol: null,
      approved: null
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
