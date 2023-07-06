import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {referralConsts} from './referral.consts';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {HospitalService} from '../../sa/hospital/hospital.service';

@Component({
  selector: 'app-med-referral-list',
  templateUrl: 'referral-list.component.html'
})
export class ReferralListComponent implements OnInit {

  url = referralConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('referral.inmateId'), sortField: 'inmateFullName', width: '15rem', align: 'center'},
    {field: 'incident', header: this.translate.instant('referral.incident'), sortField: 'incident', width: '15rem', align: 'center'},
    {field: 'hospitalDescription', header: this.translate.instant('referral.hospitalId'), sortField: 'cm/QHospital.hospital.name', width: '12rem', align: 'center'},
    {field: 'hospitalDepartmentDescription', header: this.translate.instant('referral.hospitalDepartmentId'), sortField: 'cm/QHospitalDepartment.hospitalDepartment.name', width: '12rem', align: 'center'},
    {field: 'transferDate', header: this.translate.instant('referral.transferDate'), sortField: 'transferDate', width: '10rem', align: 'center'},
    {field: 'returnDate', header: this.translate.instant('referral.returnDate'), sortField: 'returnDate', width: '10rem', align: 'center'},
    {field: 'rejectedTransferOption', header: this.translate.instant('referral.rejectedTransfer'), sortField: 'rejectedTransfer', width: '8rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'incident',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.referral'), 'referralController', 'referralIndex', 'med.args.ReferralArgs');
  viewLink = '/med/referral/view';

  @ViewChild('table') table: ToitsuTableComponent;
  yesNoEnumOptions = [];
  inmateDialogUrl: string;
  allHospitals = [];

  constructor(
    private hospitalService: HospitalService,
    private translate: TranslateService,
    private router: Router,
    private enumService: EnumService,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.hospitalService.getActiveHospitals().subscribe(responseData => {
      this.allHospitals = responseData;
    });
    
    // yesNoEnumOptions
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnumOptions = responseData;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      hospitalId: null,
      incident: null,
      fromTransferDate: null,
      toTransferDate: null,
      frequency: null
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
