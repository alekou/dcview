import {Component, OnInit, ViewChild} from '@angular/core';
import {disciplineReportConsts} from './discipline-report.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {DisciplineReportService} from './discipline-report.service';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {InmateService} from '../inmate/inmate.service';

@Component({
  selector: 'app-inm-discipline-report-list',
  templateUrl: 'discipline-report-list.component.html'
})

export class DisciplineReportListComponent implements OnInit {
  
  url = disciplineReportConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'reportNo', header: this.translate.instant('disciplineReport.reportNo'), sortField: 'reportNo', width: '10rem', align: 'center'},
    {field: 'reportDate', header: this.translate.instant('disciplineReport.reportDate'), sortField: 'reportDate', width: '10rem', align: 'center'},
    {field: 'reporterTypeLabel', header: this.translate.instant('disciplineReport.reporterType'), sortField: 'reporterType', width: '10rem', align: 'center'},
    {field: 'reporterFullName', header: this.translate.instant('disciplineReport.reporterFullName'), sortField: 'reporterLastName', width: '18rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('disciplineOffense.ReportedInmate'), sortField: 'inm/QInmate.inmate.lastName', width: '18rem', align: 'center'},
    {field: 'offenseType', header: this.translate.instant('disciplineOffense.offenseTypePid'), sortField: 'cm/QGenParameter.offenseType.description', width: '18rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);

  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'reportNo',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('inm.disciplineReport'), 'disciplineReportController', 'disciplineReportIndex', 'inm.args.DisciplineReportArgs');
  viewLink = '/inm/disciplinereport/view';

  @ViewChild('table') table: ToitsuTableComponent;
  reporterTypes = [];
  reportedInmates = [];
  reportedInmateDialogUrl: string;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private disciplineReportService: DisciplineReportService,
    private enumService: EnumService,
    private inmateService: InmateService
  ) {
  }

  ngOnInit(): void {

    // Reporter Types
    this.enumService.getEnumValues('inm.core.enums.DisciplineReporterType').subscribe(responseData => {
      this.reporterTypes = responseData;
    });

    // Inmates
    this.inmateService.getLastRecordInmates().subscribe(responseData => {
      this.reportedInmates = responseData;
    });
    this.reportedInmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeArgs() {
    return {
      reportNo: null,
      reportDateAfter: null,
      reportDateBefore: null,
      reporterType: null,
      inmateId: null,
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

  // ---------------------------------------------------------------------------------------------------------------------------------------


}
