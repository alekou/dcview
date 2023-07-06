import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {sessionTypeConsts} from './session-type.consts';
import {GenParameterTypeService} from '../gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-sa-session-type-list',
  templateUrl: 'session-type-list.component.html'
})
export class SessionTypeListComponent implements OnInit {
  url = sessionTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'doctorTypeLabel', header: this.translate.instant('sessionType.doctorType'), sortField: 'doctorType', width: '15rem'}, 
    {field: 'description', header: this.translate.instant('sessionType.description'), sortField: 'description', width: '12rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('sessionType.comments'), sortField: 'comments', width: '12rem'}
  ];
  exportModel = new ExportModel(this.translate.instant('sa.sessionType'), 'sessionTypeController', 'sessionTypeIndex', 'inm.args.SessionTypeArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'description',
    sortOrder: 1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  doctorTypes = [];

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/sa/sessiontype/view';

  constructor(private translate: TranslateService,
              private router: Router,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private genParameterTypeService: GenParameterTypeService,
              private enumService: EnumService
  ) {
  }

  ngOnInit(): void {
    // DoctorType
    this.enumService.getEnumValues('med.core.enums.DoctorType').subscribe(responseData => {
      this.doctorTypes = responseData;
    });
  }

  initializeArgs() {
    return {};
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }

  loadTableData() {
    this.table.loadTableData();
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.args.isActive = 'NO';
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

  newRecord() {
    this.router.navigate([this.viewLink]);
  }
}
