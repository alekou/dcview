import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {EnumService} from '../../cm/enum/enum.service';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {areaConsts} from './area.consts';
import {AuthService} from '../../toitsu-auth/auth.service';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html'
})

export class AreaListComponent implements OnInit {

  url = areaConsts.indexUrl;

  yesNoEnums = [];

  cols = [
      {field: 'rowNum', width: '3rem', align: 'center'},
      {field: 'extraActions', width: '5rem', align: 'center'},
      {field: 'code', header: this.translate.instant('area.code'), sortField: 'code', width: '15rem'},
      {field: 'fullDescription', header: this.translate.instant('area.fullDescription'), sortField: 'fullDescription', width: '30rem'},
      {field: 'areaTypeDescription', header: this.translate.instant('area.areaTypeId'), sortField: 'inm/QAreaType.areaType.description', width: '12rem'},
      {field: 'positions', header: this.translate.instant('area.positions'), sortField: 'positions', width: '10rem', align: 'center'},
      {field: 'availablePositions', header: this.translate.instant('area.availablePositions'), width: '10rem', align: 'center'}
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

  exportModel = new ExportModel(this.translate.instant('inm.area'), 'areaController', 'areaIndex', 'inm.args.AreaArgs');

  viewLink = '/inm/area/view';

  @ViewChild('table') table: ToitsuTableComponent;

  constructor(
    private translate: TranslateService,
    private enumService: EnumService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    // Φόρτωση λιστών
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption')
      .subscribe(responseData => {
        this.yesNoEnums = responseData;
      });
  }

  initializeArgs() {
    return {
      code: null,
      description: null,
      hasPositions: null
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
