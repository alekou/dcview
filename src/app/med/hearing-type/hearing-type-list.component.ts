import {Component, OnInit, ViewChild} from '@angular/core';
import {ExportModel} from '../../cm/export/export.model';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {EnumService} from '../../cm/enum/enum.service';
import {hearingTypeConsts} from './hearing-type.consts';

@Component({
  selector: 'app-med-hearing-type-list',
  templateUrl: 'hearing-type-list.component.html'
})
export class HearingTypeListComponent implements OnInit {
  url = hearingTypeConsts.indexUrl;
  kinds = [];
  yesNoEnums = [];
  cols = [
    {field: 'rowNum', width: '4rem', align: 'center'},
    {field: 'extraActions', width: '5rem', align: 'center'},
    {field: 'description', header: this.translate.instant('hearingType.description'), sortField: 'description', width: '70%'},
    {field: 'kindLabel', header: this.translate.instant('hearingType.kind'), sortField: 'kind', width: '30%', align: 'center'}
  ];

  exportModel = new ExportModel(this.translate.instant('med.hearingType'), 'hearingTypeController', 'hearingTypeIndex', 'med.args.HearingTypeArgs');

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'description',
    sortOrder: 1
  };
  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  @ViewChild('table') table: ToitsuTableComponent;
  viewLink = '/med/hearingtype/view';
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private enumService: EnumService
  ) {}

  ngOnInit(): void {
    // Kinds
    this.enumService.getEnumValues('med.core.enums.HearingTypeKind').subscribe(responseData => {
      this.kinds = responseData;
    });

    // Yes No
    this.enumService.getEnumValues('global.core.enums.option.YesNoEnumOption').subscribe(responseData => {
      this.yesNoEnums = responseData;
    });
  }

  initializeArgs() {
    return {
      description: null,
      kind: null,
      isActive: 'YES'
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
