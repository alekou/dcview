import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {laborProtocolRoutes} from './labor-protocol.routing';
import {LaborProtocolListComponent} from './labor-protocol-list.component';
import {LaborProtocolViewComponent} from './labor-protocol-view.component';

@NgModule({
  declarations: [
    LaborProtocolListComponent,
    LaborProtocolViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(laborProtocolRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class LaborProtocolModule {
}
