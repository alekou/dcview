import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {EnumService} from '../../cm/enum/enum.service';
import {visitorConsts} from './visitor.consts';

@Component({
  selector: 'app-inm-visitor-list',
  templateUrl: 'visitor-list.component.html'
})
export class VisitorListComponent implements OnInit {
  
  url = visitorConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', header: '', width: '4rem', align: 'center'},
    {field: 'extraActions', header: '', sortField: '', width: '4rem', align: 'center'},
    {field: 'lastName', header: this.translate.instant('visitor.lastName'), sortField: 'lastName', width: '10rem'},
    {field: 'firstName', header: this.translate.instant('visitor.firstName'), sortField: 'firstName', width: '10rem'},
    {field: 'address', header: this.translate.instant('visitor.address'), sortField: 'address', width: '8rem'},
    {field: 'phone', header: this.translate.instant('visitor.phone'), sortField: 'phone', width: '8rem'},
    {field: 'adt', header: this.translate.instant('visitor.adt'), sortField: 'adt', width: '8rem'},
    {field: 'passportNo', header: this.translate.instant('visitor.passportNo'), sortField: 'passportNo', width: '8rem'},
    {field: 'isLawyerLabel', header: this.translate.instant('visitor.isLawyer'), sortField: 'isLawyer', width: '8rem', align: 'center'}
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
  
  exportModel = new ExportModel(this.translate.instant('inm.visitor'), 'visitorController', 'visitorIndex', 'inm.args.VisitorArgs');
  
  viewLink = '/inm/visitor/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    // YesNoEnums
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }
  
  initializeArgs() {
    return {
      lastName: null,
      firstName: null,
      adt: null,
      passportNo: null,
      isLawyer: null
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
