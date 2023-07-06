import {Component, OnInit, ViewChild} from '@angular/core';
import {disciplineReportConsts} from '../../discipline-report/discipline-report.consts';
import {ExportModel} from '../../../cm/export/export.model';
import {ToitsuTableComponent} from '../../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../../toitsu-shared/toitsu-table/toitsu-table.service';
import {DisciplineReportService} from '../../discipline-report/discipline-report.service';
import {EnumService} from '../../../cm/enum/enum.service';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-inm-select-discipline-reports-dialog',
  templateUrl: 'select-discipline-reports-dialog.component.html'
})

export class SelectDisciplineReportsDialogComponent implements OnInit {

  url = disciplineReportConsts.getOpenDisciplineReportsIndex;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'reportNo', header: this.translate.instant('disciplineReport.reportNo'), sortField: 'reportNo', width: '10rem', align: 'center'},
    {field: 'reportDate', header: this.translate.instant('disciplineReport.reportDate'), sortField: 'reportDate', width: '10rem', align: 'center'},
    {field: 'reporterTypeLabel', header: this.translate.instant('disciplineReport.reporterType'), sortField: 'reporterType', width: '10rem', align: 'center'},
    {field: 'reporterFullName', header: this.translate.instant('disciplineReport.reporterFullName'), sortField: 'reporterLastName', width: '18rem', align: 'center'},

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
  exportModel = new ExportModel(this.translate.instant('inm.disciplineReport'), 'disciplineReportController', 'getOpenDisciplineReportsIndex', 'inm.args.OpenDisciplineReportsArgs');
  viewLink = '/inm/disciplinereport/view';

  @ViewChild('table') table: ToitsuTableComponent;
  reporterTypes = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private dynamicDialogRef: DynamicDialogRef,
    private disciplineReportService: DisciplineReportService,
    private enumService: EnumService,
  ) {
  }

  ngOnInit(): void {

    // Reporter Types
    this.enumService.getEnumValues('inm.core.enums.DisciplineReporterType').subscribe(responseData => {
      this.reporterTypes = responseData;
    });
    
  }

  // ---------------------------------------------------------------------------------------------------------------------------------------

  initializeArgs() {
    return {
      reportNo: null,
      reportDateAfter: null,
      reportDateBefore: null,
      reporterType: null
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

  confirm() {
    if (this.table.selectedItems.length === 0) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.dynamicDialogRef.close(this.table.selectedItems);
    }
  }

  cancel() {
    this.dynamicDialogRef.close();
  }
  
}








