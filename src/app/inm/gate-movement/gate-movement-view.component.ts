import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {GateMovement} from './gate-movement.model';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {GateMovementService} from './gate-movement.service';
import {GateMovementTypeService} from '../../sa/gate-movement-type/gate-movement-type.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {DateService} from '../../toitsu-shared/date.service';
import {VehicleService} from '../vehicle/vehicle.service';
import {DialogService} from 'primeng/dynamicdialog';
import {GateMovementCloseDialogComponent} from './gate-movement-close-dialog/gate-movement-close-dialog.component';
import {VehicleOccupant} from '../vehicle-occupant/vehicle-occupant.model';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';

@Component({
  selector: 'app-inm-gate-movement-view',
  templateUrl: 'gate-movement-view.component.html'
})
export class GateMovementViewComponent implements OnInit, ExitConfirmation {

  id: number;
  gateMovement: GateMovement = new GateMovement();

  @ViewChild(NgForm) gateMovementForm: NgForm;
  gateMovementStatusKinds = [];
  inOutKinds = [];
  gateMovementTypes = [];
  vehicles = [];
  gateMovementVisitDestinations = [];
  inmates = [];
  inmateDialogUrl: string;
  typeOfMovement;
  reasonForMovement;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private genParameterService: GenParameterService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private gateMovementService: GateMovementService,
    private dialogService: DialogService,
    private dateService: DateService,
    private enumService: EnumService,
    private vehicleService: VehicleService,
    private gateMovementTypeService: GateMovementTypeService) {}

  ngOnInit() {

    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    if (this.id) {
      this.gateMovement = this.route.snapshot.data['record'];
    }
    else {
      this.gateMovement = new GateMovement();
      this.gateMovement.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    }

    this.vehicleService.getAllVehicles().subscribe(response => {
      this.vehicles = response;
    });

    this.gateMovementTypeService.getAllGateMovementTypes().subscribe(response => {
      this.gateMovementTypes = response;
      this.movementTypeIdChanged();
    });

    this.enumService.getEnumValues('inm.core.enums.GateMovementStatus').subscribe(responseData => {
      this.gateMovementStatusKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.InOutKind').subscribe(responseData => {
      this.inOutKinds = responseData;
    });

    // Visit Destinations
    this.genParameterService.getByCategory(GenParameterCategory.GateMovement_VisitDestination, true, [this.gateMovement.visitDestinationPid]).subscribe(responseData => {
      this.gateMovementVisitDestinations = responseData;
    });

    // Inmates url
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.gateMovementForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/inm/gatemovement/view']);
  }
  goToList() {
    this.router.navigate(['/inm/gatemovement/list']);
    
  }

  saveGateMovement() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.gateMovementService.saveGateMovement(this.gateMovement).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.gateMovementForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/inm/gatemovement/view/', responseData.id]);
        } else {
          this.gateMovement = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteGateMovement() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.gateMovementService.deleteGateMovement(this.gateMovement.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.gateMovementForm.form.markAsPristine();
            this.router.navigate(['/inm/gatemovement/list']);
          },
          error: (responseError) => {
            this.toitsuToasterService.apiValidationErrors(responseError);
          }
        }).add(() => {
          this.toitsuBlockUiService.unblockUi();
        });
      }
    });
  }

  movementTypeIdChanged() {

    let defaultMovementDirection;

    const foundCurrentGateMovementType = this.gateMovementTypes.find((result) => {
      return result.id === this.gateMovement.movementTypeId;
    });

    if (foundCurrentGateMovementType) {
      this.typeOfMovement = foundCurrentGateMovementType.movementKind;
      this.reasonForMovement = foundCurrentGateMovementType.reasonForInmateMovementKind;
      defaultMovementDirection = foundCurrentGateMovementType.defaultInOutKind;
    }
    if (!this.typeOfMovement) {
      this.gateMovement.inOutKind = null;
    }
    else {
      this.gateMovement.inOutKind = defaultMovementDirection;
    }

    // Κοινά πεδία
    // this.gateMovement.firstSearchEmployeeId = null;
    // this.gateMovement.secondSearchEmployeeId = null;
    // this.gateMovement.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
    // this.gateMovement.comments = null;
    if (!this.gateMovement.movementTypeId) {
      this.gateMovement = new GateMovement();
      this.gateMovement.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
      this.typeOfMovement = null;
      this.reasonForMovement = null;
      defaultMovementDirection = null;
    }
    if (!this.id) {
      this.gateMovement.inOutKind = defaultMovementDirection;
      this.gateMovement.inmateId = this.typeOfMovement === 'INMATE' ? this.gateMovement.inmateId : null;
      this.gateMovement.vacationId = this.typeOfMovement === 'INMATE' && this.typeOfMovement === 'VACATION' ? this.gateMovement.vacationId : null;
      this.gateMovement.transferId = this.typeOfMovement === 'INMATE' && this.typeOfMovement === 'TRANSFER' ? this.gateMovement.transferId : null;
      this.gateMovement.escortName = this.typeOfMovement === 'INMATE' ? this.gateMovement.escortName : null;
      this.gateMovement.escortStatus = this.typeOfMovement === 'INMATE' ? this.gateMovement.escortStatus : null;
      this.gateMovement.escortService = this.typeOfMovement === 'INMATE' ? this.gateMovement.escortService : null;
      this.gateMovement.visitorId = this.typeOfMovement === 'VISITOR' ? this.gateMovement.visitorId : null;
      this.gateMovement.vehicleId = this.typeOfMovement === 'VEHICLE' ? this.gateMovement.vehicleId : null;
      this.gateMovement.visitDestinationPid = this.typeOfMovement === 'VEHICLE' || this.typeOfMovement === 'VISITOR' ? this.gateMovement.visitDestinationPid : null;
      this.gateMovement.vehicleDriverVisitorId = this.typeOfMovement === 'VEHICLE' ? this.gateMovement.vehicleDriverVisitorId : null;
      this.gateMovement.vehicleOccupants = this.typeOfMovement === 'VEHICLE' ? this.gateMovement.vehicleOccupants : [];
      this.gateMovement.employeeId = this.typeOfMovement === 'EMPLOYEE' ? this.gateMovement.employeeId : null;
    }
  }

  openDialog() {
    this.toitsuToasterService.clearMessages();
    const ref = this.dialogService.open(GateMovementCloseDialogComponent, {
      data: {
        id: this.id,
        movementKind: this.typeOfMovement,
        escortName: this.gateMovement.escortName,
        escortService: this.gateMovement.escortService,
        escortStatus: this.gateMovement.escortStatus
      },
      header: this.translate.instant('gateMovement.dialog.oppositeMovementDetails'),
      width: '60%'
    });

    ref.onClose.subscribe(result => {
      this.router.navigate(['/inm/gatemovement/list']);
    });
  }

  addVehicleOccupant() {
    let vehicleOccupant = new VehicleOccupant();
    this.gateMovement.vehicleOccupants.push(vehicleOccupant);
  }

  removeVehicleOccupant(index) {
    this.gateMovement.vehicleOccupants.splice(index, 1);
  }
}
