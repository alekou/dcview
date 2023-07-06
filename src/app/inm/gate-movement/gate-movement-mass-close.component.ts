import {Component, OnInit, ViewChild} from '@angular/core';
import {GateMovement} from './gate-movement.model';
import {GateMovementTypeService} from '../../sa/gate-movement-type/gate-movement-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {GateMovementService} from './gate-movement.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {gateMovementConsts} from './gate-movement.consts';
import {ToitsuTableComponent} from '../../toitsu-shared/toitsu-table/toitsu-table.component';
import {ToitsuTableService} from '../../toitsu-shared/toitsu-table/toitsu-table.service';
import {ExportModel} from '../../cm/export/export.model';
import {DateService} from '../../toitsu-shared/date.service';
import {NgForm} from '@angular/forms';
import {inmateConsts} from '../inmate/inmate.consts';
import {TransferTypeService} from '../../sa/transfer-type/transfer-type.service';

@Component({
  selector: 'app-inm-gate-movement-mass-close-view',
  templateUrl: 'gate-movement-mass-close.component.html'
})
export class GateMovementMassCloseComponent implements OnInit {

  @ViewChild(NgForm)massClosureForm: NgForm;
  scrollHeight = '45rem';
  url = gateMovementConsts.indexUrl;

  cols = [
    {field: 'rowNum', width: '5rem', align: 'center'},
    {field: 'checkboxes', width: '3rem', align: 'center'},
    {field: 'serialNo', header: this.translate.instant('gateMovement.serialNo'), sortField: 'serialNo', width: '10rem', align: 'center'},
    {field: 'inOutKind', header: this.translate.instant('gateMovement.inOutKind'), sortField: 'inOutKind', width: '12rem', align: 'center'},
    {field: 'movementDate', header: this.translate.instant('gateMovement.movementDate'), sortField: 'movementDate', width: '14em', align: 'center'},
    {field: 'movementTypeDescription', header: this.translate.instant('gateMovement.movementKind'), sortField: 'inm/QGateMovementType.gateMovementType.movementKind', width: '12rem', align: 'center'},
    {field: 'movementStatus', header: this.translate.instant('gateMovement.movementStatus'), sortField: 'oppositeMovementId', width: '12rem', align: 'center'},
    {field: 'gateMovementFullDescription', header: this.translate.instant('gateMovement.details'), width: '15rem', align: 'center'},
    {field: 'movementCause', header: this.translate.instant('gateMovement.reasonForInmateMovement'), sortField: 'movementCause', width: '15rem', align: 'center'},
    {field: 'comments', header: this.translate.instant('gateMovement.comments'), sortField: 'comments', width: '15rem', align: 'center'},
  ];

  @ViewChild('table') table: ToitsuTableComponent;

  paging = {
    first: this.toitsuTableService.FIRST,
    rows: this.toitsuTableService.ROWS,
    sortField: 'serialNo',
    sortOrder: 1
  };

  args = this.initializeArgs();

  exportModel = new ExportModel(this.translate.instant('inm.gateMovement'), 'gateMovementController', 'gateMovementIndex', 'inm.args.GateMovementArgs');

  viewLink = '/inm/gatemovement/view';
  id: number;
  commonGateMovementData: GateMovement = new GateMovement();
  inOutKinds = [];
  allMovementTypesDesc = [];
  vacationTypes = [];
  transferTypes = [];
  typeOfMovement;
  reasonForInmateMovement;
  inmateDialogUrl: string;
  
  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuTableService: ToitsuTableService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private gateMovementService: GateMovementService,
    private transferTypeService: TransferTypeService,
    private dateService: DateService,
    private enumService: EnumService,
    private gateMovementTypeService: GateMovementTypeService) {}

  ngOnInit() {

    this.commonGateMovementData.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;

    // Get all gate types descriptions
    this.gateMovementTypeService.getAllGateMovementTypes().subscribe(response => {
      this.allMovementTypesDesc = response;
    });

    this.enumService.getEnumValues('inm.core.enums.InOutKind').subscribe(responseData => {
      this.inOutKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.VacationTypeKind').subscribe(responseData => {
      this.vacationTypes = responseData;
    });

    this.transferTypeService.getActiveTransferTypesByUserDc([]).subscribe(responseData => {
      this.transferTypes = responseData;
    });

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  movementTypeIdChanged() {

    let defaultMovementDirection;
    this.table.clearSelectedItems();
    
    const foundCurrentGateMovementType = this.allMovementTypesDesc.find((result) => {
      return result.id === this.commonGateMovementData.movementTypeId;
    });

    if (foundCurrentGateMovementType) {
      // Χρησιμποιούμε τις τιμές για να φιλτράρουμε τα πεδία ανάλογα με το gate movement type description
      this.typeOfMovement = foundCurrentGateMovementType.movementKind;
      this.reasonForInmateMovement = foundCurrentGateMovementType.reasonForInmateMovementKind;
      defaultMovementDirection = foundCurrentGateMovementType.defaultInOutKind;

      // Φιλτραρισμα με τα βαση τα args
      this.args.movementKind = foundCurrentGateMovementType.movementKind;
      this.args.reasonForInmateMovementKind = foundCurrentGateMovementType.reasonForInmateMovementKind;

      this.loadTableData();
    }

    // Κοινά πεδία
    // this.commonGateMovementData.firstSearchEmployeeId = null;
    // this.commonGateMovementData.secondSearchEmployeeId = null;
    // this.commonGateMovementData.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    // this.commonGateMovementData.comments = null;
    if (!this.commonGateMovementData.movementTypeId) {
      this.commonGateMovementData = new GateMovement();
      this.commonGateMovementData.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.args.movementKind = null;
      this.args.reasonForInmateMovementKind = null;
      this.typeOfMovement = null;
      this.loadTableData();
    }
    if (!this.id) {
      this.commonGateMovementData.inOutKind = defaultMovementDirection;
      this.commonGateMovementData.inmateId = this.typeOfMovement === 'INMATE' ? this.commonGateMovementData.inmateId : null;
      this.commonGateMovementData.vacationId = this.typeOfMovement === 'INMATE' && this.typeOfMovement === 'VACATION' ? this.commonGateMovementData.vacationId : null;
      this.commonGateMovementData.transferId = this.typeOfMovement === 'INMATE' && this.typeOfMovement === 'TRANSFER' ? this.commonGateMovementData.transferId : null;
      this.commonGateMovementData.escortName = this.typeOfMovement === 'INMATE' ? this.commonGateMovementData.escortName : null;
      this.commonGateMovementData.escortStatus = this.typeOfMovement === 'INMATE' ? this.commonGateMovementData.escortStatus : null;
      this.commonGateMovementData.escortService = this.typeOfMovement === 'INMATE' ? this.commonGateMovementData.escortService : null;
      this.commonGateMovementData.visitorId = this.typeOfMovement === 'VISITOR' ? this.commonGateMovementData.visitorId : null;
      this.commonGateMovementData.vehicleId = this.typeOfMovement === 'VEHICLE' ? this.commonGateMovementData.vehicleId : null;
      this.commonGateMovementData.visitDestinationPid = this.typeOfMovement === 'VEHICLE' || this.typeOfMovement === 'VISITOR' ? this.commonGateMovementData.visitDestinationPid : null;
      this.commonGateMovementData.vehicleDriverVisitorId = this.typeOfMovement === 'VEHICLE' ? this.commonGateMovementData.vehicleDriverVisitorId : null;
      this.commonGateMovementData.vehicleOccupants = this.typeOfMovement === 'VEHICLE' ? this.commonGateMovementData.vehicleOccupants : [];
      this.commonGateMovementData.employeeId = this.typeOfMovement === 'EMPLOYEE' ? this.commonGateMovementData.employeeId : null;
    }
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
      inmateId: null,
      visitorId: null,
      employeeId: null,
      transferTypeId: null,
      vacationTypeId: null,
      vacationTypeKind: null,
      serialNo: null,
      movementKind: null,
      reasonForInmateMovementKind: null,
      gateMovementStatus: 'OPEN'
    };
  }

  clearArgs() {
    this.args = this.initializeArgs();
  }
  
  goToList() {
    this.router.navigate(['/inm/gatemovement/list']);
  }
  
  massCloseGateMovements() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();
    
    let selectedIds = this.table.selectedItems.map(item => item.id);
    let gateMovementListToSave = [];
    
    selectedIds.forEach((selectedId) => {
      
      let gateMovement = new GateMovement();
      
      gateMovement.movementTypeId = this.commonGateMovementData.movementTypeId;
      gateMovement.movementDate = this.commonGateMovementData.movementDate;
      gateMovement.comments = this.commonGateMovementData.comments;
      gateMovement.firstSearchEmployeeId = this.commonGateMovementData.firstSearchEmployeeId;
      gateMovement.secondSearchEmployeeId = this.commonGateMovementData.secondSearchEmployeeId;
      gateMovement.escortName = this.commonGateMovementData.escortName;
      gateMovement.escortStatus = this.commonGateMovementData.escortStatus;
      gateMovement.escortService = this.commonGateMovementData.escortService;
      gateMovement.oppositeMovementId = selectedId;
      
      gateMovementListToSave.push(gateMovement);
    });
    
    this.gateMovementService.gateMovementMassClose(gateMovementListToSave).subscribe( {
      next: (response: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.router.navigate(['inm/gatemovement/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}
