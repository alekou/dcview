import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {inmateConsts} from '../../inm/inmate/inmate.consts';
import {DoctorService} from '../../sa/doctor/doctor.service';
import {hearingConsts} from './hearing.consts';

@Component({
  selector: 'app-med-hearing-list',
  templateUrl: 'hearing-list.component.html'
})
export class HearingListComponent implements OnInit {

  url = hearingConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'hearingDate', header: this.translate.instant('hearing.hearingDate'), sortField: 'hearingDate', width: '15rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('hearing.inmateId'), sortField: 'inmateFullName', width: '20rem', align: 'center'},
    {field: 'doctorFullName', header: this.translate.instant('hearing.doctorId'), sortField: 'doctorFullName', width: '15rem', align: 'center'},
    {field: 'reviewHearingOption', header: this.translate.instant('hearing.reviewHearing'), sortField: 'reviewHearing', width: '10rem', align: 'center'},
    {field: 'reviewDate', header: this.translate.instant('hearing.reviewDate'), sortField: 'reviewDate', width: '15rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('hearing.comments'), sortField: 'comments', width: '15rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'hearingDate',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.hearing'), 'hearingController', 'hearingIndex', 'med.args.HearingArgs');
  viewLink = '/med/hearing/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  inmateDialogUrl: string;
  allDoctors = [];
  
  constructor(
    private doctorService: DoctorService,
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
  ) {}

  ngOnInit() {
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    // Active Doctors
    this.doctorService.getAllActiveDoctors().subscribe(allDoctors => {
      this.allDoctors = allDoctors;
    });
  }

  initializeArgs() {
    return {
      inmateId: null,
      doctorId: null,
      fromDate: null,
      toDate: null,
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
