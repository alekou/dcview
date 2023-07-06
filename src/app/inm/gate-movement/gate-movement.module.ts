import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {SelectVehicleComponent} from '../vehicle/select-vehicle/select-vehicle.component';
import {VehicleListDialogComponent} from '../vehicle/vehicle-list-dialog/vehicle-list-dialog.component';
import {VehicleViewDialogComponent} from '../vehicle/vehicle-view-dialog/vehicle-view-dialog.component';
import {gateMovementRoutes} from './gate-movement.routing';
import {GateMovementListComponent} from './gate-movement-list.component';
import {GateMovementViewComponent} from './gate-movement-view.component';
import {GateMovementCloseDialogComponent} from './gate-movement-close-dialog/gate-movement-close-dialog.component';
import {GateMovementMassCreateComponent} from './gate-movement-mass-create.component';
import {GateMovementMassCloseComponent} from './gate-movement-mass-close.component';

@NgModule({
  declarations: [
    GateMovementListComponent,
    GateMovementViewComponent,
    GateMovementCloseDialogComponent,
    GateMovementMassCreateComponent,
    GateMovementMassCloseComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(gateMovementRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    SelectVehicleComponent,
    VehicleListDialogComponent,
    VehicleViewDialogComponent
  ]
})
export class GateMovementModule {
}
