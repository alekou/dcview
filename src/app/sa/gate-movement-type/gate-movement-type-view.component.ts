import {Component, OnInit, ViewChild} from '@angular/core';
import {ExitConfirmation} from '../../toitsu-shared/exit-confirmation.guard';
import {NgForm} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import {ToitsuToasterService} from '../../toitsu-shared/toitsu-toaster/toitsu-toaster.service';
import {ToitsuBlockUiService} from '../../toitsu-shared/toitsu-blockui/toitsu-block-ui.service';
import {ToitsuSharedService} from '../../toitsu-shared/toitsu-shared.service';
import {EnumService} from '../../cm/enum/enum.service';
import {Observable} from 'rxjs';
import {GateMovementType} from './gate-movement-type.model';
import {GateMovementTypeService} from './gate-movement-type.service';

@Component({
  selector: 'app-inm-gate-movement-type-view',
  templateUrl: 'gate-movement-type-view.component.html'
})
export class GateMovementTypeViewComponent implements OnInit, ExitConfirmation {

  @ViewChild(NgForm) gateMovementTypeForm: NgForm;
  id: number;
  gateMovementType: GateMovementType = new GateMovementType();
  gateMovementTypeKinds = [];
  reasonForInmateMovementKinds = [];
  defaultInOutKinds = [];

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toitsuToasterService: ToitsuToasterService,
    private toitsuBlockUiService: ToitsuBlockUiService,
    private toitsuSharedService: ToitsuSharedService,
    private enumService: EnumService,
    private gateMovementTypeService: GateMovementTypeService) {}

  ngOnInit() {
    // Get the id from the route
    this.id = +this.route.snapshot.params['id'];

    // Get the record from the route resolver or initialize a new one
    this.gateMovementType = this.id ? this.route.snapshot.data['record'] : new GateMovementType();

    this.enumService.getEnumValues('inm.core.enums.MovementKind').subscribe(responseData => {
      this.gateMovementTypeKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.ReasonForInmateMovementKind').subscribe(responseData => {
      this.reasonForInmateMovementKinds = responseData;
    });

    this.enumService.getEnumValues('inm.core.enums.InOutKind').subscribe(responseData => {
      this.defaultInOutKinds = responseData;
    });
  }

  confirmExit(): boolean | Observable<boolean> {
    return this.gateMovementTypeForm.dirty;
  }

  newRecord() {
    this.router.navigate(['/sa/gatemovementtype/view']);
  }

  goToList() {
    this.router.navigate(['/sa/gatemovementtype/list']);
  }

  saveGateMovementType() {
    this.toitsuToasterService.clearMessages();
    this.toitsuBlockUiService.blockUi();

    this.gateMovementTypeService.saveGateMovementType(this.gateMovementType).subscribe({
      next: (responseData: any) => {
        this.toitsuToasterService.showSuccessStay();
        this.gateMovementTypeForm.form.markAsPristine();
        if (!this.id) {
          this.router.navigate(['/sa/gatemovementtype/view/', responseData.id]);
        } else {
          this.gateMovementType = responseData;
        }
      },
      error: (responseError) => {
        this.toitsuToasterService.apiValidationErrors(responseError);
      }
    }).add(() => {
      this.toitsuBlockUiService.unblockUi();
    });
  }

  deleteGateMovementType() {
    this.confirmationService.confirm({
      message: this.translate.instant('global.delete.confirmation'),
      accept: () => {
        this.toitsuToasterService.clearMessages();
        this.toitsuBlockUiService.blockUi();

        this.gateMovementTypeService.deleteGateMovementType(this.gateMovementType.id).subscribe({
          next: (responseData) => {
            this.toitsuToasterService.showSuccessStay(this.translate.instant('global.delete.success'));
            this.gateMovementTypeForm.form.markAsPristine();
            this.router.navigate(['/sa/gatemovementtype/list']);
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
}
