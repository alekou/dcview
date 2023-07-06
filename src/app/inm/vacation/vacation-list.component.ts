import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {vacationConsts} from './vacation.consts';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-vacation-list',
  templateUrl: 'vacation-list.component.html'
})
export class VacationListComponent implements OnInit {
  url = vacationConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', width: '4rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('vacation.protocolNo'), sortField: 'protocolNo', width: '7rem', align: 'center'},
    {field: 'recordNo', header: this.translate.instant('vacation.recordNo'), sortField: 'recordNo', width: '7rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('vacation.inmateFullName'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'vacationTypeDescription', header: this.translate.instant('vacation.vacationTypeId'), sortField: 'inm/QVacationType.vacationType.description', width: '10rem', align: 'center'},
    {field: 'fromDate', header: this.translate.instant('vacation.fromDate'), sortField: 'fromDate', width: '12rem', align: 'center'},
    {field: 'toDate', header: this.translate.instant('vacation.toDate'), sortField: 'toDate', width: '12rem', align: 'center'},
    {field: 'expectedReturnDate', header: this.translate.instant('vacation.expectedReturnDate'), sortField: 'expectedReturnDate', width: '15rem', align: 'center'},
    {field: 'returnDate', header: this.translate.instant('vacation.returnDate'), sortField: 'returnDate', width: '15rem', align: 'center'},
    {field: 'approvalStatusLabel', header: this.translate.instant('vacation.approvalStatus'), sortField: 'approvalStatus', width: '15rem', align: 'center'},
    {field: 'presenceFrequencyLabel', header: this.translate.instant('vacation.presenceFrequency'), sortField: 'presenceFrequency', width: '15rem', align: 'center'}
  ];

  inmateDialogUrl: string;
  vacationTypes = [];
  approvalStatuses = [];
  presenceFrequencies = [];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'fromDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.vacation'), 'vacationController', 'vacationIndex', 'inm.args.VacationArgs');

  viewLink = '/inm/vacation/view';

  @ViewChild('table') table: ToitsuTableComponent;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService
  ) {}

  ngOnInit(): void {
    // Get the lists
    
    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.PresenceFrequency').subscribe(responseData => {
      this.presenceFrequencies = responseData;
    });
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }

  initializeArgs() {
    return {
      inmateCode: null,
      inmateLastName: null,
      inmateFirstName: null,
      fromDateAfter: null,
      fromDateBefore: null,
      toDateAfter: null,
      toDateBefore: null,
      expectedReturnDateAfter: null,
      expectedReturnDateBefore: null,
      returnDateAfter: null,
      returnDateBefore: null,
      approvalStatus: null,
      presenceFrequency: null,
      origin: 'COUNCIL'
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
