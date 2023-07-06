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
import {EnumService} from '../../cm/enum/enum.service';
import {GateMovementTypeService} from '../../sa/gate-movement-type/gate-movement-type.service';
import {Observable} from 'rxjs';
import {DateService} from '../../toitsu-shared/date.service';
import {GenParameterService} from '../../sa/gen-parameter/gen-parameter.service';
import {inmateConsts} from '../inmate/inmate.consts';
import {GenParameterCategory} from '../../sa/gen-parameter/gen-parameter.category';
import {InmateService} from '../inmate/inmate.service';

@Component({
  selector: 'app-inm-gate-movement-mass-create',
  templateUrl: 'gate-movement-mass-create.component.html'
})
export class GateMovementMassCreateComponent implements OnInit, ExitConfirmation {
  id: number;
  gateMovement: GateMovement = new GateMovement();

  @ViewChild('massCreateForm') gateMovementForm: NgForm;

  gateMovementStatusKinds = [];
  inOutKinds = [];
  allMovementTypeDescriptions = [];
  typeOfMovement;
  reasonForMovement;
  defaultMovementDirection;
  inmateDialogUrl: string;
  inmates = [];
  gateMovementsToSave: GateMovement[] = [];
  gateMovementVisitDestinations = [];

  constructor(
    private inmateService: InmateService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private gateMovementService: GateMovementService,
    private enumService: EnumService,
    private dateService: DateService,
    private genParameterService: GenParameterService,
    private gateMovementTypeService: GateMovementTypeService) {}

  ngOnInit() {

    this.gateMovement.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;

    this.gateMovementTypeService.getAllGateMovementTypes().subscribe(response => {
      this.allMovementTypeDescriptions = response;
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
    
    // Inmates
    this.inmateService.getActiveInmates().subscribe(responseData => {
      this.inmates = responseData;
    });
    this.inmateDialogUrl = inmateConsts.activeIndexUrl;
  }
  
  confirmExit(): boolean | Observable<boolean> {
    return this.gateMovementForm.dirty;
  }
  
  goToList() {
    this.router.navigate(['/inm/gatemovement/list']);
  }

  movementTypeIdChanged() {
    this.gateMovementsToSave = [];
    
    let foundCurrentGateMovementType = this.allMovementTypeDescriptions.find((result) => {
      return result.id === this.gateMovement.movementTypeId;
    });

    // Φιλτράρισμα ανάλογα με την περιγραφή του τύπου κίνησης
    if (foundCurrentGateMovementType) {
      // this.retrievedGateMovementTypeId = this.gateMovement.movementTypeId;
      this.typeOfMovement = foundCurrentGateMovementType.movementKind;
      this.reasonForMovement = foundCurrentGateMovementType.reasonForInmateMovementKind;
      this.defaultMovementDirection = foundCurrentGateMovementType.defaultInOutKind;
    }
    if (!this.typeOfMovement) {
      this.gateMovement.inOutKind = null;
      this.gateMovementsToSave = [];
    }
    else {
      this.gateMovement.inOutKind = this.defaultMovementDirection;
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
      this.defaultMovementDirection = null;
    }
    if (!this.id) {
      this.gateMovement.inOutKind = this.defaultMovementDirection;
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

  newRecord() {

    let gateMovement = new GateMovement();

    gateMovement.movementTypeId = this.gateMovement.movementTypeId;
    gateMovement.inOutKind = this.defaultMovementDirection;
    gateMovement.movementDate = this.gateMovement.movementDate;
    gateMovement.comments = this.gateMovement.comments;
    gateMovement.firstSearchEmployeeId = this.gateMovement.firstSearchEmployeeId;
    gateMovement.secondSearchEmployeeId = this.gateMovement.secondSearchEmployeeId;
    gateMovement.escortName = this.gateMovement.escortName;
    gateMovement.escortStatus = this.gateMovement.escortStatus;
    gateMovement.escortService = this.gateMovement.escortService;

    this.gateMovementsToSave.push(gateMovement);
  }

  removeGateMovementFromList(index) {
    this.gateMovementsToSave.splice(index,  1);
  }

  massCreate() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.gateMovementService.gateMovementMassCreate(this.gateMovementsToSave).subscribe({
      next: (responseData: GateMovement[]) => {
        this.toitsuToasterService.showSuccessStay();
        this.router.navigate(['/inm/gatemovement/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }
}

