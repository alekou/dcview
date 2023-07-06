import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';

@Component({
  selector: 'app-inm-inmate-list-dialog',
  templateUrl: 'inmate-list-dialog.component.html'
})
export class InmateListDialogComponent implements OnInit {
  
  url: string;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'code', header: this.translate.instant('inmate.masterInmate.code'), sortField: 'inm/QMasterInmate.masterInmate.code', width: '10rem'},
    {field: 'lastName', header: this.translate.instant('inmate.lastName'), sortField: 'lastName', width: '15rem'},
    {field: 'firstName', header: this.translate.instant('inmate.firstName'), sortField: 'firstName', width: '12rem'},
    {field: 'fatherName', header: this.translate.instant('inmate.fatherName'), sortField: 'fatherName', width: '10rem'},
    {field: 'motherName', header: this.translate.instant('inmate.motherName'), sortField: 'motherName', width: '10rem'}
  ];
  
  sortField = 'lastName';
  sortOrder = 1;
  
  args = this.initializeArgs();
  
  @ViewChild('table') table;
  
  selectedRowData: any;
  
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private dynamicDialogRef: DynamicDialogRef,
    private translate: TranslateService,
    private toitsuToasterService: ToitsuToasterService
  ) {
    this.url = this.dynamicDialogConfig.data['dialogUrl'];
  }
  
  ngOnInit() {
  }
  
  initializeArgs() {
    return {
      code: null,
      lastName: null,
      firstName: null,
      fatherName: null,
      motherName: null
    };
  }
  
  rowDblClicked(rowData) {
    let id = rowData['id'];
    this.dynamicDialogRef.close(id);
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
      this.dynamicDialogRef.close(this.selectedRowData['id']);
    }
  }
  
  cancel() {
    this.dynamicDialogRef.close();
  }
}
