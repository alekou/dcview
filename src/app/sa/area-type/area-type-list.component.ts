import {Component, OnInit, ViewChild} from '@angular/core';
import {areaTypeConsts} from './area-type.consts';
import {TranslateService} from '@ngx-translate/core';
import {EnumService} from '../../cm/enum/enum.service';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';

@Component({
  selector: 'app-inm-area-type-list',
  templateUrl: 'area-type-list.component.html'
})
export class AreaTypeListComponent implements OnInit {

  url = areaTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '3rem', align: 'center'},
    {field: 'extraActions', width: '3rem', align: 'center'},
    {field: 'code', header: this.translate.instant('areaType.code'), sortField: 'code', width: '15rem'},
    {field: 'description', header: this.translate.instant('areaType.description'), sortField: 'description', width: '20rem'},
    {field: 'hasPositionsLabel', header: this.translate.instant('areaType.hasPositions'), sortField: 'hasPositions', width: '10rem', align: 'center'},
    {field: 'isSpecialAreaLabel', header: this.translate.instant('areaType.isSpecialArea'), sortField: 'isSpecialArea', width: '10rem', align: 'center'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'code',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('sa.areaType'), 'areaTypeController', 'areaTypeIndex', 'inm.args.AreaTypeArgs');

  viewLink = '/sa/areatype/view';

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private enumService: EnumService,
    private router: Router,
    private toitsuTableService: ToitsuTableService
  ) {
  }

  ngOnInit(): void {
  }

  initializeArgs() {
    return {
      code: null,
      description: null
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
