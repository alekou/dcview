import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {vacationCouncilConsts} from './vacation-council.consts';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-inm-vacation-council-list',
  templateUrl: 'vacation-council-list.component.html'
})
export class VacationCouncilListComponent implements OnInit {

  id: number;
  url = vacationCouncilConsts.indexUrl;
  councilStatuses = [];
  yesNoEnums = [];
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'councilCode', header: this.translate.instant('vacationCouncil.councilCode'), sortField: 'councilCode', width: '30rem', align: 'center'},
    {field: 'councilDate', header: this.translate.instant('vacationCouncil.councilDate'), sortField: 'councilDate', width: '30rem', align: 'center'},
    {field: 'accomplishedLabel', header: this.translate.instant('vacationCouncil.accomplished'), sortField: 'accomplished', width: '20rem', align: 'center'},
  ];

  @ViewChild(NgForm) vacationCouncilForm: NgForm;

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'councilDate',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.vacationCouncil'), 'vacationCouncilController', 'vacationCouncilIndex', 'inm.args.VacationCouncilArgs');

  viewLink = '/inm/vacationcouncil/view';

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService
  ) {}

  ngOnInit(): void {

    this.enumService.getEnumValues('inm.core.enums.option.VacationCouncilStatusOption').subscribe(responseDate => {
      this.councilStatuses = responseDate;
    });
    
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
    
  }

  initializeArgs() {
    return {
      councilCode: null,
      councilDateAfter: null,
      councilDateBefore: null,
      accomplished: 'ALL'
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
