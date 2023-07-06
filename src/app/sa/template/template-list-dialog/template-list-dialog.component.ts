import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {templateConsts} from '../template.consts';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {reportConsts} from '../../report/report.consts';

@Component({
  selector: 'app-tr-template-list-dialog',
  templateUrl: 'template-list-dialog.component.html'
})
export class TemplateListDialogComponent{
  
  resultSet = {
    id: null,
    report: null,
  };

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  /*
   * Πρότυπα Αναφορών
   */
  url = templateConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', header: '', sortField: '', width: '10%'},
    {field: 'title', header: this.translate.instant('template.title'), sortField: 'title', width: '30%'},
    {field: 'entityLabel', header: this.translate.instant('template.entity'), sortField: 'entity', width: '30%'},
    {field: 'reportCode', header: this.translate.instant('template.reportCode'), sortField: 'reportCode', width: '30%'}
  ];
  
  sortField = 'title';
  sortOrder = 1;
  
  args = this.initializeArgs();
  
  @ViewChild('table') table;
  
  selectedRowData: any;
  subsystem: string;
  reportViewLink: string;

  initializeArgs() {
    return {
      title: null,
      entity: this.dynamicDialogConfig.data.entity,
      doctorType: this.dynamicDialogConfig.data.doctorType
    };
  }
  
  rowDblClicked(rowData) {
    this.resultSet.id = rowData['id'];
    this.resultSet.report = false;
    this.dynamicDialogRef.close(this.resultSet);
  }
  
  rowSelected(rowData) {
    this.selectedRowData = rowData['data'];
  }
  
  rowUnselected(rowData) {
    this.selectedRowData = null;
  }
  
  loadTableData() {
    this.table.loadTableData();
  }
  
  clearArgs() {
    this.args = this.initializeArgs();
  }

  confirm() {
    if (!this.selectedRowData) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      this.toitsuToasterService.clearMessages();
      this.resultSet.id = this.selectedRowData['id'];
      this.resultSet.report = false;
      this.dynamicDialogRef.close(this.resultSet);
    }
  }
  
  cancel() {
    this.dynamicDialogRef.close();
  }

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  /*
   * Εκτυπώσεις Ενότητας
   */
  reportUrl = reportConsts.indexUrl;

  reportCols = [
    {field: 'rowNum', header: '', sortField: '', width: '5%'},
    {field: 'title', header: this.translate.instant('report.title'), sortField: 'title', width: '30%'},
    {field: 'username', header: this.translate.instant('report.username'), sortField: 'username', width: '10%'},
    {field: 'applicant', header: this.translate.instant('report.applicant'), sortField: 'applicant', width: '20%'}
  ];

  reportSortField = 'title';
  reportSortOrder = 1;
  
  reportArgs = this.initializeReportArgs();

  
  
  @ViewChild('reportTable') reportTable;

  reportSelectedRowData: any;

  initializeReportArgs() {
    return {
      title: null,
      entity: this.dynamicDialogConfig.data.entity,
      entityId: this.dynamicDialogConfig.data.entityId
    };
  }

  loadReportTableData() {
    this.reportTable.loadTableData();
  }

  reportRowDblClicked(rowData) {
    this.resultSet.id = rowData['id'];
    this.resultSet.report = true;
    this.dynamicDialogRef.close(this.resultSet);
  }
  
  reportRowSelected(rowData) {
    this.reportSelectedRowData = rowData['data'];
  }
  
  reportRowUnselected(rowData) {
    this.reportSelectedRowData = null;
  }

  reportConfirm() {
   
    if (!this.reportSelectedRowData) {
      this.toitsuToasterService.showErrorStay(this.translate.instant('global.recordNotSelected'));
    }
    else {
      alert(this.subsystem);
      this.resultSet.id = this.reportSelectedRowData['id'];
      this.resultSet.report = true;
      this.toitsuToasterService.clearMessages();
      this.router.navigate(['/' + this.subsystem + '/report/view', this.reportSelectedRowData['id']]);
      this.dynamicDialogRef.close(this.resultSet);
    }
  }
  
  reportCancel() {
    this.dynamicDialogRef.close();
  }

  // -----------------------------------------------------------------------------------------------------
  hideTab: boolean = false;
  

  constructor(
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService
  ) {
    
    this.hideTab = this.dynamicDialogConfig.data.hideTab;
    if (this.dynamicDialogConfig.data.application === 'INM'){
      this.subsystem = 'inm';
    }else if (this.dynamicDialogConfig.data.application === 'MED'){
      this.subsystem = 'med';
    }
    this.reportViewLink = '/' + this.subsystem + '/report/view';
  }
}
