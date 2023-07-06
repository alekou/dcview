import {Component, OnInit, ViewChild} from '@angular/core';
import {programConsts} from './program.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {AuthService} from '../../toitsu-auth/auth.service';
import {ProgramTypeService} from '../../sa/program-type/program-type.service';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-inm-program-list',
  templateUrl: 'program-list.component.html'
})
export class ProgramListComponent implements OnInit {

  url = programConsts.indexUrl;
  programTypes = [];
  statuses = [];
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'programTypeFullDescription', header: this.translate.instant('program.programTypeId'), sortField: 'inm/QProgramType.programType.kind', width: '10rem', align: 'center'},
    {field: 'statusLabel', header: this.translate.instant('program.status'), sortField: 'status', width: '15rem'},
    {field: 'description', header: this.translate.instant('program.description'), sortField: 'description', width: '15rem'},
    {field: 'subsidizer', header: this.translate.instant('program.subsidizer'), sortField: 'subsidizer', width: '15rem'},
    {field: 'startDate', header: this.translate.instant('program.startDate'), sortField: 'startDate', width: '10rem', align: 'center'},
    {field: 'endDate', header: this.translate.instant('program.endDate'), sortField: 'endDate', width: '10rem', align: 'center'},
    {field: 'totalHours', header: this.translate.instant('program.totalHours'), sortField: 'totalHours', width: '10rem', align: 'center'}
  ];

  exportModel = new ExportModel(this.translate.instant('inm.program'), 'programController', 'programIndex', 'inm.args.ProgramArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'startDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/inm/program/view';

  constructor(private translate: TranslateService,
              private router: Router,
              public authService: AuthService,
              private dialogService: DialogService,
              private toitsuTableService: ToitsuTableService,
              private programTypeService: ProgramTypeService,
              private enumService: EnumService) {
  }

  ngOnInit(): void {

    this.programTypeService.getAllProgramTypes(true, []).subscribe({
      next: (responseData) => {
        this.programTypes = responseData;
      }
    });
    
    // Status
    this.enumService.getEnumValues('inm.core.enums.ProgramStatus').subscribe(responseData => {
      this.statuses = responseData;
    });
  }

  initializeArgs() {
    return {
      dcId: null,
      programTypeId: null,
      description: null,
      fromConduct: false
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
