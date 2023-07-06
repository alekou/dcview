import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {ProfessionService} from '../../sa/profession/profession.service';
import {inmateLaborConsts} from './inmate-labor.consts';
import {inmateConsts} from '../inmate/inmate.consts';

@Component({
  selector: 'app-inm-inmate-labor-list',
  templateUrl: 'inmate-labor-list.component.html'
})
export class InmateLaborListComponent implements OnInit {
  
  url = inmateLaborConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('inmateLabor.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '20rem'},
    {field: 'professionName', header: this.translate.instant('inmateLabor.professionId'), sortField: 'inm/QProfession.profession.name', width: '15rem'},
    {field: 'startDate', header: this.translate.instant('inmateLabor.list.startDate'), sortField: 'startDate', width: '8rem', align: 'center'},
    {field: 'actualEndDate', header: this.translate.instant('inmateLabor.list.actualEndDate'), sortField: 'actualEndDate', width: '8rem', align: 'center'},
    {field: 'pauseLabel', header: this.translate.instant('inmateLabor.pause'), sortField: 'pause', width: '6rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'startDate',
    sortOrder: -1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.inmateLabor'), 'inmateLaborController', 'inmateLaborIndex', 'inm.args.InmateLaborArgs');
  
  viewLink = '/inm/inmatelabor/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  
  inmateDialogUrl: string;
  professions = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private professionService: ProfessionService
  ) {}
  
  ngOnInit() {
    // Get the lists
    
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.professionService.getActiveProfessionsByUserDc().subscribe(responseData => {
      this.professions = responseData;
    });
  }
  
  initializeArgs() {
    return {
      inmateId: null,
      inmateCode: null,
      professionId: null,
      startDateAfter: null,
      startDateBefore: null,
      actualEndDateAfter: null,
      actualEndDateBefore: null
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
