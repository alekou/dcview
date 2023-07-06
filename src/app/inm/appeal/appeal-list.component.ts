import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {appealConsts} from './appeal.consts';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {GenParameterTypeService} from '../../sa/gen-parameter-type/gen-parameter-type.service';

@Component({
  selector: 'app-inm-appeal-list',
  templateUrl: 'appeal-list.component.html'
})
export class AppealListComponent implements OnInit {
  
  url = appealConsts.indexUrl;
  
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'inmateFullName', header: this.translate.instant('appeal.inmateId'), sortField: 'inm/QInmate.inmate.lastName', width: '25rem'},
    {field: 'appealType', header: this.translate.instant('appeal.appealTypePid'), sortField: 'cm/QGenParameter.appealType.description', width: '12rem', align: 'center'},
    {field: 'courthouseName', header: this.translate.instant('appeal.courthouseId'), sortField: 'inm/QCourthouse.courthouse.name', width: '20rem', align: 'center'},
    {field: 'judgmentNo', header: this.translate.instant('appeal.judgmentId'), width: '12rem', align: 'center'}
  ];
  
  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'cm/QGenParameter.appealType.description',
    sortOrder: 1
  };
  
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  
  exportModel = new ExportModel(this.translate.instant('inm.appeal'), 'appealController', 'appealIndex', 'inm.args.AppealArgs');
  
  viewLink = '/inm/appeal/view';
  
  @ViewChild('table') table: ToitsuTableComponent;
  pAppealType = {};
  inmateDialogUrl: string;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private genParameterTypeService: GenParameterTypeService
  ) {}
  
  ngOnInit() {
    // Inmates
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
    
    this.genParameterTypeService.getByCategory(GenParameterCategory.Appeal_Type, []).subscribe(responseData => {
      this.pAppealType = responseData;
    });
  }
  
  // Κριτήρια αναζήτησης: δηλώνω τα ονόματα *ακριβώς* όπως δηλώθηκαν στο AppealArgs
  initializeArgs() {
    return {
      dcId: null,
      inmateId: null,
      inmateCode: null,
      appealTypePid: null,
      courthouseId: null
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
