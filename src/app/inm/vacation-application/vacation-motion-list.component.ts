import {Component, OnInit, ViewChild} from '@angular/core';
import {vacationApplicationConsts} from './vacation-application.consts';
import {VacationApplication} from './vacation-application.model';
import {NgForm} from '@angular/forms';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-vacation-motion-list',
  templateUrl: 'vacation-motion-list.component.html'
})
export class VacationMotionListComponent implements OnInit {

  url = vacationApplicationConsts.indexUrl;
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'protocolNo', header: this.translate.instant('vacation.protocolNo'), sortField: 'protocolNo', width: '7rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('vacation.inmateFullName'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'vacationTypeDescription', header: this.translate.instant('vacation.vacationTypeId'), sortField: 'inm/QVacationType.vacationType.description', width: '10rem', align: 'center'},
    {field: 'applicationDate', header: this.translate.instant('vacationApplication.applicationDate'), sortField: 'applicationDate', width: '10rem', align: 'center'},
    {field: 'motionProgressDate', header: this.translate.instant('vacationMotion.motionProgressDate'), sortField: 'motionProgressDate', width: '10rem', align: 'center'},
    {field: 'destination', header: this.translate.instant('vacationApplication.destination'), sortField: 'destination', width: '10rem', align: 'center'},
    {field: 'reason', header: this.translate.instant('vacationApplication.reason'), sortField: 'reason', width: '10rem', align: 'center'},
    {field: 'applicationStatusLabel', header: this.translate.instant('vacationMotion.list.vacationApplicationStatus'), sortField: 'applicationStatus', width: '10rem', align: 'center'},
    {field: 'approvalStatusLabel', header: this.translate.instant('vacationMotion.list.vacationApprovalStatus'), sortField: 'approvalStatus', width: '10rem', align: 'center'}
  ];
  
  inmateDialogUrl: string;
  vacationApplication: VacationApplication;
  vacationTypes = [];
  motionStatuses = [];
  applicationStatuses = [];
  approvalStatuses = [];
  @ViewChild(NgForm) vacationMotionForm: NgForm;
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'applicationDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.vacationApplication'), 'vacationApplicationController', 'vacationApplicationIndex', 'inm.args.VacationApplicationArgs');

  viewLink = '/inm/vacationapplication/motion/view';

  @ViewChild('table') table: ToitsuTableComponent;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private vacationTypeService: VacationTypeService,
    private enumService: EnumService,
  ) {}

  initializeArgs() {
      return {
        inmateCode: null,
        inmateLastName: null,
        inmateFirstName: null,
        protocolNo: null,
        applicationDateAfter: null,
        applicationDateBefore: null,
        motionStatus: null,
        applicationStatus: null,
        approvalStatus: null,
        origin: 'MOTION'
      };
  }
  
  ngOnInit(): void {

    this.vacationTypeService.getActiveVacationTypesByUserDc().subscribe(responseData => {
      if (responseData) {
        this.vacationTypes = responseData;
      }
    });

    this.enumService.getEnumValues('inm.core.enums.option.VacationMotionStatusOption').subscribe(responseDate => {
      this.motionStatuses = responseDate;
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApplicationStatus').subscribe(responseData => {
      this.applicationStatuses = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.VacationApprovalStatus').subscribe(responseData => {
      this.approvalStatuses = responseData;
    });
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
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
