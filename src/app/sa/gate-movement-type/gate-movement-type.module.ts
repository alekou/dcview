import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {gateMovementTypeRouting} from './gate-movement-type.routing';
import {GateMovementTypeListComponent} from './gate-movement-type-list.component';
import {GateMovementTypeViewComponent} from './gate-movement-type-view.component';

@NgModule({
  declarations: [
    GateMovementTypeListComponent,
    GateMovementTypeViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(gateMovementTypeRouting),
    ToitsuSharedModule,
    GeneralSharedModule,
  ]
})
export class GateMovementTypeModule {
}
