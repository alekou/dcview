import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {visitApplicationConsts} from './visit-application.consts';
import {VisitTypeService} from '../../sa/visit-type/visit-type.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-inm-visitor-list',
  templateUrl: 'visit-application-list.component.html'
})
export class VisitApplicationListComponent implements OnInit{
  
  url = visitApplicationConsts.indexUrl;
  
  
  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('visit.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'visitor', header: this.translate.instant('Επισκέπτης'), sortField: 'visitorName', width: '20rem'},
    {field: 'applicationDate', header: this.translate.instant('Ημ/νία αίτησης'), sortField: 'applicationDate', width: '10rem', align: 'center'},
    {field: 'approvedLabel', header: this.translate.instant('Ένδειξη Έγκρισης'), sortField: 'approved', width: '10rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('Παρατηρήσεις'), sortField: 'comments', width: '20rem'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'applicationDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.visitApplication'), 'visitApplicationController', 'visitApplicationIndex', 'inm.args.VisitApplicationArgs');
  
  viewLink = '/inm/visitapplication/view';

  inmates = [];
  inmateDialogUrl: string;
  
  visitApplicationStatuses = [];
  yesNoEnums = [];
  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private enumService: EnumService,
    private visitTypeService: VisitTypeService,
    private inmateService: InmateService
  ) {}

  ngOnInit(): void {

    // Inmates
    this.inmateService.getLastRecordInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;

    // VisitApplicationStatuses
    this.enumService.getEnumValues('inm.core.enums.VisitApplicationStatus').subscribe(responseData => {
      this.visitApplicationStatuses = responseData;
    });

    // Φόρτωση λιστών
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption')
      .subscribe(responseData => {
        this.yesNoEnums = responseData;
      });
  }
  
  initializeArgs() {
    return {
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
