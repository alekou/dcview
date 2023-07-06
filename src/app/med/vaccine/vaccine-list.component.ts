import {Component, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {vaccineConsts} from './vaccine.consts';

@Component({
  selector: 'app-med-vaccine-list',
  templateUrl: 'vaccine-list.component.html'
})
export class VaccineListComponent {

  url = vaccineConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '10rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '10rem', align: 'center'},
    {field: 'description', header: this.translate.instant('vaccine.description'), sortField: 'description', width: '35rem', align: 'center'},
    {field: 'totalDoses', header: this.translate.instant('vaccine.totalDoses'), sortField: 'totalDoses', width: '35rem', align: 'center'},
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'description',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('med.vaccine'), 'vaccineController', 'vaccineIndex', 'med.args.VaccineArgs');
  viewLink = '/med/vaccine/view';

  @ViewChild('table') table: ToitsuTableComponent;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
 ) {}

  initializeArgs() {
    return {
      vaccineDescription: null
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
