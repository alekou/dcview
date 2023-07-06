import {Component, OnInit, ViewChild} from '@angular/core';
import {disciplineCouncilConsts} from './discipline-council.consts';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {Router} from '@angular/router';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {EnumService} from '../../cm/enum/enum.service';


@Component({
  selector: 'app-inm-discipline-council-list',
  templateUrl: 'discipline-council-list.component.html'
})

export class DisciplineCouncilListComponent implements OnInit{

  url = disciplineCouncilConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'councilNo', header: this.translate.instant('disciplineCouncil.councilNo'), sortField: 'councilNo', width: '10rem'},
    {field: 'councilDate', header: this.translate.instant('disciplineCouncil.councilDate'), sortField: 'councilDate', width: '10rem', align: 'center'},
    {field: 'completedLabel', header: this.translate.instant('disciplineCouncil.completed'), width: '10rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'councilNo',
    sortOrder: -1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.disciplineCouncil'), 'disciplineCouncilController', 'disciplineCouncilIndex', 'inm.args.DisciplineCouncilArgs');

  viewLink = '/inm/disciplinecouncil/view';

  @ViewChild('table') table: ToitsuTableComponent;

  yesNoEnums = [];
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService,

    
  ) {
  }


  ngOnInit() {

    // Enum Values
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
        this.yesNoEnums = responseData;
      });

  }

  initializeArgs() {
    return {
      councilNo: null,
      councilDateAfter: null,
      councilDateBefore: null,
      completed: null
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
