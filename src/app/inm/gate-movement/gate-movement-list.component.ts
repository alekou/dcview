import {gateMovementConsts} from './gate-movement.consts';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ExportModel} from '../../cm/export/export.model';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {GateMovementService} from './gate-movement.service';
import {GateMovementTypeService} from '../../sa/gate-movement-type/gate-movement-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {VacationTypeService} from '../../sa/vacation-type/vacation-type.service';
import {TransferTypeService} from '../../sa/transfer-type/transfer-type.service';

@Component({
  selector: 'app-inm-gate-movement-list',
  templateUrl: 'gate-movement-list.component.html'
})
export class GateMovementListComponent implements OnInit {
  url = gateMovementConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'extraActions', header: this.translate.instant('global.extraActions'), width: '5rem', align: 'center'},
    {field: 'serialNo', header: this.translate.instant('gateMovement.serialNo'), sortField: 'serialNo', width: '10rem', align: 'center'},
    {field: 'movementDate', header: this.translate.instant('gateMovement.movementDate'), sortField: 'movementDate', width: '12rem', align: 'center'},
    {field: 'movementTypeDescription', header: this.translate.instant('gateMovement.movementKind'), sortField: 'inm/QGateMovementType.gateMovementType.movementKind', width: '12rem', align: 'center'},
    {field: 'movementStatus', header: this.translate.instant('gateMovement.movementStatus'), sortField: 'oppositeMovementId', width: '12rem', align: 'center'},
    {field: 'gateMovementFullDescription', header: this.translate.instant('gateMovement.details'), width: '20rem', align: 'center'},
    {field: 'movementCause', header: this.translate.instant('gateMovement.reasonForInmateMovement'), sortField: 'movementCause', width: '15rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('gateMovement.comments'), sortField: 'comments', width: '24rem', align: 'center'},
    ];

  @ViewChild('table') table: ToitsuTableComponent;

  private storedPaging = this.toitsuTableService.initializePagingFromLocalStorage(this.router.url);

  paging = this.storedPaging ? this.storedPaging : {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'serialNo',
    sortOrder: 1
  };

  private storedArgs = this.toitsuTableService.initializeArgsFromLocalStorage(this.router.url);
  args = this.storedArgs ? this.storedArgs : this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.gateMovement'), 'gateMovementController', 'gateMovementIndex', 'inm.args.GateMovementArgs');

  viewLink = '/inm/gatemovement/view';
  movementKinds = [];
  reasonForInmateMovementKinds = [];
  vacationTypes = [];
  gateMovementsStatus = [];
  inOutKinds = [];
  inmateDialogUrl: string;
  transferTypes = [];

  constructor( private translate: TranslateService,
               private router: Router,
               private dialogService: DialogService,
               private transferTypeService: TransferTypeService,
               private toitsuTableService: ToitsuTableService,
               private gateMovementService: GateMovementService,
               private gateMovementTypeService: GateMovementTypeService,
               private vacationServiceType: VacationTypeService,
               private enumService: EnumService) {}

  ngOnInit(): void {

    this.enumService.getEnumValues('inm.core.enums.MovementKind').subscribe(responseData => {
      this.movementKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.ReasonForInmateMovementKind').subscribe(response => {
      this.reasonForInmateMovementKinds = response;
    });

    this.enumService.getEnumValues('inm.core.enums.InOutKind').subscribe(responseData => {
      this.inOutKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.GateMovementStatus').subscribe(responseData => {
      this.gateMovementsStatus = responseData;
    });
    
    this.enumService.getEnumValues('inm.core.enums.VacationTypeKind').subscribe(responseData => {
      this.vacationTypes = responseData;
    });
    
    this.transferTypeService.getActiveTransferTypesByUserDc([]).subscribe(responseData => {
      this.transferTypes = responseData;
    });
    
    // Inmates url
    this.inmateDialogUrl = inmateConsts.lastRecordIndexUrl;
  }

  loadComplete() {
    this.toitsuTableService.storeArgsAndPagingInLocalStorage(this.router.url, this.args, this.table);
  }

  loadTableData() {
    this.table.loadTableData();
  }
  initializeArgs() {
    return {
      fromDate: null,
      toDate: null,
      inOutKind: null,
      gateMovementStatus: null,
      movementKind: null,
      reasonForInmateMovementKind: null,
      inmateId: null,
      visitorId: null,
      vehicleDriverVisitorId: null,
      employeeId: null,
      transferTypeId: null,
      vacationTypeId: null,
      vacationTypeKind: null,
      serialNo: null
    };
  }

  clearArgs() {
    this.args = this.initializeArgs();
    this.toitsuTableService.removeArgsAndPagingFromLocalStorage(this.router.url);
  }

  newRecord() {
    this.router.navigate([this.viewLink]);
  }

  rowClicked(data) {
  }

  massCreate() {
    this.router.navigate(['/inm/gatemovement/masscreate']);
  }

  massClose() {
    this.router.navigate(['/inm/gatemovement/massclose']);
  }
}
