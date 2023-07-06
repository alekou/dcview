import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToitsuToasterService} from '../../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {GateMovement} from '../gate-movement.model';
import {GateMovementService} from '../gate-movement.service';
import {ToitsuBlockUiService} from '../../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {DateService} from '../../../toitsu-shared/date.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ConfirmationService} from 'primeng/api';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-inm-gate-movement-close-dialog',
  templateUrl: 'gate-movement-close-dialog.component.html'
})
export class GateMovementCloseDialogComponent implements OnInit {
  
  @ViewChild(NgForm) closeGateMovementForm: NgForm;
  gateMovementIdToClose: number;
  movementKind;
  escortName;
  escortService;
  escortStatus;
  gateMovement: GateMovement = new GateMovement();
  employees = [];

  constructor(
    private translate: TranslateService,
    private router: Router,
    private toitsuToasterService: ToitsuToasterService,
    private gateMovementService: GateMovementService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService,
    private confirmationService: ConfirmationService,
    private dynamicDialogRef: DynamicDialogRef,
    private dynamicDialogConfig: DynamicDialogConfig,
    private toitsuBlockUiService: ToitsuBlockUiService
  ) {
    this.gateMovementIdToClose = this.dynamicDialogConfig.data['id'];
    this.movementKind = this.dynamicDialogConfig.data['movementKind'];
    this.escortName = this.dynamicDialogConfig.data['escortName'];
    this.escortStatus =  this.dynamicDialogConfig.data['escortStatus'];
    this.escortService = this.dynamicDialogConfig.data['escortService'];
  }

  ngOnInit() {
    this.gateMovement.movementDate = this.dateService.getCurrentDateTimeString() as unknown as Date;
  }

  closeGateMovement() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.gateMovementService.createOppositeMovement(this.gateMovementIdToClose, this.gateMovement).subscribe( {
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.router.navigate(['inm/gatemovement/list']);
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.dynamicDialogRef.close(this.gateMovementIdToClose);
      this.toitsuBlockUiService.unblockUi();
    });
  }

  cancel() {
    if (this.closeGateMovementForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant('global.exit.confirmation'),
        accept: () => {
          this.dynamicDialogRef.close();
        },
        reject: () => {

        }
      });
    }
    else {
      this.dynamicDialogRef.close();
    }
  }

  getPreviousEscorts() {
    this.gateMovement.escortName = this.escortName;
    this.gateMovement.escortStatus = this.escortStatus;
    this.gateMovement.escortService = this.escortService;
  }
}
