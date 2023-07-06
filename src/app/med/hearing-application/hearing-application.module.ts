import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ToitsuSharedModule} from '../../toitsu-shared/toitsu-shared.module';
import {GeneralSharedModule} from '../../_general/general-shared.module';
import {medHearingApplicationRoutes} from './hearing-application.routing';
import {HearingApplicationListComponent} from './hearing-application-list.component';
import {HearingApplicationViewComponent} from './hearing-application-view.component';

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    RouterModule.forChild(medHearingApplicationRoutes),
    ToitsuSharedModule,
    GeneralSharedModule,
    HearingApplicationListComponent,
    HearingApplicationViewComponent
  ]
})
export class MedHearingApplicationModule {
}
