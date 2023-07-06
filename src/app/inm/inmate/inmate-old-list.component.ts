import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {AuthService} from '../../toitsu-auth/auth.service';
import {EnumService} from '../../cm/enum/enum.service';
import {ExportModel} from '../../cm/export/export.model';
import {inmateConsts} from './inmate.consts';

@Component({
  selector: 'app-inm-inmate-old-list',
  templateUrl: 'inmate-old-list.component.html'
})
export class InmateOldListComponent implements OnInit {
  
  url = inmateConsts.oldIndexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'viewAction', width: '5rem', align: 'center', customCell: 'cell1'},
    {field: 'folderStatus', width: '3rem', align: 'center', customCell: 'cell2'},
    {field: 'code', header: this.translate.instant('inmate.masterInmate.code'), sortField: 'inm/QMasterInmate.masterInmate.code', width: '10rem', align: 'center'},
    {field: 'inmateRecordCode', header: this.translate.instant('inmate.list.inmateRecordCode'), sortField: 'inm/QInmateRecord.lastInmateRecord.code', width: '8rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('inmate.lastName'), sortField: 'lastName', width: '15rem'},
    {field: 'firstName', header: this.translate.instant('inmate.firstName'), sortField: 'firstName', width: '12rem'},
    {field: 'fatherName', header: this.translate.instant('inmate.fatherName'), sortField: 'fatherName', width: '10rem'},
    {field: 'motherName', header: this.translate.instant('inmate.motherName'), sortField: 'motherName', width: '10rem'},
    {field: 'inmateRecordEntryDate', header: this.translate.instant('inmate.list.inmateRecordEntryDate'), sortField: 'inm/QInmateRecord.lastInmateRecord.entryDate', width: '8rem', align: 'center'},
    {field: 'inmateRecordExitDate', header: this.translate.instant('inmate.list.inmateRecordExitDate'), sortField: 'inm/QInmateRecord.lastInmateRecord.exitDate', width: '8rem', align: 'center'},
    {field: 'escapedLabel', header: this.translate.instant('inmate.list.escaped'), sortField: 'inm/QClassification.closingRecordClassification.isEscape', width: '6rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'lastName',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.inmate.oldList'), 'inmateController', 'oldInmateIndex', 'inm.args.OldInmateArgs');
  
  viewLink = '/inm/inmate/oldview';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  folderStatuses = [];
  genders = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService,
    private enumService: EnumService,
  ) {}
  
  ngOnInit() {
    // Get the lists
    this.enumService.getEnumValues('inm.core.enums.InmateFolderStatus').subscribe(responseData => {
      this.folderStatuses = responseData;
    });
    this.enumService.getEnumValues('cm.core.enums.Gender').subscribe(responseData => {
      this.genders = responseData;
    });
  }
  
  initializeArgs() {
    return {
      folderStatus: null,
      code: null,
      oldCode: null,
      dee: null,
      lastName: null,
      firstName: null,
      nickName: null,
      fatherName: null,
      motherName: null,
      gender: null,
      adt: null,
      passport: null,
      afm: null,
      amka: null,
      birthYear: null
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
  
  getFolderStatusClass(rowData) {
    if (rowData.folderStatus === 'CLOSED') {
      return 'fa fa-folder-o color-red';
    }
    else if (rowData.folderStatus === 'OPEN') {
      return 'fa fa-folder-open-o color-green';
    }
  }
  
  getFolderStatusTooltip(rowData) {
    if (rowData.folderStatus === 'CLOSED') {
      return this.translate.instant('inmate.list.folderStatus.closed');
    }
    else if (rowData.folderStatus === 'OPEN') {
      return this.translate.instant('inmate.list.folderStatus.open');
    }
  }
  
  goToNewInmate() {
    this.router.navigate(['/inm/inmate/view']);
  }
  
  goToList() {
    this.router.navigate(['/inm/inmate/list']);
  }
}
