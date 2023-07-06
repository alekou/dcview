import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {transportRoutes} from './transport.routing';
import {TransportListComponent} from './transport-list.component';
import {TransportViewComponent} from './transport-view.component';

@NgModule({
  declarations: [
    TransportListComponent,
    TransportViewComponent,
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(transportRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class TransportModule {
}
