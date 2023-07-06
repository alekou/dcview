import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {courtSummonsRoutes} from './court-summons.routing';
import {CourtSummonsListComponent} from './court-summons-list.component';
import {CourtSummonsViewComponent} from './court-summons-view.component';

@NgModule({
  declarations: [
    CourtSummonsListComponent,
    CourtSummonsViewComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(courtSummonsRoutes),
    ToitsuSharedModule,
    GeneralSharedModule
  ]
})
export class CourtSummonsModule {
}
