import {Component, OnInit, ViewChild} from '@angular/core';
import { ToitsuTableComponent } from 'src/app/toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {gateMovementTypeConsts} from './gate-movement-type.consts';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GateMovementTypeService} from './gate-movement-type.service';
import {EnumService} from '../../cm/enum/enum.service';

@Component({
  selector: 'app-inm-gate-movement-type-list',
  templateUrl: 'gate-movement-type-list.component.html'
})
export class GateMovementTypeListComponent implements OnInit {

  url = gateMovementTypeConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'movementKind', header: this.translate.instant('gateMovementType.movementKind'), sortField: 'movementKind', width: '15rem', align: 'center'},
    {field: 'reasonForInmateMovementKind', header: this.translate.instant('gateMovementType.reasonForInmateMovementKind'), sortField: 'reasonForInmateMovementKind', width: '15rem', align: 'center'},
    {field: 'description', header: this.translate.instant('gateMovementType.description'), sortField: 'description', width: '15rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('gateMovementType.comments'), sortField: 'comments', width: '20rem', align: 'center'}
  ];

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);
  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'movementKind',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();
  exportModel = new ExportModel(this.translate.instant('inm.gateMovementType'), 'gateMovementTypeController', 'gateMovementTypeIndex', 'inm.args.GateMovementTypeArgs');
  viewLink = '/sa/gatemovementtype/view';

  @ViewChild('table') table: ToitsuTableComponent;
  gateMovementKinds = [];
  reasonForInmateMovementKind = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private dialogService: DialogService,
    private toitsuTableService: ToitsuTableService,
    private gateMovementTypeService: GateMovementTypeService,
    private enumService: EnumService) {}

  ngOnInit() {

    this.enumService.getEnumValues('inm.core.enums.MovementKind').subscribe(responseData => {
      this.gateMovementKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.ReasonForInmateMovementKind').subscribe(responseData => {
      this.reasonForInmateMovementKind = responseData;
    });
  }

  initializeArgs() {
    return {
      movementKind: null,
      reasonForInmateMovementKind: null
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
