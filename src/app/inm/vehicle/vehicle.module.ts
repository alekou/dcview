import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {vehicleRoutes} from './vehicle.routing';
import {VehicleListComponent} from './vehicle-list.component';
import {VehicleViewComponent} from './vehicle-view.component';

@NgModule({
  declarations: [
    VehicleListComponent,
    VehicleViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(vehicleRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class VehicleModule {
}
