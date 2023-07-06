import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {placementProtocolRoutes} from './placement-protocol.routing';
import {PlacementProtocolListComponent} from './placement-protocol-list.component';
import {PlacementProtocolViewComponent} from './placement-protocol-view.component';

@NgModule({
  declarations: [
    PlacementProtocolListComponent,
    PlacementProtocolViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(placementProtocolRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class PlacementProtocolModule {
}
